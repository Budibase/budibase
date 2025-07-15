import {
  BudibaseClient,
  preUpgrade,
  postUpgrade,
  upgradeContext,
} from "../index"

describe("Automation Upgrade Tests", () => {
  let client: BudibaseClient

  beforeAll(async () => {
    // Create authenticated client with BB_ADMIN user permissions
    client = await BudibaseClient.authenticated()
  })

  preUpgrade(() => {
    it("should capture automation definitions", async () => {
      const automations = await client.automation.fetch()

      const automationDefinitions = automations.map(automation => ({
        id: automation._id!,
        name: automation.name,
        triggerType: automation.definition.trigger?.event || null,
        stepCount: automation.definition.steps?.length || 0,
        disabled: automation.disabled || false,
        // Store the full definition for detailed comparison
        definition: JSON.parse(JSON.stringify(automation.definition)),
      }))

      upgradeContext.set("automationDefinitions", automationDefinitions)
    })
  })

  postUpgrade(() => {
    it("should preserve automation definitions", async () => {
      const oldDefinitions = upgradeContext.get<any[]>("automationDefinitions")
      const currentAutomations = await client.automation.fetch()

      for (const oldDef of oldDefinitions || []) {
        const current = currentAutomations.find(a => a.name === oldDef.name)

        expect(current).toBeDefined()
        if (current) {
          expect(current.definition.trigger?.event).toBe(oldDef.triggerType)
          expect(current.definition.steps?.length || 0).toBe(oldDef.stepCount)
          expect(current.disabled || false).toBe(oldDef.disabled)
        }
      }
    })
  })
})
