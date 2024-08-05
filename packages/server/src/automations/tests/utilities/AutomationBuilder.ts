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
  Automation,
  AutomationTrigger,
  AutomationResults,
  SmtpEmailStepInputs,
  ExecuteQueryStepInputs,
  QueryRowsStepInputs,
} from "@budibase/types"
import {} from "../../steps/loop"
import TestConfiguration from "../../../tests/utilities/TestConfiguration"
import * as setup from "../utilities"
import {
  AppActionTriggerInputs,
  AppActionTriggerOutputs,
} from "../../triggerInfo/app"
import { CronTriggerOutputs } from "../../triggerInfo/cron"

type TriggerOutputs =
  | RowCreatedTriggerOutputs
  | RowUpdatedTriggerOutputs
  | RowDeletedTriggerOutputs
  | AppActionTriggerOutputs
  | CronTriggerOutputs
  | undefined

class AutomationBuilder {
  private automationConfig: Automation = {
    name: "",
    definition: {
      steps: [],
      trigger: {} as AutomationTrigger,
    },
    type: "automation",
    appId: setup.getConfig().getAppId(),
  }
  private config: TestConfiguration = setup.getConfig()
  private triggerOutputs: TriggerOutputs
  private triggerSet: boolean = false

  constructor(options: { name?: string } = {}) {
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

  appAction(outputs: AppActionTriggerOutputs, inputs?: AppActionTriggerInputs) {
    this.triggerOutputs = outputs
    return this.trigger(TRIGGER_DEFINITIONS.APP, inputs, outputs)
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

  sendSmtpEmail(inputs: SmtpEmailStepInputs): this {
    return this.step(BUILTIN_ACTION_DEFINITIONS.SEND_EMAIL_SMTP, inputs)
  }

  executeQuery(inputs: ExecuteQueryStepInputs): this {
    return this.step(BUILTIN_ACTION_DEFINITIONS.EXECUTE_QUERY, inputs)
  }

  queryRows(inputs: QueryRowsStepInputs): this {
    return this.step(BUILTIN_ACTION_DEFINITIONS.QUERY_ROWS, inputs)
  }
  loop(inputs: LoopStepInputs): this {
    return this.step(BUILTIN_ACTION_DEFINITIONS.LOOP, inputs)
  }

  private trigger<T extends { [key: string]: any }>(
    triggerSchema: AutomationTriggerSchema,
    inputs?: T,
    outputs?: TriggerOutputs
  ): this {
    if (this.triggerSet) {
      throw new Error("Only one trigger can be set for an automation.")
    }
    this.automationConfig.definition.trigger = {
      ...triggerSchema,
      inputs: inputs || {},
      id: uuidv4(),
    }
    this.triggerOutputs = outputs
    this.triggerSet = true

    return this
  }

  private step<T extends { [key: string]: any }>(
    stepSchema: AutomationStepSchema,
    inputs: T
  ): this {
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

  private processResults(results: { body: AutomationResults }) {
    results.body.steps.shift()
    return {
      trigger: results.body.trigger,
      steps: results.body.steps,
    }
  }
}

export function createAutomationBuilder(options?: { name?: string }) {
  return new AutomationBuilder(options)
}
