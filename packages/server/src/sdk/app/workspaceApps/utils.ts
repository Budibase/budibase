import { FeatureFlag, WorkspaceApp } from "@budibase/types"
import sdk from "../.."
import { db, features } from "@budibase/backend-core"

export async function getMatchedWorkspaceApp(fromUrl: string) {
  if (!(await features.isEnabled(FeatureFlag.WORKSPACE_APPS))) {
    return undefined
  }

  const app = await sdk.applications.metadata.get()
  const baseAppUrl = db.isProdAppID(app.appId)
    ? `/app/${app.url}`.replace("//", "/")
    : `/${app.appId}`

  const allWorkspaceApps = await sdk.workspaceApps.fetch()

  function isWorkspaceAppMatch({ url }: WorkspaceApp) {
    return (
      fromUrl.replace(/\/$/, "") === `${baseAppUrl}${url.replace(/\/$/, "")}`
    )
  }

  const matchedWorkspaceApp = allWorkspaceApps.find(isWorkspaceAppMatch)
  return matchedWorkspaceApp
}
