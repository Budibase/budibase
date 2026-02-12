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

  function isWorkspaceAppMatch(
    urlPath: string,
    { url, isDefault }: WorkspaceApp
  ) {
    return (
      urlPath.replace(/\/$/, "") === `${baseUrl}${url.replace(/\/$/, "")}` ||
      (embedUrl &&
        urlPath.replace(/\/$/, "") ===
          `${embedUrl}${url.replace(/\/$/, "")}`) ||
      (!urlPath && isDefault) // Support getMatchedWorkspaceApp without url referrer
    )
  }

  const findWorkspaceApp = (urlPath: string) =>
    allWorkspaceApps.find(workspaceApp =>
      isWorkspaceAppMatch(urlPath, workspaceApp)
    )

  const matchedWorkspaceApp = findWorkspaceApp(fromUrl)
  if (matchedWorkspaceApp) {
    return matchedWorkspaceApp
  }

  const chatPath = fromUrl.replace(/\/_chat(?:\/.*)?$/, "")
  if (chatPath !== fromUrl) {
    return findWorkspaceApp(chatPath)
  }

  return matchedWorkspaceApp
}
