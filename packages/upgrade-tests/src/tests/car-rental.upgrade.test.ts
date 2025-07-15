import {
  BudibaseClient,
  preUpgrade,
  postUpgrade,
  upgradeContext,
  forApp,
  onlyForApp,
} from "../index"

forApp("car-rental", () => {
  let client: BudibaseClient

  beforeAll(async () => {
    // Create authenticated client with BB_ADMIN user permissions
    client = await BudibaseClient.authenticated()
  })

  preUpgrade(() => {
    it("should capture car rental specific data", async () => {
      const tables = await client.table.fetch()

      // Find the Fleet table (contains all car inventory)
      const fleetTable = tables.find(t => t.name === "Fleet")
      expect(fleetTable).toBeDefined()

      if (fleetTable) {
        const cars = await client.row.fetch(fleetTable._id!)
        upgradeContext.set("carRental:carCount", cars.length)
        upgradeContext.set("carRental:carsTableId", fleetTable._id!)
      }
    })

    it("should verify rental-specific automations", async () => {
      const automations = await client.automation.fetch()

      // Look for automations specific to car rental operations
      const rentalAutomations = automations.filter(
        a =>
          a.name.toLowerCase().includes("rental") ||
          a.name.toLowerCase().includes("booking") ||
          a.name.toLowerCase().includes("car") ||
          a.name.toLowerCase().includes("fleet")
      )

      upgradeContext.set(
        "carRental:automations",
        rentalAutomations.map(a => ({
          id: a._id!,
          name: a.name,
        }))
      )
    })
  })

  postUpgrade(() => {
    it("should preserve all cars in the fleet", async () => {
      const oldCarCount = upgradeContext.get<number>("carRental:carCount")
      const carsTableId = upgradeContext.get<string>("carRental:carsTableId")

      if (carsTableId) {
        const cars = await client.row.fetch(carsTableId)
        expect(cars.length).toBe(oldCarCount)
      }
    })

    it("should maintain rental automations", async () => {
      const oldAutomations = upgradeContext.get<
        Array<{ id: string; name: string }>
      >("carRental:automations")

      if (oldAutomations && oldAutomations.length > 0) {
        const currentAutomations = await client.automation.fetch()

        for (const oldAuto of oldAutomations) {
          const found = currentAutomations.find(a => a.name === oldAuto.name)
          expect(found).toBeDefined()
        }
      }
    })
  })
})

// You can also have tests that run for multiple apps
describe("Cross-app tests", () => {
  let client: BudibaseClient

  beforeAll(async () => {
    // Create authenticated client with BB_ADMIN user permissions
    client = await BudibaseClient.authenticated()
  })

  preUpgrade(() => {
    // This test only runs for the car rental app
    onlyForApp("car-rental")("should have rental-specific fields", async () => {
      const tables = await client.table.fetch()
      const fleetTable = tables.find(t => t.name === "Fleet")

      if (fleetTable) {
        // Check for car-specific fields
        expect(fleetTable.schema).toHaveProperty("Make")
        expect(fleetTable.schema).toHaveProperty("Model")
      }
    })
  })
})
