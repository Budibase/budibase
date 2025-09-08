import { automations } from "@budibase/shared-core"
import {
  Automation,
  AutomationActionStepId,
  AutomationResults,
  AutomationStep,
  AutomationStepInputs,
  AutomationTrigger,
  AutomationTriggerDefinition,
  AutomationTriggerInputs,
  AutomationTriggerOutputs,
  AutomationTriggerStepId,
  BranchStepInputs,
  isDidNotTriggerResponse,
  LoopStepType,
  LoopV2StepInputs,
  SearchFilters,
  TestAutomationRequest,
  TriggerAutomationRequest,
  TriggerAutomationResponse,
} from "@budibase/types"
import { v4 as uuidv4 } from "uuid"
import TestConfiguration from "../../../tests/utilities/TestConfiguration"
import { BUILTIN_ACTION_DEFINITIONS } from "../../actions"
import { TRIGGER_DEFINITIONS } from "../../triggers"

type StepBuilderFunction = <TStep extends AutomationTriggerStepId>(
  stepBuilder: BranchStepBuilder<TStep>
) => void

type BranchConfig = {
  [key: string]: {
    steps: StepBuilderFunction
    condition: SearchFilters
  }
}

type LoopConfig = {
  option: LoopStepType
  binding: any
  steps: StepBuilderFunction
  iterations?: number
  failure?: any
  resultOptions?: {
    storeFullResults?: boolean
    summarizeOnly?: boolean
  }
}

class TriggerBuilder {
  private readonly config: TestConfiguration

  constructor(config: TestConfiguration) {
    this.config = config
  }

  protected trigger<
    TStep extends AutomationTriggerStepId,
    TInput = AutomationTriggerInputs<TStep>,
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
  onRowAction = this.trigger(AutomationTriggerStepId.ROW_ACTION)
}

class BranchStepBuilder<TStep extends AutomationTriggerStepId> {
  protected readonly steps: AutomationStep[] = []
  protected readonly stepNames: { [key: string]: string } = {}

  protected step<TStep extends AutomationActionStepId>(stepId: TStep) {
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
      } as AutomationStep)
      if (opts?.stepName) {
        this.stepNames[id] = opts.stepName
      }
      return this
    }
  }

  createRow = this.step(AutomationActionStepId.CREATE_ROW)
  updateRow = this.step(AutomationActionStepId.UPDATE_ROW)
  deleteRow = this.step(AutomationActionStepId.DELETE_ROW)
  sendSmtpEmail = this.step(AutomationActionStepId.SEND_EMAIL_SMTP)
  executeQuery = this.step(AutomationActionStepId.EXECUTE_QUERY)
  apiRequest = this.step(AutomationActionStepId.API_REQUEST)
  queryRows = this.step(AutomationActionStepId.QUERY_ROWS)
  loop = this.step(AutomationActionStepId.LOOP)
  loopv2 = this.step(AutomationActionStepId.LOOP_V2)
  serverLog = this.step(AutomationActionStepId.SERVER_LOG)
  executeScript = this.step(AutomationActionStepId.EXECUTE_SCRIPT)
  executeScriptV2 = this.step(AutomationActionStepId.EXECUTE_SCRIPT_V2)
  extractState = this.step(AutomationActionStepId.EXTRACT_STATE)
  filter = this.step(AutomationActionStepId.FILTER)
  bash = this.step(AutomationActionStepId.EXECUTE_BASH)
  openai = this.step(AutomationActionStepId.OPENAI)
  collect = this.step(AutomationActionStepId.COLLECT)
  zapier = this.step(AutomationActionStepId.zapier)
  triggerAutomationRun = this.step(
    AutomationActionStepId.TRIGGER_AUTOMATION_RUN
  )
  outgoingWebhook = this.step(AutomationActionStepId.OUTGOING_WEBHOOK)
  n8n = this.step(AutomationActionStepId.n8n)
  make = this.step(AutomationActionStepId.integromat)
  discord = this.step(AutomationActionStepId.discord)
  delay = this.step(AutomationActionStepId.DELAY)
  extractFileData = this.step(AutomationActionStepId.EXTRACT_FILE_DATA)

  protected addLoopStep(loopConfig: LoopConfig): void {
    const inputs: LoopV2StepInputs = {
      option: loopConfig.option,
      binding: loopConfig.binding,
      children: [],
      iterations: loopConfig.iterations,
      failure: loopConfig.failure,
      resultOptions: loopConfig.resultOptions || {
        storeFullResults: true,
        summarizeOnly: false,
      },
    }

    const builder = new BranchStepBuilder<TStep>()
    loopConfig.steps(builder)
    inputs.children = builder.steps
    let id = uuidv4()
    this.steps.push({
      ...automations.steps.loopV2.definition,
      id,
      stepId: AutomationActionStepId.LOOP_V2,
      inputs,
    })
  }

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

  loopV2(loopConfig: LoopConfig): this {
    this.addLoopStep(loopConfig)
    return this
  }
}

class StepBuilder<
  TStep extends AutomationTriggerStepId,
> extends BranchStepBuilder<TStep> {
  private readonly config: TestConfiguration
  private readonly _trigger: AutomationTrigger
  private _name: string | undefined = undefined

  constructor(config: TestConfiguration, trigger: AutomationTrigger) {
    super()
    this.config = config
    this._trigger = trigger
  }

  name(n: string): this {
    this._name = n
    return this
  }

  build(opts?: { disabled?: boolean }): Automation {
    const name = this._name || `Test Automation ${uuidv4()}`
    return {
      name,
      definition: {
        steps: this.steps,
        trigger: this._trigger,
        stepNames: this.stepNames,
      },
      disabled: opts?.disabled,
      type: "automation",
      appId: this.config.getAppId(),
    }
  }

  async save(opts?: { disabled?: boolean }) {
    const { automation } = await this.config.api.automation.post(
      this.build(opts)
    )
    return new AutomationRunner<TStep>(this.config, automation)
  }

  async test(
    triggerOutput: AutomationTriggerOutputs<TStep> & TestAutomationRequest
  ) {
    const runner = await this.save()
    return await runner.test(triggerOutput)
  }

  async trigger(
    request: TriggerAutomationRequest
  ): Promise<TriggerAutomationResponse> {
    const runner = await this.save()
    return await runner.trigger(request)
  }
}

class AutomationRunner<TStep extends AutomationTriggerStepId> {
  private readonly config: TestConfiguration
  readonly automation: Automation

  constructor(config: TestConfiguration, automation: Automation) {
    this.config = config
    this.automation = automation
  }

  async test(
    triggerOutput: AutomationTriggerOutputs<TStep> & TestAutomationRequest
  ) {
    const response = await this.config.api.automation.test(
      this.automation._id!,
      triggerOutput
    )

    if (isDidNotTriggerResponse(response)) {
      throw new Error(response.message)
    }

    const results: AutomationResults = response as AutomationResults
    // Remove the trigger step from the response.
    results.steps.shift()

    return results
  }

  async trigger(
    request: TriggerAutomationRequest
  ): Promise<TriggerAutomationResponse> {
    if (!this.config.prodAppId) {
      throw new Error(
        "Automations can only be triggered in a production workspace context, call config.api.workspace.publish()"
      )
    }
    // Because you can only trigger automations in a production workspace context, we
    // wrap the trigger call to make tests a bit cleaner. If you really want to
    // test triggering an automation in a dev workspace context, you can use the
    // automation API directly.
    return await this.config.withProdApp(async () => {
      try {
        return await this.config.api.automation.trigger(
          this.automation._id!,
          request
        )
      } catch (e: any) {
        if (e.cause.status === 404) {
          throw new Error(
            `Automation with ID ${
              this.automation._id
            } not found in app ${this.config.getAppId()}. You may have forgotten to call config.api.workspace.publish().`,
            { cause: e }
          )
        } else {
          throw e
        }
      }
    })
  }
}

export function createAutomationBuilder(config: TestConfiguration) {
  return new TriggerBuilder(config)
}
