import { MIGRATIONS, runMigration } from "../../middleware/migrations"

import * as setup from "../../api/routes/tests/utilities"
import { context } from "@budibase/backend-core"

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

  it("each migration can rerun safely", async () => {
    const config = setup.getConfig()
    await config.init()

    const newBrokenMigration = "failing-migration"
    MIGRATIONS[newBrokenMigration] = {
      migration: async () => {
        const db = context.getAppDB()

        try {
          await db.get("new-test-document")
        } catch {
          await db.put({ _id: "new-test-document", index: 0 })
        }
        const doc = await db.get("new-test-document")
        await db.put({ ...doc, index: (doc as any).index + 1 })
      },
    }

    await config.doInContext(config.getAppId(), async () => {
      const db = context.getAppDB()
      await runMigration(newBrokenMigration)
      const docs = await db.allDocs({ include_docs: true })

      await runMigration(newBrokenMigration)
      const latestDocs = await db.allDocs({ include_docs: true })

      expect(docs).not.toEqual(latestDocs)
    })
  })
})
