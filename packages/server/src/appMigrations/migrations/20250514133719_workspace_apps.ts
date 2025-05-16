import { Screen } from "@budibase/types"
import sdk from "../../sdk"
import { context } from "@budibase/backend-core"

const migration = async () => {
  const screens = await sdk.screens.fetch()

  const application = await sdk.applications.metadata.get()
  const allProjectApps = await sdk.workspaceApps.fetch()
  let projectAppId = allProjectApps.find(p => p.name === application.name)?._id
  if (!projectAppId) {
    const projectApp = await sdk.workspaceApps.create({
      name: application.name,
      urlPrefix: "/",
      icon: "Monitoring",
    })
    projectAppId = projectApp._id
  }

  const db = context.getAppDB()
  await db.bulkDocs(
    screens
      .filter(s => !s.projectAppId)
      .map<Screen>(s => ({
        ...s,
        projectAppId,
      }))
  )
}

export default migration
