import {
  BudibaseClient,
  preUpgrade,
  postUpgrade,
  upgradeContext,
} from "../index"

describe("Data Integrity Upgrade Tests", () => {
  let client: BudibaseClient

  beforeAll(async () => {
    // Create authenticated client with BB_ADMIN user permissions
    client = await BudibaseClient.authenticated()
  })

  preUpgrade(() => {
    it("should capture row counts before upgrade", async () => {
      const tables = await client.table.fetch()
      const rowCounts: Record<string, number> = {}

      for (const table of tables) {
        const rows = await client.row.fetch(table._id!)
        rowCounts[table._id!] = rows.length
      }

      upgradeContext.set("rowCounts", rowCounts)
      expect(Object.keys(rowCounts).length).toBeGreaterThan(0)
    })

    it("should capture app metadata", async () => {
      const apps = await client.application.fetch()

      // Apps might be empty if user doesn't have permissions
      // or if no apps have been imported yet
      expect(apps).toBeDefined()

      if (apps.length > 0) {
        const appMetadata = apps.map(app => ({
          id: app.appId || app._id || "unknown",
          name: app.name || "Unknown",
          url: app.url || null,
          version: app.version || null,
          features: app.features
            ? JSON.parse(JSON.stringify(app.features))
            : {},
        }))

        upgradeContext.set("appMetadata", appMetadata)
      } else {
        // Store empty metadata if no apps found
        upgradeContext.set("appMetadata", [])
        console.warn(
          "No apps found - ensure an app is imported before running tests"
        )
      }
    })
  })

  postUpgrade(() => {
    it("should have same row counts after upgrade", async () => {
      const oldRowCounts =
        upgradeContext.get<Record<string, number>>("rowCounts")
      const tables = await client.table.fetch()

      for (const table of tables) {
        const rows = await client.row.fetch(table._id!)
        const oldCount = oldRowCounts?.[table._id!]

        if (oldCount !== undefined) {
          expect(rows.length).toBe(oldCount)
        }
      }
    })

    it("should preserve app metadata", async () => {
      const oldAppMetadata = upgradeContext.get<any[]>("appMetadata")
      const apps = await client.application.fetch()

      for (const oldApp of oldAppMetadata || []) {
        const newApp = apps.find(a => (a.appId || a._id) === oldApp.id)
        expect(newApp).toBeDefined()
        if (newApp) {
          expect(newApp.name).toBe(oldApp.name)
        }
      }
    })
  })
})
