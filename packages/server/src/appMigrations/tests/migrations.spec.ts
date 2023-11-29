import { context } from "@budibase/backend-core"
import * as setup from "../../api/routes/tests/utilities"
import { MIGRATIONS } from "../migrations"

describe("migration", () => {
  it("each migration can rerun safely", async () => {
    const config = setup.getConfig()
    await config.init()

    await config.doInContext(config.getAppId(), async () => {
      const db = context.getAppDB()
      for (const migration of MIGRATIONS) {
        await migration.migrationFunc()
        const docs = await db.allDocs({ include_docs: true })

        await migration.migrationFunc()
        const latestDocs = await db.allDocs({ include_docs: true })

        expect(docs).toEqual(latestDocs)
      }
    })
  })
})
