import { DesignDocument, Document, Screen } from "@budibase/types"
import sdk from "../../sdk"
import { context, ViewName } from "@budibase/backend-core"

const migration = async () => {
  const screens = await sdk.screens.fetch()

  const application = await sdk.applications.metadata.get()
  const allWorkspaceApps = await sdk.workspaceApps.fetch()
  let workspaceAppId = allWorkspaceApps.find(
    p => p.name === application.name
  )?._id
  if (!workspaceAppId) {
    const workspaceApp = await sdk.workspaceApps.create({
      name: application.name,
      urlPrefix: "/",
      icon: "Monitoring",
      navigation: application.navigation!,
    })
    workspaceAppId = workspaceApp._id
  }

  const db = context.getAppDB()
  const docsToUpdate: Document[] = screens
    .filter(s => !s.workspaceAppId)
    .map<Screen>(s => ({
      ...s,
      workspaceAppId,
    }))

  const designDoc = await db.get<DesignDocument>("_design/database")
  // Remove the routing view to be recreated (and updated to support workspace apps)
  delete designDoc.views?.[ViewName.ROUTING]
  docsToUpdate.push(designDoc)

  await db.bulkDocs(docsToUpdate)
}

export default migration
