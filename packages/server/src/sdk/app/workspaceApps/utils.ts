import { WorkspaceApp } from "@budibase/types"
import sdk from "../.."
import { db } from "@budibase/backend-core"

export async function getMatchedWorkspaceApp(fromUrl: string) {
  const app = await sdk.applications.metadata.get()
  const baseAppUrl = db.isProdAppID(app.appId)
    ? `/app/${app.url}`.replace("//", "/")
    : `/${app.appId}`

  const allWorkspaceApps = await sdk.workspaceApps.fetch()

  function isWorkspaceAppMatch({ urlPrefix }: WorkspaceApp) {
    return (
      fromUrl.replace(/\/$/, "") ===
      `${baseAppUrl}${urlPrefix.replace(/\/$/, "")}`
    )
  }

  const matchedWorkspaceApp = allWorkspaceApps.find(isWorkspaceAppMatch)
  return matchedWorkspaceApp
}
