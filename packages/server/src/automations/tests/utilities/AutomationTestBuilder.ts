import { v4 as uuidv4 } from "uuid"
import { BUILTIN_ACTION_DEFINITIONS } from "../../actions"
import { TRIGGER_DEFINITIONS } from "../../triggers"
import {
  AppActionTriggerOutputs,
  Automation,
  AutomationActionStepId,
  AutomationStep,
  AutomationStepInputs,
  AutomationTrigger,
  AutomationTriggerInputs,
  AutomationTriggerOutputs,
  AutomationTriggerStepId,
  BranchStepInputs,
  CronTriggerOutputs,
  isDidNotTriggerResponse,
  RowCreatedTriggerOutputs,
  RowDeletedTriggerOutputs,
  RowUpdatedTriggerOutputs,
  SearchFilters,
  TestAutomationRequest,
  WebhookTriggerOutputs,
} from "@budibase/types"
import TestConfiguration from "../../../tests/utilities/TestConfiguration"
import { automations } from "@budibase/shared-core"

type TriggerOutputs =
  | RowCreatedTriggerOutputs
  | RowUpdatedTriggerOutputs
  | RowDeletedTriggerOutputs
  | AppActionTriggerOutputs
  | WebhookTriggerOutputs
  | CronTriggerOutputs
  | undefined

type StepBuilderFunction = (stepBuilder: AutomationBuilder) => void

type BranchConfig = {
  [key: string]: {
    steps: StepBuilderFunction
    condition: SearchFilters
  }
}

class AutomationBuilder {
  private automationConfig: Automation
  private triggerOutputs: TriggerOutputs
  private triggerSet = false
  private config: TestConfiguration
  private steps: AutomationStep[] = []
  private stepNames: { [key: string]: string } = {}

  constructor(config: TestConfiguration) {
    this.config = config
    this.triggerOutputs = { fields: {} }
    this.automationConfig = {
      name: `Test Automation ${uuidv4()}`,
      definition: {
        steps: [],
        trigger: {
          ...TRIGGER_DEFINITIONS[AutomationTriggerStepId.APP],
          stepId: AutomationTriggerStepId.APP,
          inputs: this.triggerOutputs,
          id: uuidv4(),
        },
        stepNames: {},
      },
      type: "automation",
      appId: this.config.getAppId(),
    }
  }

  name(n: string): this {
    this.automationConfig.name = n
    return this
  }

  protected createStepFn<TStep extends AutomationActionStepId>(stepId: TStep) {
    return (
      inputs: AutomationStepInputs<TStep>,
      opts?: { stepName?: string; stepId?: string }
    ) => {
      const schema = BUILTIN_ACTION_DEFINITIONS[stepId]
      const id = opts?.stepId || uuidv4()
      this.steps.push({
        ...schema,
        inputs: inputs as any,
        id,
        stepId,
        name: opts?.stepName || schema.name,
      })
      if (opts?.stepName) {
        this.stepNames[id] = opts.stepName
      }
      return this
    }
  }

  createRow = this.createStepFn(AutomationActionStepId.CREATE_ROW)
  updateRow = this.createStepFn(AutomationActionStepId.UPDATE_ROW)
  deleteRow = this.createStepFn(AutomationActionStepId.DELETE_ROW)
  sendSmtpEmail = this.createStepFn(AutomationActionStepId.SEND_EMAIL_SMTP)
  executeQuery = this.createStepFn(AutomationActionStepId.EXECUTE_QUERY)
  queryRows = this.createStepFn(AutomationActionStepId.QUERY_ROWS)
  loop = this.createStepFn(AutomationActionStepId.LOOP)
  serverLog = this.createStepFn(AutomationActionStepId.SERVER_LOG)
  executeScript = this.createStepFn(AutomationActionStepId.EXECUTE_SCRIPT)
  filter = this.createStepFn(AutomationActionStepId.FILTER)
  bash = this.createStepFn(AutomationActionStepId.EXECUTE_BASH)
  openai = this.createStepFn(AutomationActionStepId.OPENAI)
  collect = this.createStepFn(AutomationActionStepId.COLLECT)
  zapier = this.createStepFn(AutomationActionStepId.zapier)
  triggerAutomationRun = this.createStepFn(
    AutomationActionStepId.TRIGGER_AUTOMATION_RUN
  )
  outgoingWebhook = this.createStepFn(AutomationActionStepId.OUTGOING_WEBHOOK)
  n8n = this.createStepFn(AutomationActionStepId.n8n)
  make = this.createStepFn(AutomationActionStepId.integromat)
  discord = this.createStepFn(AutomationActionStepId.discord)
  delay = this.createStepFn(AutomationActionStepId.DELAY)

  protected addBranchStep(branchConfig: BranchConfig): void {
    const branchStepInputs: BranchStepInputs = {
      branches: [],
      children: {},
    }

    Object.entries(branchConfig).forEach(([key, branch]) => {
      const stepBuilder = new AutomationBuilder(this.config)
      branch.steps(stepBuilder)
      let branchId = uuidv4()
      branchStepInputs.branches.push({
        name: key,
        condition: branch.condition,
        id: branchId,
      })
      branchStepInputs.children![branchId] = stepBuilder.steps
    })
    const branchStep: AutomationStep = {
      ...automations.steps.branch.definition,
      id: uuidv4(),
      stepId: AutomationActionStepId.BRANCH,
      inputs: branchStepInputs,
    }
    this.steps.push(branchStep)
  }

  branch(branchConfig: BranchConfig): this {
    this.addBranchStep(branchConfig)
    return this
  }
  protected triggerInputOutput<
    TStep extends AutomationTriggerStepId,
    TInput = AutomationTriggerInputs<TStep>,
    TOutput = AutomationTriggerOutputs<TStep>
  >(stepId: TStep) {
    return (inputs: TInput, outputs?: TOutput) => {
      if (this.triggerSet) {
        throw new Error("Only one trigger can be set for an automation.")
      }
      this.triggerOutputs = outputs as TriggerOutputs | undefined
      this.automationConfig.definition.trigger = {
        ...TRIGGER_DEFINITIONS[stepId],
        stepId,
        inputs,
        id: uuidv4(),
      } as AutomationTrigger
      this.triggerSet = true
      return this
    }
  }

  protected triggerOutputOnly<
    TStep extends AutomationTriggerStepId,
    TOutput = AutomationTriggerOutputs<TStep>
  >(stepId: TStep) {
    return (outputs: TOutput) => {
      this.triggerOutputs = outputs as TriggerOutputs
      this.automationConfig.definition.trigger = {
        ...TRIGGER_DEFINITIONS[stepId],
        stepId,
        id: uuidv4(),
      } as AutomationTrigger
      this.triggerSet = true
      return this
    }
  }

  // The input and output for appAction is identical, and we only ever seem to
  // set the output, so we're ignoring the input for now.
  appAction = this.triggerOutputOnly(AutomationTriggerStepId.APP)

  rowSaved = this.triggerInputOutput(AutomationTriggerStepId.ROW_SAVED)
  rowUpdated = this.triggerInputOutput(AutomationTriggerStepId.ROW_UPDATED)
  rowDeleted = this.triggerInputOutput(AutomationTriggerStepId.ROW_DELETED)
  webhook = this.triggerInputOutput(AutomationTriggerStepId.WEBHOOK)
  cron = this.triggerInputOutput(AutomationTriggerStepId.CRON)

  build(): Automation {
    this.automationConfig.definition.steps = this.steps
    this.automationConfig.definition.stepNames = this.stepNames
    return this.automationConfig
  }

  async save() {
    this.automationConfig.definition.steps = this.steps
    const { automation } = await this.config.api.automation.post(this.build())
    return automation
  }

  async run() {
    const automation = await this.save()
    const response = await this.config.api.automation.test(
      automation._id!,
      this.triggerOutputs as TestAutomationRequest
    )

    if (isDidNotTriggerResponse(response)) {
      throw new Error(response.message)
    }

    response.steps.shift()
    return {
      trigger: response.trigger,
      steps: response.steps,
    }
  }
}

export function createAutomationBuilder(config: TestConfiguration) {
  return new AutomationBuilder(config)
}
