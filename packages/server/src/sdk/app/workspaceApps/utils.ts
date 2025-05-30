import { WorkspaceApp } from "@budibase/types"
import sdk from "../.."
import { db } from "@budibase/backend-core"

export async function getMatchedWorkspaceApp(fromUrl: string | undefined) {
  const app = await sdk.applications.metadata.get()
  const baseAppUrl = db.isProdAppID(app.appId)
    ? `/app/${app.url}`.replace("//", "/")
    : `/${app.appId}`

  let allWorkspaceApps = await sdk.workspaceApps.fetch()
  // Sort decending to ensure we match the most strict, removing match conflicts
  allWorkspaceApps = allWorkspaceApps.sort((a, b) =>
    b.urlPrefix.localeCompare(a.urlPrefix)
  )

  function isWorkspaceAppMatch({ urlPrefix }: WorkspaceApp) {
    return (fromUrl || "/").startsWith(
      `${baseAppUrl}${urlPrefix}`.replace(/\/$/, "")
    )
  }

  const matchedWorkspaceApp = allWorkspaceApps.find(isWorkspaceAppMatch)
  return matchedWorkspaceApp
}
