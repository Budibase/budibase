import { WorkspaceApp } from "@budibase/types"
import sdk from "../.."
import { db } from "@budibase/backend-core"
import { defaultAppNavigator } from "../../../constants/definitions"

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

export async function createDefaultWorkspaceApp() {
  const appMetadata = await sdk.applications.metadata.get()
  return sdk.workspaceApps.create({
    name: appMetadata.name,
    urlPrefix: "/",
    icon: "Monitoring",
    navigation: defaultAppNavigator(appMetadata.name),
  })
}
