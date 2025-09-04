import { context } from "@budibase/backend-core"
import sdk from "../../sdk"
import { Document } from "@budibase/types"

const migration = async () => {
  const allWorkspaceApps = await sdk.workspaceApps.fetch()
  const defaultWorkspaceApps = allWorkspaceApps.filter(a => a.isDefault)
  if (defaultWorkspaceApps.length > 1) {
    const [workspaceAppToUse, ...toDelete] = defaultWorkspaceApps.sort((a, b) =>
      b.updatedAt!.localeCompare(a.updatedAt!)
    )

    const db = context.getAppDB()

    const docsToUpdate: Document[] = []

    const screens = await sdk.screens.fetch()
    for (const workspaceApp of toDelete) {
      docsToUpdate.push({ ...workspaceApp, _deleted: true })

      docsToUpdate.push(
        ...screens
          .filter(s => s.workspaceAppId === workspaceApp._id)
          .map(s => ({ ...s, workspaceAppId: workspaceAppToUse._id }))
      )
    }

    await db.bulkDocs(docsToUpdate)
  }
}

export default migration
