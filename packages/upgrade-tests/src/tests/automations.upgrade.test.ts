import { BudibaseClient } from "../index"
import { it } from "../utils/upgradeTest"

describe("Automation Upgrade Tests", () => {
  let client: BudibaseClient

  beforeAll(async () => {
    client = await BudibaseClient.authenticated()
  })

  it("should preserve automation counts", {
    pre: async () => {
      const automations = await client.automation.fetch()
      return { automationCount: automations.length }
    },
    post: async ({ automationCount }) => {
      const currentAutomations = await client.automation.fetch()
      expect(currentAutomations.length).toBe(automationCount)
    },
  })
})
