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

  const normalizedPath = fromUrl.replace(/\/$/, "") || ""
  const isRootPath =
    !fromUrl || fromUrl === "/" || normalizedPath === ""
  const isHostEmbedPath =
    normalizedPath === "/embed" || normalizedPath.startsWith("/embed/")

  function isWorkspaceAppMatch({ url, isDefault }: WorkspaceApp) {
    return (
      fromUrl.replace(/\/$/, "") === `${baseUrl}${url.replace(/\/$/, "")}` ||
      (embedUrl &&
        fromUrl.replace(/\/$/, "") ===
          `${embedUrl}${url.replace(/\/$/, "")}`) ||
      (isRootPath && isDefault) ||
      (isHostEmbedPath && isDefault) // Host app embed route (e.g. /embed) uses default workspace app
    )
  }

  let matchedWorkspaceApp = allWorkspaceApps.find(isWorkspaceAppMatch)
  if (
    !matchedWorkspaceApp &&
    (isRootPath || isHostEmbedPath) &&
    allWorkspaceApps.length > 0
  ) {
    matchedWorkspaceApp =
      allWorkspaceApps.find(w => w.isDefault) ?? allWorkspaceApps[0]
  }
  return matchedWorkspaceApp
}
