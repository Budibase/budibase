import { BudibaseClient } from "../index"
import { it } from "../utils/upgradeTest"

describe("Table Schema Upgrade Tests", () => {
  let client: BudibaseClient

  beforeAll(async () => {
    client = await BudibaseClient.authenticated()
  })

  it("should preserve table count", {
    pre: async () => {
      const tables = await client.table.fetch()
      return { tableCount: tables.length }
    },
    post: async ({ tableCount }) => {
      const tables = await client.table.fetch()
      expect(tables.length).toBe(tableCount)
    },
  })

  it("should preserve view counts", {
    pre: async () => {
      const tables = await client.table.fetch()
      const viewCounts: Record<string, number> = {}

      for (const table of tables) {
        const views = await client.view.fetch(table._id!)
        viewCounts[table._id!] = views.length
      }

      return { viewCounts }
    },
    post: async ({ viewCounts }) => {
      const tables = await client.table.fetch()

      for (const table of tables) {
        const views = await client.view.fetch(table._id!)
        expect(views.length).toBe(viewCounts[table._id!])
      }
    },
  })

  it("should preserve row counts", {
    pre: async () => {
      const tables = await client.table.fetch()
      const rowCounts: Record<string, number> = {}

      for (const table of tables) {
        const rows = await client.row.fetch(table._id!)
        rowCounts[table._id!] = rows.length
      }

      return { rowCounts }
    },
    post: async ({ rowCounts }) => {
      const tables = await client.table.fetch()

      for (const table of tables) {
        const rows = await client.row.fetch(table._id!)
        expect(rows.length).toBe(rowCounts[table._id!])
      }
    },
  })
})
