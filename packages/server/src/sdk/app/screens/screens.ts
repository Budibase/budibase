import { context, utils } from "@budibase/backend-core"
import { Database, DocumentType, Screen, SEPARATOR } from "@budibase/types"
import { getScreenParams } from "../../../db/utils"
import sdk from "../.."

export async function fetch(
  db: Database = context.getAppDB()
): Promise<Screen[]> {
  const screens = (
    await db.allDocs<Screen>(
      getScreenParams(null, {
        include_docs: true,
      })
    )
  ).rows.map(el => el.doc!)

  if (screens.every(s => s.projectAppId)) {
    return screens
  }

  await migrateToProjectApp(screens)
  return fetch(db)
}

async function migrateToProjectApp(screens: Screen[]) {
  const application = await sdk.applications.metadata.get()
  if (screens.every(s => s.projectAppId)) {
    return screens
  }

  const allProjectApps = await sdk.projectApps.fetch()
  let projectAppId = allProjectApps.find(p => p.name === application.name)?._id
  if (!projectAppId) {
    // Forcing the _id to avoid concurrency issues
    const projectApp = await sdk.projectApps.update({
      _id: `${DocumentType.PROJECT_APP}${SEPARATOR}${utils.newid()}`,
      name: application.name,
      urlPrefix: "/",
      icon: "Monitoring",
    })
    projectAppId = projectApp._id
  }

  const db = context.getAppDB()
  await db.bulkDocs(
    screens.map<Screen>(s => ({
      ...s,
      projectAppId,
    }))
  )

  return sdk.screens.fetch()
}
