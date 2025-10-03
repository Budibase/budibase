import { db } from "@budibase/backend-core"
import { WorkspaceApp } from "@budibase/types"
import sdk from "../.."

export async function getMatchedWorkspaceApp(
  fromUrl: string
): Promise<WorkspaceApp | undefined> {
  const workspace = await sdk.workspaces.metadata.get()
  const baseUrl = db.isProdWorkspaceID(workspace.appId)
    ? `/app/${workspace.url}`.replace("//", "/")
    : `/${workspace.appId}`

  const embedUrl = db.isProdWorkspaceID(workspace.appId)
    ? `/embed/${workspace.url}`.replace("//", "/")
    : null

  const allWorkspaceApps = await sdk.workspaceApps.fetch()

  function isWorkspaceAppMatch({ url, isDefault }: WorkspaceApp) {
    return (
      fromUrl.replace(/\/$/, "") === `${baseUrl}${url.replace(/\/$/, "")}` ||
      (embedUrl &&
        fromUrl.replace(/\/$/, "") ===
          `${embedUrl}${url.replace(/\/$/, "")}`) ||
      (!fromUrl && isDefault) // Support getMatchedWorkspaceApp without url referrer
    )
  }

  const matchedWorkspaceApp = allWorkspaceApps.find(isWorkspaceAppMatch)
  return matchedWorkspaceApp
}
