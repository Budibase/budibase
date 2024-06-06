import { context } from "@budibase/backend-core"
import * as setup from "../../api/routes/tests/utilities"
import * as migrations from "../migrations"

function removeChangeableKeys(documents: Document[]) {
  const changeableKeys = ["createdAt", "updatedAt", "_rev", "rev"]
  function iterate(obj: Record<string, any>) {
    for (let key of Object.keys(obj)) {
      if (typeof obj[key] === "object") {
        iterate(obj[key])
      } else if (changeableKeys.indexOf(key) !== -1) {
        delete obj[key]
      }
    }
  }
  for (let doc of documents) {
    iterate(doc)
  }
  return documents
}

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
        const preResp = await db.allDocs({ include_docs: true })

        await migration.func()
        const postResp = await db.allDocs({ include_docs: true })

        const preDocs = removeChangeableKeys(
          preResp.rows.map(row => row.doc as Document)
        )
        const postDocs = removeChangeableKeys(
          postResp.rows.map(row => row.doc as Document)
        )
        expect(preDocs).toEqual(postDocs)
      }
    })
  })
})
