import { context, ViewName } from "@budibase/backend-core"
import { DesignDocument, Document, Screen } from "@budibase/types"
import sdk from "../../sdk"

const migration = async () => {
  const screens = await sdk.screens.fetch()

  const application = await sdk.applications.metadata.get()
  const allWorkspaceApps = await sdk.workspaceApps.fetch(context.getAppDB())
  let [existingWorkspaceApp] = allWorkspaceApps
  if (!existingWorkspaceApp) {
    const workspaceApp = await sdk.workspaceApps.create({
      name: application.name,
      url: "/",
      navigation: application.navigation!,
      isDefault: true,
    })
    existingWorkspaceApp = workspaceApp
  }

  const db = context.getAppDB()
  const docsToUpdate: Document[] = screens
    .filter(s => !s.workspaceAppId)
    .map<Screen>(s => ({
      ...s,
      workspaceAppId: existingWorkspaceApp._id!,
    }))

  // Fixing half migrated workspaces apps, due unexpected migrations ran on some apps
  for (const workspaceApp of allWorkspaceApps) {
    if (workspaceApp.url) {
      continue
    }

    docsToUpdate.push({
      ...workspaceApp,
      // @ts-expect-error urlPrefix was deleted from the object
      url: workspaceApp.urlPrefix || "/",
      urlPrefix: undefined,
    })
  }

  const designDoc = await db.get<DesignDocument>("_design/database")
  if (
    designDoc.views?.[ViewName.ROUTING] &&
    // If there is no version, it is an old view
    designDoc.views[ViewName.ROUTING].version === undefined
  ) {
    // Remove the routing view to be recreated (and updated to support workspace apps)
    delete designDoc.views?.[ViewName.ROUTING]
    docsToUpdate.push(designDoc)
  }

  await db.bulkDocs(docsToUpdate)
}

export default migration
