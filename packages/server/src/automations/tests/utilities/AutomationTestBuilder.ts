import { v4 as uuidv4 } from "uuid"
import { BUILTIN_ACTION_DEFINITIONS } from "../../actions"
import { TRIGGER_DEFINITIONS } from "../../triggers"
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
  SearchFilters,
  TestAutomationRequest,
  TriggerAutomationRequest,
  TriggerAutomationResponse,
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
  private readonly config: TestConfiguration

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
      })
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
  queryRows = this.step(AutomationActionStepId.QUERY_ROWS)
  loop = this.step(AutomationActionStepId.LOOP)
  serverLog = this.step(AutomationActionStepId.SERVER_LOG)
  executeScript = this.step(AutomationActionStepId.EXECUTE_SCRIPT)
  executeScriptV2 = this.step(AutomationActionStepId.EXECUTE_SCRIPT_V2)
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

  build(): Automation {
    const name = this._name || `Test Automation ${uuidv4()}`
    return {
      name,
      definition: {
        steps: this.steps,
        trigger: this._trigger,
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

  async test(triggerOutput: AutomationTriggerOutputs<TStep>) {
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

  async test(triggerOutput: AutomationTriggerOutputs<TStep>) {
    const response = await this.config.api.automation.test(
      this.automation._id!,
      // TODO: figure out why this cast is needed.
      triggerOutput as TestAutomationRequest
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
        "Automations can only be triggered in a production app context, call config.api.application.publish()"
      )
    }
    // Because you can only trigger automations in a production app context, we
    // wrap the trigger call to make tests a bit cleaner. If you really want to
    // test triggering an automation in a dev app context, you can use the
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
            } not found in app ${this.config.getAppId()}. You may have forgotten to call config.api.application.publish().`,
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
