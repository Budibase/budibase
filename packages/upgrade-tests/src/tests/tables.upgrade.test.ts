import {
  BudibaseClient,
  preUpgrade,
  postUpgrade,
  upgradeContext,
} from "../index"

describe("Table Schema Upgrade Tests", () => {
  let client: BudibaseClient

  beforeAll(async () => {
    // Create authenticated client with BB_ADMIN user permissions
    client = await BudibaseClient.authenticated()
  })

  preUpgrade(() => {
    it("should capture table schemas", async () => {
      const tables = await client.table.fetch()
      const schemas = tables.map(t => ({
        id: t._id!,
        name: t.name,
        schema: JSON.parse(JSON.stringify(t.schema)), // Ensure it's JSON-serializable
        primaryDisplay: t.primaryDisplay || null,
        indexes: t.indexes || [],
      }))

      upgradeContext.set("tableSchemas", schemas)
      expect(schemas.length).toBeGreaterThan(0)
    })

    it("should capture view definitions", async () => {
      const tables = await client.table.fetch()
      const allViews: any[] = []

      for (const table of tables) {
        const views = await client.view.fetch(table._id!)
        for (const view of views) {
          allViews.push({
            tableId: table._id!,
            tableName: table.name,
            ...view,
          })
        }
      }

      upgradeContext.set("views", allViews)
    })

    it("should capture sample data from each table", async () => {
      const tables = await client.table.fetch()
      const sampleData: Record<string, any[]> = {}

      for (const table of tables) {
        const rows = await client.row.fetch(table._id!, 10) // Get first 10 rows
        if (rows.length > 0) {
          sampleData[table._id!] = rows
        }
      }

      upgradeContext.set("sampleData", sampleData)
      expect(Object.keys(sampleData).length).toBeGreaterThan(0)
    })
  })

  postUpgrade(() => {
    it("should preserve all table schemas", async () => {
      const oldSchemas = upgradeContext.get<any[]>("tableSchemas")
      const tables = await client.table.fetch()

      for (const oldSchema of oldSchemas || []) {
        const newTable = tables.find(t => t.name === oldSchema.name)
        expect(newTable).toBeDefined()

        if (newTable) {
          // Check that all fields still exist with same types
          for (const [fieldName, fieldSchema] of Object.entries(
            oldSchema.schema
          )) {
            const newField = newTable.schema[fieldName]
            expect(newField).toBeDefined()
            expect(newField.type).toBe((fieldSchema as any).type)
          }

          expect(newTable.primaryDisplay).toBe(oldSchema.primaryDisplay)
        }
      }
    })

    it("should preserve view definitions", async () => {
      const oldViews = upgradeContext.get<any[]>("views") || []
      for (const oldView of oldViews) {
        const views = await client.view.fetch(oldView.tableId)
        const matchingView = views.find(v => v.name === oldView.name)

        expect(matchingView).toBeDefined()
        if (matchingView && oldView.filters) {
          expect(matchingView.filters).toEqual(oldView.filters)
        }
      }
    })

    it("should be able to query sample data", async () => {
      const sampleData = upgradeContext.get<Record<string, any[]>>("sampleData")

      for (const [tableId, oldRows] of Object.entries(sampleData || {})) {
        if (oldRows.length > 0) {
          // Try to query for the first row
          const firstRow = oldRows[0]
          const searchResult = await client.row.search(tableId, {
            query: {
              equal: {
                _id: firstRow._id,
              },
            },
          })

          expect(searchResult.rows.length).toBe(1)
          expect(searchResult.rows[0]._id).toBe(firstRow._id)
        }
      }
    })
  })
})
