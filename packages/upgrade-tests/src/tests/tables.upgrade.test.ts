import {
  BudibaseClient,
  preUpgrade,
  postUpgrade,
  upgradeContext,
} from "../index"

describe("Table Schema Upgrade Tests", () => {
  let client: BudibaseClient

  beforeAll(async () => {
    client = await BudibaseClient.authenticated()
  })

  preUpgrade(() => {
    it("should capture table count", async () => {
      const tables = await client.table.fetch()
      upgradeContext.set("tableCount", tables.length)
    })

    it("should capture view count", async () => {
      const tables = await client.table.fetch()
      const viewCounts: Record<string, number> = {}

      for (const table of tables) {
        const views = await client.view.fetch(table._id!)
        viewCounts[table._id!] = views.length
      }

      upgradeContext.set("viewCounts", viewCounts)
    })

    it("should capture row count", async () => {
      const tables = await client.table.fetch()
      const rowCounts: Record<string, number> = {}

      for (const table of tables) {
        const rows = await client.row.fetch(table._id!)
        rowCounts[table._id!] = rows.length
      }

      upgradeContext.set("rowCounts", rowCounts)
    })
  })

  postUpgrade(() => {
    it("should preserve table count", async () => {
      const oldCount = upgradeContext.get<number>("tableCount")
      const tables = await client.table.fetch()
      expect(tables.length).toBe(oldCount)
    })

    it("should preserve view counts", async () => {
      const oldViewCounts =
        upgradeContext.get<Record<string, number>>("viewCounts")
      const tables = await client.table.fetch()

      for (const table of tables) {
        const views = await client.view.fetch(table._id!)
        expect(views.length).toBe(oldViewCounts[table._id!])
      }
    })

    it("should preserve row counts", async () => {
      const oldRowCounts =
        upgradeContext.get<Record<string, number>>("rowCounts")
      const tables = await client.table.fetch()

      for (const table of tables) {
        const rows = await client.row.fetch(table._id!)
        expect(rows.length).toBe(oldRowCounts[table._id!])
      }
    })
  })
})
