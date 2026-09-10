import { context, db as dbCore, tenancy } from "@budibase/backend-core"
import {
  Database,
  Plugin,
  PluginType,
  ScreenProps,
  Workspace,
} from "@budibase/types"
import * as screens from "../workspace/screens"
import { DocumentType } from "../../db/utils"

const collectPluginComponents = (
  component?: ScreenProps,
  pluginComponentNames?: Set<string>
) => {
  if (!component || !pluginComponentNames) {
    return
  }
  if (
    typeof component._component === "string" &&
    component._component.startsWith("plugin/")
  ) {
    pluginComponentNames.add(component._component)
  }
  if (Array.isArray(component._children)) {
    component._children.forEach(child =>
      collectPluginComponents(child, pluginComponentNames)
    )
  }
}

export const reconcileUsedPlugins = async (
  db: Database = context.getWorkspaceDB()
): Promise<Plugin[]> => {
  const allScreens = await screens.fetch(db)
  const pluginComponentNames = new Set<string>()

  for (const screen of allScreens) {
    collectPluginComponents(screen.props, pluginComponentNames)
  }

  const application = await db.get<Workspace>(DocumentType.WORKSPACE_METADATA)
  const currentUsedPlugins = application.usedPlugins || []

  let nextUsedPlugins: Plugin[] = []
  if (pluginComponentNames.size > 0) {
    const globalDB = tenancy.getGlobalDB()
    const pluginsResponse = await globalDB.allDocs<Plugin>(
      dbCore.getPluginParams(null, {
        include_docs: true,
      })
    )
    const requiredPlugins = pluginsResponse.rows
      .map(row => row.doc)
      .filter((plugin?: Plugin): plugin is Plugin => {
        return (
          plugin?.schema?.type === PluginType.COMPONENT &&
          pluginComponentNames.has(`plugin/${plugin.name}`)
        )
      })

    nextUsedPlugins = requiredPlugins
  }

  const currentIds = currentUsedPlugins
    .map(p => p._id)
    .filter(Boolean)
    .sort()
    .join(",")
  const nextIds = nextUsedPlugins
    .map(p => p._id)
    .filter(Boolean)
    .sort()
    .join(",")

  if (
    currentIds !== nextIds ||
    currentUsedPlugins.length !== nextUsedPlugins.length
  ) {
    await db.put({
      ...application,
      usedPlugins: nextUsedPlugins,
    })
  }

  return nextUsedPlugins
}
