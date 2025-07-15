import {
  BudibaseClient,
  preUpgrade,
  postUpgrade,
  upgradeContext,
} from "../index"

describe("Automation Upgrade Tests", () => {
  let client: BudibaseClient

  beforeAll(async () => {
    client = await BudibaseClient.authenticated()
  })

  preUpgrade(() => {
    it("should capture automation count", async () => {
      const automations = await client.automation.fetch()
      upgradeContext.set("automationCount", automations.length)
    })
  })

  postUpgrade(() => {
    it("should preserve automation counts", async () => {
      const oldCount = upgradeContext.get<number>("automationCount")
      const currentAutomations = await client.automation.fetch()
      expect(currentAutomations.length).toBe(oldCount)
    })
  })
})
