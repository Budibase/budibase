import { AutomationStep } from "@budibase/types"
import { BudibaseClient } from "../index"
import { shouldNotChange } from "../utils/upgradeTest"

describe("automations", () => {
  let client: BudibaseClient

  beforeAll(async () => {
    client = await BudibaseClient.authenticated()
  })

  shouldNotChange("IDs", async () => {
    const automations = await client.automation.fetch()
    return automations.map(automation => automation._id!).sort()
  })

  shouldNotChange("names", async () => {
    const automations = await client.automation.fetch()
    return automations.map(automation => automation.name).sort()
  })

  shouldNotChange("steps", async () => {
    const automations = await client.automation.fetch()
    const steps: { [id: string]: AutomationStep[] } = {}
    for (const automation of automations) {
      steps[automation._id!] = automation.definition.steps
    }
    return steps
  })
})
