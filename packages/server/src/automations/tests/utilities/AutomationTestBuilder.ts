import { v4 as uuidv4 } from "uuid"
import { BUILTIN_ACTION_DEFINITIONS } from "../../actions"
import { TRIGGER_DEFINITIONS } from "../../triggers"
import {
  Automation,
  AutomationActionStepId,
  AutomationStep,
  AutomationStepInputs,
  AutomationTrigger,
  AutomationTriggerDefinition,
  AutomationTriggerInputs,
  AutomationTriggerOutputs,
  AutomationTriggerStepId,
  BranchStepInputs,
  isDidNotTriggerResponse,
  SearchFilters,
  TestAutomationRequest,
} from "@budibase/types"
import TestConfiguration from "../../../tests/utilities/TestConfiguration"
import { automations } from "@budibase/shared-core"

type StepBuilderFunction = <TStep extends AutomationTriggerStepId>(
  stepBuilder: BranchStepBuilder<TStep>
) => void

type BranchConfig = {
  [key: string]: {
    steps: StepBuilderFunction
    condition: SearchFilters
  }
}

class TriggerBuilder {
  private config: TestConfiguration

  constructor(config: TestConfiguration) {
    this.config = config
  }

  protected trigger<
    TStep extends AutomationTriggerStepId,
    TInput = AutomationTriggerInputs<TStep>
  >(stepId: TStep) {
    return (inputs: TInput) => {
      const definition: AutomationTriggerDefinition =
        TRIGGER_DEFINITIONS[stepId]
      const trigger: AutomationTrigger = {
        ...definition,
        stepId,
        inputs: (inputs || {}) as any,
        id: uuidv4(),
      }
      return new StepBuilder<TStep>(this.config, trigger)
    }
  }

  onAppAction = this.trigger(AutomationTriggerStepId.APP)

  onRowSaved = this.trigger(AutomationTriggerStepId.ROW_SAVED)
  onRowUpdated = this.trigger(AutomationTriggerStepId.ROW_UPDATED)
  onRowDeleted = this.trigger(AutomationTriggerStepId.ROW_DELETED)
  onWebhook = this.trigger(AutomationTriggerStepId.WEBHOOK)
  onCron = this.trigger(AutomationTriggerStepId.CRON)
}

class BranchStepBuilder<TStep extends AutomationTriggerStepId> {
  protected steps: AutomationStep[] = []
  protected stepNames: { [key: string]: string } = {}

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
    const inputs: BranchStepInputs = {
      branches: [],
      children: {},
    }

    for (const [name, branch] of Object.entries(branchConfig)) {
      const builder = new BranchStepBuilder<TStep>()
      branch.steps(builder)
      let id = uuidv4()
      inputs.branches.push({ name, condition: branch.condition, id })
      inputs.children![id] = builder.steps
    }

    this.steps.push({
      ...automations.steps.branch.definition,
      id: uuidv4(),
      stepId: AutomationActionStepId.BRANCH,
      inputs,
    })
  }

  branch(branchConfig: BranchConfig): this {
    this.addBranchStep(branchConfig)
    return this
  }
}

class StepBuilder<
  TStep extends AutomationTriggerStepId
> extends BranchStepBuilder<TStep> {
  private config: TestConfiguration
  private trigger: AutomationTrigger
  private _name: string | undefined = undefined

  constructor(config: TestConfiguration, trigger: AutomationTrigger) {
    super()
    this.config = config
    this.trigger = trigger
  }

  name(n: string): this {
    this._name = n
    return this
  }

  build(): Automation {
    const name = this._name || `Test Automation ${uuidv4()}`
    return {
      name,
      definition: {
        steps: this.steps,
        trigger: this.trigger,
        stepNames: this.stepNames,
      },
      type: "automation",
      appId: this.config.getAppId(),
    }
  }

  async save() {
    const { automation } = await this.config.api.automation.post(this.build())
    return new AutomationRunner<TStep>(this.config, automation)
  }

  async run(outputs: AutomationTriggerOutputs<TStep>) {
    const runner = await this.save()
    return await runner.run(outputs)
  }
}

class AutomationRunner<TStep extends AutomationTriggerStepId> {
  private config: TestConfiguration
  automation: Automation

  constructor(config: TestConfiguration, automation: Automation) {
    this.config = config
    this.automation = automation
  }

  async run(outputs: AutomationTriggerOutputs<TStep>) {
    const response = await this.config.api.automation.test(
      this.automation._id!,
      // TODO: figure out why this cast is needed.
      outputs as TestAutomationRequest
    )

    if (isDidNotTriggerResponse(response)) {
      throw new Error(response.message)
    }

    // Remove the trigger step from the response.
    response.steps.shift()

    return response
  }
}

export function createAutomationBuilder(config: TestConfiguration) {
  return new TriggerBuilder(config)
}
