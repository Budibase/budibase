import { context } from "@budibase/backend-core"
import * as setup from "../../api/routes/tests/utilities"
import * as migrations from "../migrations"

describe("migration integrity", () => {
  // These test is checking that each migration is "idempotent".
  // We should be able to rerun any migration, with any rerun not modifiying anything. The code should be aware that the migration already ran
  it("each migration can rerun safely", async () => {
    const config = setup.getConfig()
    await config.init()

    await config.doInContext(config.getAppId(), async () => {
      const db = context.getAppDB()
      for (const migration of migrations.MIGRATIONS) {
        await migration.func()
        const docs = await db.allDocs({ include_docs: true })

        await migration.func()
        const latestDocs = await db.allDocs({ include_docs: true })

        expect(docs).toEqual(latestDocs)
      }
    })
  })
})
