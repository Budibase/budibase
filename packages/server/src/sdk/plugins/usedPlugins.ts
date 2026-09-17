import {
  Plugin,
  PluginType,
  Screen,
  ScreenProps,
  Workspace,
} from "@budibase/types"
import { cache, context, db as dbCore, tenancy } from "@budibase/backend-core"
import { DocumentType, getScreenParams } from "../../db/utils"

export function findPluginsInProps(
  component?: ScreenProps,
  foundPlugins: Set<string> = new Set()
): Set<string> {
  if (!component) {
    return foundPlugins
  }
  if (
    typeof component._component === "string" &&
    component._component.startsWith("plugin/")
  ) {
    foundPlugins.add(component._component)
  }
  if (component._children && Array.isArray(component._children)) {
    for (const child of component._children) {
      findPluginsInProps(child, foundPlugins)
    }
  }
  return foundPlugins
}

export function areUsedPluginReferencesEqual(
  current: Plugin[] = [],
  next: Plugin[] = []
): boolean {
  if (current.length !== next.length) {
    return false
  }
  const nextById = new Map(next.map(plugin => [plugin._id, plugin]))
  return current.every(plugin => {
    const nextPlugin = nextById.get(plugin._id)
    return Boolean(
      nextPlugin &&
        nextPlugin.hash === plugin.hash &&
        nextPlugin.jsUrl === plugin.jsUrl
    )
  })
}

export async function addUsedPluginsForScreen(
  props: ScreenProps,
  workspaceId: string
): Promise<boolean> {
  const pluginComponentIds = findPluginsInProps(props)
  if (!pluginComponentIds.size) {
    return false
  }

  const pluginIds = Array.from(pluginComponentIds, componentId => {
    const pluginName = componentId.slice("plugin/".length)
    return dbCore.generatePluginID(pluginName)
  })

  return context.doInWorkspaceContext(workspaceId, async () => {
    const globalDB = tenancy.getGlobalDB()
    const pluginsResponse = await globalDB.allDocs<Plugin>({
      keys: pluginIds,
      include_docs: true,
    })
    const requiredPlugins = pluginsResponse.rows
      .map(row => row.doc)
      .filter(
        (plugin?: Plugin): plugin is Plugin =>
          plugin?.schema?.type === PluginType.COMPONENT
      )

    const db = context.getWorkspaceDB()
    const application = await db.get<Workspace>(DocumentType.WORKSPACE_METADATA)
    const usedPlugins = application.usedPlugins || []
    let pluginAdded = false

    requiredPlugins.forEach(plugin => {
      const existing = usedPlugins.find(x => x._id === plugin._id)
      if (!existing) {
        pluginAdded = true
        usedPlugins.push({
          _id: plugin._id,
          name: plugin.name,
          version: plugin.version,
          jsUrl: plugin.jsUrl,
          hash: plugin.hash,
        } as Plugin)
      } else if (
        existing.version !== plugin.version ||
        existing.hash !== plugin.hash ||
        existing.jsUrl !== plugin.jsUrl
      ) {
        pluginAdded = true
        existing.version = plugin.version
        existing.hash = plugin.hash
        existing.jsUrl = plugin.jsUrl
      }
    })

    if (pluginAdded) {
      application.usedPlugins = usedPlugins
      await db.put(application)
      await cache.workspace.invalidateWorkspaceMetadata(workspaceId)
    }

    return pluginAdded
  })
}

export async function reconcileWorkspaceUsedPlugins(
  workspaceId: string
): Promise<boolean> {
  return context.doInWorkspaceContext(workspaceId, async () => {
    const db = context.getWorkspaceDB()
    const screensResponse = await db.allDocs<Screen>(
      getScreenParams(null, { include_docs: true })
    )
    const screens = screensResponse.rows.map(row => row.doc!).filter(Boolean)
    const usedPluginComponentIds = new Set<string>()

    for (const screen of screens) {
      findPluginsInProps(screen.props, usedPluginComponentIds)
    }

    const application = await db.get<Workspace>(DocumentType.WORKSPACE_METADATA)
    const currentUsedPlugins: Plugin[] = application.usedPlugins || []

    let nextUsedPlugins: Plugin[] = []
    if (usedPluginComponentIds.size > 0) {
      const pluginIds = Array.from(usedPluginComponentIds, componentId => {
        const pluginName = componentId.slice("plugin/".length)
        return dbCore.generatePluginID(pluginName)
      })

      const globalDB = tenancy.getGlobalDB()
      const pluginsResponse = await globalDB.allDocs<Plugin>({
        keys: pluginIds,
        include_docs: true,
      })

      const globalPlugins = pluginsResponse.rows
        .map(row => row.doc)
        .filter(
          (plugin?: Plugin): plugin is Plugin =>
            plugin?.schema?.type === PluginType.COMPONENT
        )

      nextUsedPlugins = globalPlugins.map(
        plugin =>
          ({
            _id: plugin._id,
            name: plugin.name,
            version: plugin.version,
            jsUrl: plugin.jsUrl,
            hash: plugin.hash,
          }) as Plugin
      )
    }

    if (!areUsedPluginReferencesEqual(currentUsedPlugins, nextUsedPlugins)) {
      application.usedPlugins = nextUsedPlugins
      await db.put(application)
      await cache.workspace.invalidateWorkspaceMetadata(workspaceId)
      return true
    }

    return false
  })
}

export const filterExistingUsedPlugins = async (
  usedPlugins?: Plugin[]
): Promise<Plugin[]> => {
  if (!usedPlugins?.length) {
    return []
  }

  const pluginIds = usedPlugins
    .map(plugin => plugin?._id)
    .filter((id): id is string => typeof id === "string" && id.length > 0)

  if (!pluginIds.length) {
    return usedPlugins
  }

  try {
    const globalDB = tenancy.getGlobalDB()
    const response = await globalDB.allDocs<Plugin>({
      keys: pluginIds,
      include_docs: true,
    })

    const existingPluginDocs = new Map<string, Plugin>()
    for (const row of response?.rows || []) {
      if (row?.id && !row.error && !row.doc?._deleted && row.doc) {
        existingPluginDocs.set(row.id, row.doc)
      }
    }

    return usedPlugins
      .filter(
        plugin =>
          typeof plugin._id === "string" && existingPluginDocs.has(plugin._id)
      )
      .map(plugin => {
        const doc = existingPluginDocs.get(plugin._id!)
        return {
          ...plugin,
          schema: doc?.schema || plugin.schema,
        }
      })
  } catch {
    return usedPlugins
  }
}

export const enrichUsedPluginsWithSvelteMajor = async (
  usedPlugins?: Plugin[],
  pluginDocs?: Plugin[]
): Promise<Plugin[]> => {
  if (!usedPlugins?.length) {
    return []
  }

  const svelteMajorById = new Map<string, number>()
  if (pluginDocs?.length) {
    for (const doc of pluginDocs) {
      const svelteMajor = doc?.schema?.metadata?.svelteMajor
      if (typeof doc?._id === "string" && typeof svelteMajor === "number") {
        svelteMajorById.set(doc._id, svelteMajor)
      }
    }
  }

  return usedPlugins.map(plugin => {
    const svelteMajor =
      (typeof plugin?._id === "string"
        ? svelteMajorById.get(plugin._id)
        : undefined) ?? plugin?.schema?.metadata?.svelteMajor

    if (typeof svelteMajor !== "number") {
      return plugin
    }

    const schema = (plugin.schema || {}) as Plugin["schema"]
    const metadata = schema?.metadata || {}

    return {
      ...plugin,
      schema: {
        ...schema,
        metadata: {
          ...metadata,
          svelteMajor,
        },
      },
    }
  })
}
