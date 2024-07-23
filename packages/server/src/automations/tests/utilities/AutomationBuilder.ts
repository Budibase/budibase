import { v4 as uuidv4 } from "uuid"
import { testAutomation } from "../../../api/routes/tests/utilities/TestFunctions"

class AutomationBuilder {
  private automationConfig: any = {
    name: "",
    definition: {
      trigger: {},
      steps: [],
    },
    type: "automation",
  }
  private config: any

  constructor(config: any, options: { name?: string } = {}) {
    this.config = config
    this.automationConfig.name = options.name || `Test Automation ${uuidv4()}`
  }

  trigger(triggerSchema: any, inputs: any) {
    this.automationConfig.definition.trigger = {
      ...triggerSchema,
      inputs,
      id: uuidv4(),
    }
    return this
  }

  step(stepSchema: any, inputs: any) {
    this.automationConfig.definition.steps.push({
      ...stepSchema,
      inputs,
      id: uuidv4(),
    })
    return this
  }

  async run(triggerOutputs?: any) {
    const automation = await this.config.createAutomation(this.automationConfig)
    const results = await testAutomation(
      this.config,
      automation,
      triggerOutputs
    )
    return this.processResults(results)
  }

  private processResults(results: any) {
    results.body.steps.shift()
    return {
      trigger: results.body.trigger,
      steps: results.body.steps,
    }
  }
}

export function createAutomationBuilder(
  config: any,
  options?: { name?: string }
) {
  return new AutomationBuilder(config, options)
}
