import { v4 as uuidv4 } from "uuid"
import { testAutomation } from "../../../api/routes/tests/utilities/TestFunctions"
import {} from "../../steps/createRow"
import { BUILTIN_ACTION_DEFINITIONS } from "../../actions"
import { TRIGGER_DEFINITIONS } from "../../triggers"
import {
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
  AutomationActionStepId,
  AutomationTriggerStepId,
  AutomationStep,
  AutomationTriggerDefinition,
  RowDeletedTriggerInputs,
  RowDeletedTriggerOutputs,
  RowUpdatedTriggerOutputs,
  RowUpdatedTriggerInputs,
  RowCreatedTriggerInputs,
  RowCreatedTriggerOutputs,
  AppActionTriggerOutputs,
  CronTriggerOutputs,
  AppActionTriggerInputs,
  AutomationStepInputs,
  AutomationTriggerInputs,
  ServerLogStepInputs,
  BranchStepInputs,
  SearchFilters,
  Branch,
} from "@budibase/types"
import TestConfiguration from "../../../tests/utilities/TestConfiguration"
import * as setup from "../utilities"
import { definition } from "../../../automations/steps/branch"

type TriggerOutputs =
  | RowCreatedTriggerOutputs
  | RowUpdatedTriggerOutputs
  | RowDeletedTriggerOutputs
  | AppActionTriggerOutputs
  | CronTriggerOutputs
  | undefined

type StepBuilderFunction = (stepBuilder: StepBuilder) => void

type BranchConfig = {
  [key: string]: {
    steps: StepBuilderFunction
    condition: SearchFilters
  }
}

class BaseStepBuilder {
  protected steps: AutomationStep[] = []
  protected stepNames: { [key: string]: string } = {}

  protected step<TStep extends AutomationActionStepId>(
    stepId: TStep,
    stepSchema: Omit<AutomationStep, "id" | "stepId" | "inputs">,
    inputs: AutomationStepInputs<TStep>,
    stepName?: string
  ): this {
    const id = uuidv4()
    this.steps.push({
      ...stepSchema,
      inputs: inputs as any,
      id,
      stepId,
      name: stepName || stepSchema.name,
    })
    if (stepName) {
      this.stepNames[id] = stepName
    }
    return this
  }
  protected addBranchStep(branchConfig: BranchConfig): void {
    const branchStepInputs: BranchStepInputs = {
      branches: [] as Branch[],
      children: {},
    }

    Object.entries(branchConfig).forEach(([key, branch]) => {
      const stepBuilder = new StepBuilder()
      branch.steps(stepBuilder)

      branchStepInputs.branches.push({
        name: key,
        condition: branch.condition,
      })
      branchStepInputs.children![key] = stepBuilder.build()
    })

    const branchStep: AutomationStep = {
      ...definition,
      id: uuidv4(),
      stepId: AutomationActionStepId.BRANCH,
      inputs: branchStepInputs,
    }
    this.steps.push(branchStep)
  }

  // STEPS
  createRow(inputs: CreateRowStepInputs, opts?: { stepName?: string }): this {
    return this.step(
      AutomationActionStepId.CREATE_ROW,
      BUILTIN_ACTION_DEFINITIONS.CREATE_ROW,
      inputs,
      opts?.stepName
    )
  }

  updateRow(inputs: UpdateRowStepInputs, opts?: { stepName?: string }): this {
    return this.step(
      AutomationActionStepId.UPDATE_ROW,
      BUILTIN_ACTION_DEFINITIONS.UPDATE_ROW,
      inputs,
      opts?.stepName
    )
  }

  deleteRow(inputs: DeleteRowStepInputs, opts?: { stepName?: string }): this {
    return this.step(
      AutomationActionStepId.DELETE_ROW,
      BUILTIN_ACTION_DEFINITIONS.DELETE_ROW,
      inputs,
      opts?.stepName
    )
  }

  sendSmtpEmail(
    inputs: SmtpEmailStepInputs,
    opts?: { stepName?: string }
  ): this {
    return this.step(
      AutomationActionStepId.SEND_EMAIL_SMTP,
      BUILTIN_ACTION_DEFINITIONS.SEND_EMAIL_SMTP,
      inputs,
      opts?.stepName
    )
  }

  executeQuery(
    inputs: ExecuteQueryStepInputs,
    opts?: { stepName?: string }
  ): this {
    return this.step(
      AutomationActionStepId.EXECUTE_QUERY,
      BUILTIN_ACTION_DEFINITIONS.EXECUTE_QUERY,
      inputs,
      opts?.stepName
    )
  }

  queryRows(inputs: QueryRowsStepInputs, opts?: { stepName?: string }): this {
    return this.step(
      AutomationActionStepId.QUERY_ROWS,
      BUILTIN_ACTION_DEFINITIONS.QUERY_ROWS,
      inputs,
      opts?.stepName
    )
  }
  loop(inputs: LoopStepInputs, opts?: { stepName?: string }): this {
    return this.step(
      AutomationActionStepId.LOOP,
      BUILTIN_ACTION_DEFINITIONS.LOOP,
      inputs,
      opts?.stepName
    )
  }

  serverLog(input: ServerLogStepInputs, opts?: { stepName?: string }): this {
    return this.step(
      AutomationActionStepId.SERVER_LOG,
      BUILTIN_ACTION_DEFINITIONS.SERVER_LOG,
      input,
      opts?.stepName
    )
  }
}
class StepBuilder extends BaseStepBuilder {
  build(): AutomationStep[] {
    return this.steps
  }

  branch(branchConfig: BranchConfig): this {
    this.addBranchStep(branchConfig)
    return this
  }
}

class AutomationBuilder extends BaseStepBuilder {
  private automationConfig: Automation
  private config: TestConfiguration
  private triggerOutputs: any
  private triggerSet: boolean = false

  constructor(options: { name?: string; appId?: string } = {}) {
    super()
    this.automationConfig = {
      name: options.name || `Test Automation ${uuidv4()}`,
      definition: {
        steps: [],
        trigger: {} as AutomationTrigger,
        stepNames: {},
      },
      type: "automation",
      appId: options.appId ?? setup.getConfig().getAppId(),
    }
    this.config = setup.getConfig()
  }

  // TRIGGERS
  rowSaved(inputs: RowCreatedTriggerInputs, outputs: RowCreatedTriggerOutputs) {
    this.triggerOutputs = outputs
    return this.trigger(
      TRIGGER_DEFINITIONS.ROW_SAVED,
      AutomationTriggerStepId.ROW_SAVED,
      inputs,
      outputs
    )
  }

  rowUpdated(
    inputs: RowUpdatedTriggerInputs,
    outputs: RowUpdatedTriggerOutputs
  ) {
    this.triggerOutputs = outputs
    return this.trigger(
      TRIGGER_DEFINITIONS.ROW_UPDATED,
      AutomationTriggerStepId.ROW_UPDATED,
      inputs,
      outputs
    )
  }

  rowDeleted(
    inputs: RowDeletedTriggerInputs,
    outputs: RowDeletedTriggerOutputs
  ) {
    this.triggerOutputs = outputs
    return this.trigger(
      TRIGGER_DEFINITIONS.ROW_DELETED,
      AutomationTriggerStepId.ROW_DELETED,
      inputs,
      outputs
    )
  }

  appAction(outputs: AppActionTriggerOutputs, inputs?: AppActionTriggerInputs) {
    this.triggerOutputs = outputs
    return this.trigger(
      TRIGGER_DEFINITIONS.APP,
      AutomationTriggerStepId.APP,
      inputs,
      outputs
    )
  }

  private trigger<TStep extends AutomationTriggerStepId>(
    triggerSchema: AutomationTriggerDefinition,
    stepId: TStep,
    inputs?: AutomationTriggerInputs<TStep>,
    outputs?: TriggerOutputs
  ): this {
    if (this.triggerSet) {
      throw new Error("Only one trigger can be set for an automation.")
    }
    this.automationConfig.definition.trigger = {
      ...triggerSchema,
      stepId,
      inputs: inputs || ({} as any),
      id: uuidv4(),
    }
    this.triggerOutputs = outputs
    this.triggerSet = true

    return this
  }

  branch(branchConfig: BranchConfig): this {
    this.addBranchStep(branchConfig)
    return this
  }

  build(): Automation {
    this.automationConfig.definition.steps = this.steps
    this.automationConfig.definition.stepNames = this.stepNames
    return this.automationConfig
  }

  async run() {
    if (!Object.keys(this.automationConfig.definition.trigger).length) {
      throw new Error("Please add a trigger to this automation test")
    }
    this.automationConfig.definition.steps = this.steps
    const automation = await this.config.createAutomation(this.build())
    const results = await testAutomation(
      this.config,
      automation,
      this.triggerOutputs
    )
    return this.processResults(results)
  }

  private processResults(results: {
    body: AutomationResults
  }): AutomationResults {
    results.body.steps.shift()
    return {
      trigger: results.body.trigger,
      steps: results.body.steps,
    }
  }
}

export function createAutomationBuilder(options?: {
  name?: string
  appId?: string
}) {
  return new AutomationBuilder(options)
}
