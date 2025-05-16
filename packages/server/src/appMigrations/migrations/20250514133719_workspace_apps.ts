import { Screen } from "@budibase/types"
import sdk from "../../sdk"
import { context } from "@budibase/backend-core"

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
    })
    workspaceAppId = workspaceApp._id
  }

  const db = context.getAppDB()
  await db.bulkDocs(
    screens
      .filter(s => !s.workspaceAppId)
      .map<Screen>(s => ({
        ...s,
        workspaceAppId,
      }))
  )
}

export default migration
