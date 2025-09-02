import { WorkspaceApp } from "@budibase/types"
import sdk from "../.."
import { db } from "@budibase/backend-core"

export async function getMatchedWorkspaceApp(
  fromUrl: string
): Promise<WorkspaceApp | undefined> {
  const app = await sdk.workspaces.metadata.get()
  const baseAppUrl = db.isProdWorkspaceID(app.appId)
    ? `/app/${app.url}`.replace("//", "/")
    : `/${app.appId}`

  const embedAppUrl = db.isProdWorkspaceID(app.appId)
    ? `/embed/${app.url}`.replace("//", "/")
    : null

  const allWorkspaceApps = await sdk.workspaceApps.fetch()

  function isWorkspaceAppMatch({ url, isDefault }: WorkspaceApp) {
    return (
      fromUrl.replace(/\/$/, "") === `${baseAppUrl}${url.replace(/\/$/, "")}` ||
      (embedAppUrl &&
        fromUrl.replace(/\/$/, "") ===
          `${embedAppUrl}${url.replace(/\/$/, "")}`) ||
      (!fromUrl && isDefault) // Support getMatchedWorkspaceApp without url referrer
    )
  }

  const matchedWorkspaceApp = allWorkspaceApps.find(isWorkspaceAppMatch)
  return matchedWorkspaceApp
}
