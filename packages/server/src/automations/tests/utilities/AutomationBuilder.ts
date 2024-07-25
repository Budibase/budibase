import { v4 as uuidv4 } from "uuid"
import { testAutomation } from "../../../api/routes/tests/utilities/TestFunctions"
import {
  RowCreatedTriggerInputs,
  RowCreatedTriggerOutputs,
} from "../../triggerInfo/rowSaved"
import {
  RowUpdatedTriggerInputs,
  RowUpdatedTriggerOutputs,
} from "../../triggerInfo/rowUpdated"
import {} from "../../steps/createRow"
import { BUILTIN_ACTION_DEFINITIONS } from "../../actions"
import { TRIGGER_DEFINITIONS } from "../../triggers"
import {
  RowDeletedTriggerInputs,
  RowDeletedTriggerOutputs,
} from "../../triggerInfo/rowDeleted"
import {
  AutomationStepSchema,
  AutomationTriggerSchema,
  LoopStepInputs,
  DeleteRowStepInputs,
  UpdateRowStepInputs,
  CreateRowStepInputs,
} from "@budibase/types"
import {} from "../../steps/loop"

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
  private triggerOutputs: any
  private triggerSet: boolean = false

  constructor(config: any, options: { name?: string } = {}) {
    this.config = config
    this.automationConfig.name = options.name || `Test Automation ${uuidv4()}`
  }

  // TRIGGERS
  rowSaved(inputs: RowCreatedTriggerInputs, outputs: RowCreatedTriggerOutputs) {
    this.triggerOutputs = outputs
    return this.trigger(TRIGGER_DEFINITIONS.ROW_SAVED, inputs, outputs)
  }

  rowUpdated(
    inputs: RowUpdatedTriggerInputs,
    outputs: RowUpdatedTriggerOutputs
  ) {
    this.triggerOutputs = outputs
    return this.trigger(TRIGGER_DEFINITIONS.ROW_UPDATED, inputs, outputs)
  }

  rowDeleted(
    inputs: RowDeletedTriggerInputs,
    outputs: RowDeletedTriggerOutputs
  ) {
    this.triggerOutputs = outputs
    return this.trigger(TRIGGER_DEFINITIONS.ROW_DELETED, inputs, outputs)
  }

  // STEPS
  createRow(inputs: CreateRowStepInputs): this {
    return this.step(BUILTIN_ACTION_DEFINITIONS.CREATE_ROW, inputs)
  }

  updateRow(inputs: UpdateRowStepInputs): this {
    return this.step(BUILTIN_ACTION_DEFINITIONS.UPDATE_ROW, inputs)
  }

  deleteRow(inputs: DeleteRowStepInputs): this {
    return this.step(BUILTIN_ACTION_DEFINITIONS.DELETE_ROW, inputs)
  }

  loop(inputs: LoopStepInputs): this {
    return this.step(BUILTIN_ACTION_DEFINITIONS.LOOP, inputs)
  }
  private trigger(
    triggerSchema: AutomationTriggerSchema,
    inputs: any,
    outputs: any
  ): this {
    if (this.triggerSet) {
      throw new Error("Only one trigger can be set for an automation.")
    }
    this.automationConfig.definition.trigger = {
      ...triggerSchema,
      inputs,
      id: uuidv4(),
    }
    this.triggerOutputs = outputs
    this.triggerSet = true

    return this
  }

  private step(stepSchema: AutomationStepSchema, inputs: any): this {
    this.automationConfig.definition.steps.push({
      ...stepSchema,
      inputs,
      id: uuidv4(),
    })
    return this
  }

  async run() {
    const automation = await this.config.createAutomation(this.automationConfig)
    const results = await testAutomation(
      this.config,
      automation,
      this.triggerOutputs
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
