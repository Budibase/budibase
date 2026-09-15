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

export function areUsedPluginsEqual(
  current: Plugin[] = [],
  next: Plugin[] = []
): boolean {
  if (current.length !== next.length) {
    return false
  }

  const currentSorted = [...current].sort((a, b) =>
    (a._id || "").localeCompare(b._id || "")
  )
  const nextSorted = [...next].sort((a, b) =>
    (a._id || "").localeCompare(b._id || "")
  )

  for (let i = 0; i < currentSorted.length; i++) {
    const a = currentSorted[i]
    const b = nextSorted[i]
    if (
      a._id !== b._id ||
      a.name !== b.name ||
      a.version !== b.version ||
      a.hash !== b.hash ||
      a.jsUrl !== b.jsUrl
    ) {
      return false
    }
  }

  return true
}

export async function addUsedPluginsForScreen(
  props: ScreenProps,
  workspaceId: string
): Promise<boolean> {
  const pluginNames = Array.from(findPluginsInProps(props))
  if (!pluginNames.length) {
    return false
  }

  return context.doInWorkspaceContext(workspaceId, async () => {
    const globalDB = tenancy.getGlobalDB()
    const pluginsResponse = await globalDB.allDocs(
      dbCore.getPluginParams(null, {
        include_docs: true,
      })
    )
    const requiredPlugins = pluginsResponse.rows
      .map((row: any) => row.doc)
      .filter(
        (plugin: Plugin) =>
          plugin?.schema?.type === PluginType.COMPONENT &&
          pluginNames.includes(`plugin/${plugin.name}`)
      )

    const db = context.getWorkspaceDB()
    const application = await db.get<Workspace>(DocumentType.WORKSPACE_METADATA)
    const usedPlugins = application.usedPlugins || []
    let pluginAdded = false

    requiredPlugins.forEach((plugin: Plugin) => {
      const existing = usedPlugins.find((x: Plugin) => x._id === plugin._id)
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
    const usedPluginNames = new Set<string>()

    for (const screen of screens) {
      findPluginsInProps(screen.props, usedPluginNames)
    }

    const application = await db.get<Workspace>(DocumentType.WORKSPACE_METADATA)
    const currentUsedPlugins: Plugin[] = application.usedPlugins || []

    let nextUsedPlugins: Plugin[] = []
    if (usedPluginNames.size > 0) {
      const globalDB = tenancy.getGlobalDB()
      const pluginsResponse = await globalDB.allDocs(
        dbCore.getPluginParams(null, {
          include_docs: true,
        })
      )

      const globalPlugins = pluginsResponse.rows
        .map((row: any) => row.doc)
        .filter(
          (plugin: Plugin) =>
            plugin?.schema?.type === PluginType.COMPONENT &&
            usedPluginNames.has(`plugin/${plugin.name}`)
        )

      nextUsedPlugins = globalPlugins.map(
        (plugin: Plugin) =>
          ({
            _id: plugin._id,
            name: plugin.name,
            version: plugin.version,
            jsUrl: plugin.jsUrl,
            hash: plugin.hash,
          }) as Plugin
      )
    }

    if (!areUsedPluginsEqual(currentUsedPlugins, nextUsedPlugins)) {
      application.usedPlugins = nextUsedPlugins
      await db.put(application)
      await cache.workspace.invalidateWorkspaceMetadata(workspaceId)
      return true
    }

    return false
  })
}

export const enrichUsedPluginSvelteMajors = async (
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
      include_docs: true,
      keys: pluginIds,
    })

    const svelteMajorById = new Map<string, number>()
    const existingPluginIds = new Set<string>()
    for (const row of response?.rows || []) {
      if (row?.doc && typeof row?.id === "string") {
        existingPluginIds.add(row.id)
        const svelteMajor = row.doc.schema?.metadata?.svelteMajor
        if (typeof svelteMajor === "number") {
          svelteMajorById.set(row.id, svelteMajor)
        }
      }
    }

    return usedPlugins
      .filter(plugin => existingPluginIds.has(plugin._id!))
      .map(plugin => {
        const svelteMajor = svelteMajorById.get(plugin._id!)
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
  } catch (err) {
    return usedPlugins
  }
}
