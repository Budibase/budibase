import { context } from "@budibase/backend-core"
import * as setup from "../../api/routes/tests/utilities"
import { MIGRATIONS } from "../migrations"
import { runMigration } from "../queue"

describe("migration", () => {
  it("each migration can rerun safely", async () => {
    const config = setup.getConfig()
    await config.init()

    const migrations = Object.keys(MIGRATIONS)

    await config.doInContext(config.getAppId(), async () => {
      const db = context.getAppDB()
      for (const migration of migrations) {
        await runMigration(migration)
        const docs = await db.allDocs({ include_docs: true })

        await runMigration(migration)
        const latestDocs = await db.allDocs({ include_docs: true })

        expect(docs).toEqual(latestDocs)
      }
    })
  })
})
