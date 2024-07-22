import { testAutomation } from "../../../api/routes/tests/utilities/TestFunctions"
import {
  Automation,
  AutomationTriggerSchema,
  AutomationStepSchema,
  AutomationTrigger,
  AutomationResults,
} from "@budibase/types"

import { v4 as uuidv4 } from "uuid"

class AutomationBuilder {
  private automationConfig: Partial<Automation> = {
    name: "",
    definition: {
      trigger: {} as AutomationTrigger,
      steps: [],
    },
    type: "automation",
  }
  private config: any

  constructor(config: any) {
    this.config = config
    this.automationConfig.name = `Test Automation ${uuidv4()}`
  }

  trigger(triggerSchema: AutomationTriggerSchema, inputs: any) {
    this.automationConfig.definition!.trigger = {
      ...triggerSchema,
      inputs,
      id: uuidv4(),
    }
    return this
  }

  step(stepSchema: AutomationStepSchema, inputs: any) {
    this.automationConfig.definition!.steps!.push({
      ...stepSchema,
      inputs,
      id: uuidv4(),
    })
    return this
  }

  async run(triggerInputs?: any) {
    const automation = await this.config.createAutomation(this.automationConfig)

    const results = await testAutomation(this.config, automation, triggerInputs)

    return this.processResults(results)
  }

  private processResults(results: { body: AutomationResults }) {
    // shift the first index cause we do this weird thing where the trigger is also returned in the steps
    results.body.steps.shift()

    return {
      trigger: results.body.trigger,
      steps: results.body.steps,
    }
  }
}
export function createAutomationBuilder(config: any) {
  return new AutomationBuilder(config)
}
