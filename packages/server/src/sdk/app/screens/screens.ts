import { context } from "@budibase/backend-core"
import { Database, Screen, WithoutDocMetadata } from "@budibase/types"
import { generateScreenID, getScreenParams } from "../../../db/utils"
import sdk from "../.."

export async function fetch(
  db: Database = context.getAppDB()
): Promise<Screen[]> {
  const screens = (
    await db.allDocs<Screen>(
      getScreenParams(null, {
        include_docs: true,
      })
    )
  ).rows.map(el => el.doc!)

  // Handling a bug where some screens have missing workspaceAppId (in this case, they are part of the default workspace app)
  const screensWithMissingWorkspaceApp = screens.filter(s => !s.workspaceAppId)
  if (screensWithMissingWorkspaceApp.length) {
    const allWorkspaces = await sdk.workspaceApps.fetch()
    const defaultWorkspaceApp =
      allWorkspaces.find(a => a.isDefault) || allWorkspaces[0]
    if (defaultWorkspaceApp) {
      screensWithMissingWorkspaceApp.forEach(a => {
        a.workspaceAppId = defaultWorkspaceApp._id!
      })
    }
  }

  return screens
}

export async function create(
  screen: WithoutDocMetadata<Screen>
): Promise<Screen> {
  const db = context.getAppDB()

  const response = await db.put({ ...screen, _id: generateScreenID() })
  return {
    ...screen,
    _id: response.id,
    _rev: response.rev,
  }
}

export async function update(screen: Screen): Promise<Screen> {
  const db = context.getAppDB()

  const response = await db.put(screen)
  return {
    ...screen,
    _rev: response.rev,
  }
}
