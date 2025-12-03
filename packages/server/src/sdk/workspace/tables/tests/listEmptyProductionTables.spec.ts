import { context } from "@budibase/backend-core"
import { listEmptyProductionTables } from "../getters"
import TestConfiguration from "../../../../tests/utilities/TestConfiguration"
import { basicTable } from "../../../../tests/utilities/structures"
import { generateRowID } from "../../../../db/utils"

describe("listEmptyProductionTables", () => {
  const config = new TestConfiguration()

  beforeAll(async () => {
    await config.init("listEmptyProductionTables")
  })

  afterAll(() => config.end())

  it("returns tables with only deleted rows across batches", async () => {
    const table = await config.api.table.save(basicTable())
    await config.publish()

    await config.withProdApp(async () => {
      const db = context.getWorkspaceDB()
      for (let i = 0; i < 30; i++) {
        const rowId = generateRowID(
          table._id!,
          `deleted-${i.toString().padStart(3, "0")}`
        )
        const { rev } = await db.put({
          _id: rowId,
          tableId: table._id!,
          name: `deleted-${i}`,
        })
        await db.remove(rowId, rev)
      }
    })

    const emptyTables = await config.doInContext(
      config.getDevWorkspaceId(),
      async () => {
        return await listEmptyProductionTables()
      }
    )

    expect(emptyTables).toContain(table._id)
  })

  it("does not flag tables that still have live rows in later batches", async () => {
    const table = await config.api.table.save(basicTable())
    await config.publish()

    await config.withProdApp(async () => {
      const db = context.getWorkspaceDB()
      // First batch: deleted rows
      for (let i = 0; i < 25; i++) {
        const rowId = generateRowID(
          table._id!,
          `deleted-${i.toString().padStart(3, "0")}`
        )
        const { rev } = await db.put({
          _id: rowId,
          tableId: table._id!,
          name: `deleted-${i}`,
        })
        await db.remove(rowId, rev)
      }

      // Second batch: one live row that should keep the table out of the empty list
      const liveRowId = generateRowID(table._id!, "live-zz")
      await db.put({
        _id: liveRowId,
        tableId: table._id!,
        name: "live-row",
      })
    })

    const emptyTables = await config.doInContext(
      config.getDevWorkspaceId(),
      async () => {
        return await listEmptyProductionTables()
      }
    )

    expect(emptyTables).not.toContain(table._id)
  })
})
