import { db } from "@budibase/backend-core"
import { WorkspaceApp } from "@budibase/types"
import sdk from "../.."

export async function getMatchedWorkspaceApp(
  fromUrl: string
): Promise<WorkspaceApp | undefined> {
  const workspace = await sdk.workspaces.metadata.get()
  const normalizedFromUrl = fromUrl.split("?")[0]
  const baseUrl = db.isProdWorkspaceID(workspace.appId)
    ? `/app/${workspace.url}`.replace("//", "/")
    : `/${workspace.appId}`

  const chatUrl = db.isProdWorkspaceID(workspace.appId)
    ? `/app-chat/${workspace.url}`.replace("//", "/")
    : `/app-chat/${workspace.appId}`

  const embedUrl = db.isProdWorkspaceID(workspace.appId)
    ? `/embed/${workspace.url}`.replace("//", "/")
    : null

  const allWorkspaceApps = await sdk.workspaceApps.fetch()
  const enabledWorkspaceApps = allWorkspaceApps.filter(app => !app.disabled)

  const getDefaultWorkspaceApp = () =>
    enabledWorkspaceApps.find(app => app.isDefault) || enabledWorkspaceApps[0]

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

  if (
    normalizedFromUrl.replace(/\/$/, "") === chatUrl.replace(/\/$/, "") ||
    normalizedFromUrl.startsWith(`${chatUrl.replace(/\/$/, "")}/`)
  ) {
    return getDefaultWorkspaceApp()
  }

  const matchedWorkspaceApp = findWorkspaceApp(normalizedFromUrl)
  if (matchedWorkspaceApp) {
    return matchedWorkspaceApp
  }

  const chatPath = normalizedFromUrl.replace(/\/_chat(?:\/.*)?$/, "")
  if (chatPath !== normalizedFromUrl) {
    return findWorkspaceApp(chatPath)
  }

  return matchedWorkspaceApp
}
