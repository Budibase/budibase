import { db as dbCore, SQLITE_DESIGN_DOC_ID } from "@budibase/backend-core"
import { SQLiteDefinition } from "@budibase/types"
import * as setup from "../../../../../api/routes/tests/utilities"
import sdk from "../../../../../sdk"
import { basicTable } from "../../../../../tests/utilities/structures"

const config = setup.getConfig()

describe("sqs definition conflicts", () => {
  beforeAll(async () => {
    await config.init()
  })

  it("removes losing definition branches left behind by replication", async () => {
    const table = await config.api.table.save(basicTable())
    const devId = config.getDevWorkspaceId()
    const prodId = config.getProdWorkspaceId()

    // give production its own unrelated revision branch for the definition, the
    // state a local resync leaves behind when it runs outside the dev workspace
    const prodDb = dbCore.getDB(prodId)
    await prodDb.put({
      _id: SQLITE_DESIGN_DOC_ID,
      language: "sqlite",
      sql: { tables: {}, options: { table_name: "tableId" } },
    })

    const replication = new dbCore.Replication({
      source: devId,
      target: prodId,
    })
    try {
      await replication.replicate(replication.appReplicateOpts())
    } finally {
      await replication.close()
    }

    expect(
      (await prodDb.getConflicts(SQLITE_DESIGN_DOC_ID)).length
    ).toBeGreaterThan(0)

    await config.doInContext(prodId, () => sdk.tables.sqs.syncDefinition())

    expect(await prodDb.getConflicts(SQLITE_DESIGN_DOC_ID)).toEqual([])
    const definition = await prodDb.get<SQLiteDefinition>(SQLITE_DESIGN_DOC_ID)
    expect(definition.sql.tables[table._id!]).toBeDefined()
  })
})
