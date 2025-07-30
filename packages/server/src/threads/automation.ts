import { default as threadUtils } from "./utils"
import { events } from "@budibase/backend-core"
import { Job } from "bull"
import { disableCronById } from "../automations/utils"
import * as actions from "../automations/actions"
import * as automationUtils from "../automations/automationUtils"
import { dataFilters, helpers } from "@budibase/shared-core"
import { default as AutomationEmitter } from "../events/AutomationEmitter"
import { generateAutomationMetadataID, isProdAppID } from "../db/utils"
import { automations } from "@budibase/shared-core"
import { MAX_AUTOMATION_RECURRING_ERRORS } from "../constants"
import { storeLog } from "../automations/logging"
import {
  Automation,
  AutomationActionStepId,
  AutomationData,
  AutomationJob,
  AutomationMetadata,
  AutomationStatus,
  AutomationStep,
  AutomationStepStatus,
  BranchSearchFilters,
  BranchStep,
  LoopStep,
  LoopV2StepInputs,
  ContextEmitter,
  AutomationTriggerResult,
  AutomationResults,
  AutomationStepResult,
  isLogicalFilter,
  Branch,
  LoopV2Step,
} from "@budibase/types"
import { AutomationContext } from "../definitions/automations"
import { WorkerCallback } from "./definitions"
import { context, logging, configs } from "@budibase/backend-core"
import {
  findHBSBlocks,
  processObject,
  processStringSync,
} from "@budibase/string-templates"
import { cloneDeep } from "lodash/fp"
import * as sdkUtils from "../sdk/utils"
import env from "../environment"
import tracer from "dd-trace"
import { isPlainObject } from "lodash"
import { quotas } from "@budibase/pro"

threadUtils.threadSetup()
const CRON_STEP_ID = automations.triggers.definitions.CRON.stepId
const STOPPED_STATUS = { success: true, status: AutomationStatus.STOPPED }

function matchesLoopFailureCondition(step: LoopV2Step, currentItem: any) {
  const { failure } = step.inputs
  if (!failure) {
    return false
  }

  if (isPlainObject(currentItem)) {
    return Object.values(currentItem).some(e => e === failure)
  }

  return currentItem === failure
}

// Returns an array of the things to loop over for a given LoopStep.  This
// function handles the various ways that a LoopStep can be configured, parsing
// the input and returning an array of items to loop over.
function getLoopIterable(step: LoopV2Step): any[] {
  let input = step.inputs.binding

  if (Array.isArray(input)) {
    return input
  } else if (typeof input === "string") {
    if (input === "") {
      input = []
    } else {
      try {
        input = JSON.parse(input)
      } catch (e) {
        input = automationUtils.stringSplit(input)
      }
    }
  }

  return Array.isArray(input) ? input : [input]
}

function getLoopMaxIterations(loopStep: LoopV2Step): number {
  const loopMaxIterations =
    typeof loopStep.inputs.iterations === "string"
      ? parseInt(loopStep.inputs.iterations)
      : loopStep.inputs.iterations
  return Math.min(
    loopMaxIterations || env.AUTOMATION_MAX_ITERATIONS,
    env.AUTOMATION_MAX_ITERATIONS
  )
}

function stepSuccess(
  step: Readonly<AutomationStep>,
  outputs: Readonly<Record<string, any>>,
  inputs?: Readonly<Record<string, any>>
): AutomationStepResult {
  return {
    id: step.id,
    stepId: step.stepId,
    inputs: inputs || step.inputs,
    outputs: {
      success: true,
      ...outputs,
    },
  }
}

function stepFailure(
  step: Readonly<AutomationStep>,
  outputs: Readonly<Record<string, any>>,
  inputs?: Readonly<Record<string, any>>
): AutomationStepResult {
  return {
    id: step.id,
    stepId: step.stepId,
    inputs: inputs || step.inputs,
    outputs: {
      success: false,
      ...outputs,
    },
  }
}

function stepStopped(step: AutomationStep): AutomationStepResult {
  return {
    id: step.id,
    stepId: step.stepId,
    inputs: step.inputs,
    outputs: STOPPED_STATUS,
  }
}

async function branchMatches(
  ctx: AutomationContext,
  branch: Readonly<Branch>
): Promise<boolean> {
  const toFilter: Record<string, any> = {}

  // Because we allow bindings on both the left and right of each condition in
  // automation branches, we can't pass the BranchSearchFilters directly to
  // dataFilters.runQuery as-is. We first need to walk the filter tree and
  // evaluate all of the bindings.
  const evaluateBindings = (fs: Readonly<BranchSearchFilters>) => {
    const filters = cloneDeep(fs)
    for (const filter of Object.values(filters)) {
      if (!filter) {
        continue
      }

      if (isLogicalFilter(filter)) {
        filter.conditions = filter.conditions.map(evaluateBindings)
      } else {
        for (const [field, value] of Object.entries(filter)) {
          toFilter[field] = processStringSync(field, ctx)
          if (typeof value === "string" && findHBSBlocks(value).length > 0) {
            filter[field] = processStringSync(value, ctx)
          }
        }
      }
    }

    return filters
  }

  const result = dataFilters.runQuery(
    [toFilter],
    evaluateBindings(branch.condition)
  )
  return result.length > 0
}

async function enrichBaseContext(context: AutomationContext) {
  context.env = await sdkUtils.getEnvironmentVariables()

  try {
    const { config } = await configs.getSettingsConfigDoc()
    context.settings = {
      url: config.platformUrl,
      logo: config.logoUrl,
      company: config.company,
    }
  } catch (e) {
    context.settings = {}
  }
}

// Because the trigger appears twice in an AutomationResult, once as .trigger
// and again as .steps[0], this function makes sure that the two are kept in
// sync when setting trigger output.
function setTriggerOutput(result: AutomationResults, outputs: any) {
  result.trigger.outputs = {
    ...result.trigger.outputs,
    ...outputs,
  }
  result.steps[0] = result.trigger
}

class Orchestrator {
  private readonly job: AutomationJob
  private emitter: ContextEmitter
  private stopped: boolean

  constructor(job: Readonly<AutomationJob>) {
    this.job = job
    this.stopped = false

    // create an emitter which has the chain count for this automation run in
    // it, so it can block excessive chaining if required
    const chainCount = job.data.event.metadata?.automationChainCount || 0
    this.emitter = new AutomationEmitter(chainCount + 1)
  }

  get automation(): Automation {
    return this.job.data.automation
  }

  get appId(): string {
    return this.job.data.event.appId!
  }

  isCron(): boolean {
    return this.automation.definition.trigger.stepId === CRON_STEP_ID
  }

  async stopCron(reason: string, opts?: { result: AutomationResults }) {
    if (!this.isCron()) {
      return
    }

    const msg = `CRON disabled reason=${reason} - ${this.appId}/${this.automation._id}`
    logging.logWarn(msg)

    await disableCronById(this.job.id)

    const { result } = opts || {}
    if (result) {
      setTriggerOutput(result, {
        success: false,
        status: AutomationStatus.STOPPED_ERROR,
      })
      result.status = AutomationStatus.STOPPED_ERROR
      await this.logResult(result)
    }
  }

  private async logResult(result: AutomationResults) {
    await storeLog(this.automation, result)
  }

  async getMetadata(): Promise<AutomationMetadata> {
    const metadataId = generateAutomationMetadataID(this.automation._id!)
    const db = context.getAppDB()
    const metadata = await db.tryGet<AutomationMetadata>(metadataId)
    return metadata || { _id: metadataId, errorCount: 0 }
  }

  async incrementErrorCount() {
    const db = context.getAppDB()
    let err: Error | undefined = undefined
    for (let attempt = 0; attempt < 10; attempt++) {
      const metadata = await this.getMetadata()
      metadata.errorCount ||= 0
      metadata.errorCount++

      try {
        await db.put(metadata)
        return metadata.errorCount
      } catch (error: any) {
        err = error
        await helpers.wait(1000 + Math.random() * 1000)
      }
    }

    logging.logAlertWithInfo(
      "Failed to update error count in automation metadata",
      db.name,
      this.automation._id!,
      err
    )
    return undefined
  }

  private isProdApp(): boolean {
    return isProdAppID(this.appId)
  }

  hasErrored(context: AutomationContext): boolean {
    return context._error === true
  }

  async execute(): Promise<AutomationResults> {
    return await tracer.trace("execute", async span => {
      span.addTags({ appId: this.appId, automationId: this.automation._id })

      const data = cloneDeep(this.job.data)
      delete data.event.appId
      delete data.event.metadata

      if (this.isCron() && !data.event.timestamp) {
        data.event.timestamp = Date.now()
      }

      const trigger: AutomationTriggerResult = {
        id: data.automation.definition.trigger.id,
        stepId: data.automation.definition.trigger.stepId,
        inputs: null,
        outputs: data.event,
      }
      const result: AutomationResults = {
        trigger,
        steps: [trigger],
        status: AutomationStatus.SUCCESS,
      }

      const ctx: AutomationContext = {
        trigger: trigger.outputs,
        steps: { "0": trigger.outputs },
        stepsByName: {},
        stepsById: {},
        user: trigger.outputs.user,
        _error: false,
        _stepIndex: 1,
        _stepResults: [],
      }
      await enrichBaseContext(ctx)

      const timeout =
        this.job.data.event.timeout || env.AUTOMATION_THREAD_TIMEOUT

      let stepResults: AutomationStepResult[] = []

      try {
        const outputs = await helpers.withTimeout(timeout, () =>
          this.executeSteps(ctx, data.automation.definition.steps)
        )
        stepResults = outputs
        if (this.stopped) {
          result.status = AutomationStatus.STOPPED
        } else if (this.hasErrored(ctx)) {
          result.status = AutomationStatus.ERROR
        }
      } catch (err: any) {
        if (err.errno === "ETIME") {
          span.addTags({ timeout: true })
          result.status = AutomationStatus.TIMED_OUT
          stepResults = ctx._stepResults
        } else {
          throw err
        }
      }

      result.steps.push(...stepResults)

      let errorCount = 0
      if (this.isProdApp() && this.isCron() && this.hasErrored(ctx)) {
        errorCount = (await this.incrementErrorCount()) || 0
      }

      if (errorCount >= MAX_AUTOMATION_RECURRING_ERRORS) {
        await this.stopCron("errors", { result })
        span?.addTags({ shouldStop: true })
      } else {
        await this.logResult(result)
      }

      return result
    })
  }

  private async executeSteps(
    ctx: AutomationContext,
    steps: AutomationStep[]
  ): Promise<AutomationStepResult[]> {
    return await tracer.trace("executeSteps", async () => {
      let stepIndex = 0
      const results: AutomationStepResult[] = []

      function addToContext(
        step: AutomationStep,
        result: AutomationStepResult
      ) {
        ctx.steps[step.id] = result.outputs
        ctx.steps[step.name || step.id] = result.outputs

        ctx.stepsById[step.id] = result.outputs
        ctx.stepsByName[step.name || step.id] = result.outputs

        ctx._stepIndex ||= 0
        ctx.steps[ctx._stepIndex] = result.outputs
        console.log(`addToContext: step ${step.stepId} added at index ${ctx._stepIndex}, iterations:`, result.outputs.iterations)
        ctx._stepIndex++

        if (result.outputs.success === false) {
          ctx._error = true
        }

        ctx._stepResults.push(result)
        results.push(result)
      }

      while (stepIndex < steps.length) {
        if (this.stopped) {
          break
        }

        const step = steps[stepIndex]
        switch (step.stepId) {
          case AutomationActionStepId.BRANCH: {
            const branchResults = await this.executeBranchStep(ctx, step)
            ctx._stepResults.push(...branchResults)
            results.push(...branchResults)
            stepIndex++
            break
          }
          case AutomationActionStepId.LOOP_V2:
          case AutomationActionStepId.LOOP: {
            if (step.stepId === AutomationActionStepId.LOOP) {
              const stepToLoop = steps[stepIndex + 1]
              let parsedStep = this.parseOldStepToNewStep(step, steps)
              addToContext(
                step,
                await this.executeLoopV2Step(ctx, parsedStep, true)
              )
              // We increment by 2 here because the way loops work is that the
              // step immediately following the loop step is what gets looped.
              // So when we're done looping, to advance correctly we need to
              // skip the step that was looped.
              stepIndex += 2
            } else {
              addToContext(step, await this.executeLoopV2Step(ctx, step, false))
              stepIndex++
            }
            break
          }
          default: {
            addToContext(
              step,
              await quotas.addAction(async () => {
                const response = await this.executeStep(ctx, step)
                events.action.automationStepExecuted({ stepId: step.stepId })
                return response
              })
            )
            stepIndex++
            break
          }
        }
      }

      return results
    })
  }

  private parseOldStepToNewStep(
    loopStep: LoopStep,
    steps: AutomationStep[]
  ): LoopV2Step {
    const stepToLoopIdx = steps.findIndex(s => loopStep.id === s.id) + 1
    const newLoopV2Step: LoopV2Step = {
      ...loopStep,
      stepId: AutomationActionStepId.LOOP_V2,
      inputs: {
        ...loopStep.inputs,
        children: [steps[stepToLoopIdx]],
      },
    }
    return newLoopV2Step
  }

  private async executeLoopV2Step(
    ctx: AutomationContext,
    step: LoopV2Step,
    isLegacyLoopStep = false
  ): Promise<AutomationStepResult> {
    return await tracer.trace("executeLoopV2Step", async span => {
      // Clone the children to avoid processObject modifying them
      let children = cloneDeep(step.inputs.children) || []

      const inputs = step.inputs as LoopV2StepInputs
      await processObject(inputs, ctx)

      const maxIterations = getLoopMaxIterations(step)

      let iterations = 0
      let iterable: any[] = []
      try {
        iterable = getLoopIterable(step)
      } catch (err) {
        span.addTags({
          status: AutomationStepStatus.INCORRECT_TYPE,
          iterations,
        })
        return stepFailure(step, {
          status: AutomationStepStatus.INCORRECT_TYPE,
        })
      }

      const allResults: Record<string, AutomationStepResult[]> = {}
      for (const { id } of children) {
        allResults[id] = []
      }

      for (; iterations < iterable.length; iterations++) {
        const currentItem = iterable[iterations]

        if (iterations === maxIterations) {
          span.addTags({
            status: AutomationStepStatus.MAX_ITERATIONS,
            iterations,
          })
          if (isLegacyLoopStep) {
            const childStep = children[0]
            const flatItems = this.flattenItems(allResults)
            return stepFailure(step, {
              status: AutomationStepStatus.MAX_ITERATIONS,
              success: false,
              items: flatItems,
              iterations,
            })
          }
        }

        if (matchesLoopFailureCondition(step, currentItem)) {
          span.addTags({
            status: AutomationStepStatus.FAILURE_CONDITION,
            iterations,
          })
          if (isLegacyLoopStep) {
            const childStep = children[0]
            const flatItems = this.flattenItems(allResults)
            return stepFailure(childStep, {
              status: AutomationStepStatus.FAILURE_CONDITION,
              success: false,
              items: flatItems,
              iterations,
            })
          }
          return stepFailure(step, {
            status: AutomationStepStatus.FAILURE_CONDITION,
            success: false,
          })
        }

        ctx.loop = { currentItem }
        try {
          // For both legacy and new loops, we need to preserve the step index
          // so child steps don't affect the main step numbering
          const savedStepIndex = ctx._stepIndex
          const iterationResults = await this.executeSteps(ctx, children)
          ctx._stepIndex = savedStepIndex

          for (const result of iterationResults) {
            allResults[result.id].push(result)
          }

          const hasFailures = iterationResults.some(
            result => result.outputs.success === false
          )
          if (hasFailures) {
            return stepFailure(step, { success: false })
          }
        } finally {
          ctx.loop = undefined
        }
      }

      const status =
        iterations === 0 ? AutomationStepStatus.NO_ITERATIONS : undefined

      if (isLegacyLoopStep) {
        const childStep = children[0]
        const flatItems = this.flattenItems(allResults)
        return stepSuccess(childStep, { status, items: flatItems, iterations })
      }

      return stepSuccess(step, { status, items: allResults, iterations })
    })
  }

  private flattenItems(allResults: Record<string, AutomationStepResult[]>) {
    const flatItems: Record<string, Automation>[] = []
    const firstChildId = Object.keys(allResults)[0]
    if (firstChildId && allResults[firstChildId]) {
      flatItems.push(...allResults[firstChildId].map(result => result.outputs))
    }
    return flatItems
  }

  private async executeBranchStep(
    ctx: AutomationContext,
    step: BranchStep
  ): Promise<AutomationStepResult[]> {
    return await tracer.trace("executeBranchStep", async span => {
      const { branches, children } = step.inputs

      for (const branch of branches) {
        if (await branchMatches(ctx, branch)) {
          span.addTags({ branchName: branch.name, branchId: branch.id })
          return [
            stepSuccess(step, {
              branchName: branch.name,
              status: `${branch.name} branch taken`,
              branchId: `${branch.id}`,
            }),
            ...(await this.executeSteps(ctx, children?.[branch.id] || [])),
          ]
        }
      }

      span.addTags({ status: AutomationStatus.NO_CONDITION_MET })
      return [stepFailure(step, { status: AutomationStatus.NO_CONDITION_MET })]
    })
  }

  private async executeStep(
    ctx: AutomationContext,
    step: Readonly<AutomationStep>
  ): Promise<AutomationStepResult> {
    return await tracer.trace(step.stepId, async span => {
      span.addTags({
        step: {
          stepId: step.stepId,
          id: step.id,
          name: step.name,
          type: step.type,
          title: step.stepTitle,
          internal: step.internal,
          deprecated: step.deprecated,
        },
        inputsKeys: Object.keys(step.inputs),
      })

      if (this.stopped) {
        span.addTags({ stopped: true })
        return stepStopped(step)
      }

      const fn = await actions.getAction(step.stepId)
      if (fn == null) {
        throw new Error(`Cannot find automation step by name ${step.stepId}`)
      }

      let inputs = cloneDeep(step.inputs)
      if (step.stepId !== AutomationActionStepId.EXECUTE_SCRIPT_V2) {
        // The EXECUTE_SCRIPT_V2 step saves its input.code value as a `{{ js
        // "..." }}` template, and expects to receive it that way in the
        // function that runs it. So we skip this next bit for that step.
        inputs = await processObject(inputs, ctx)
      }

      inputs = automationUtils.cleanInputValues(
        inputs,
        step.schema.inputs.properties
      )

      let outputs
      try {
        outputs = await tracer.trace("fn", () =>
          fn({
            inputs,
            appId: this.appId,
            emitter: this.emitter,
            context: ctx,
          })
        )
      } catch (err: any) {
        return stepFailure(step, {
          status: AutomationStatus.ERROR,
          error: automationUtils.getError(err),
        })
      }

      if (
        step.stepId === AutomationActionStepId.FILTER &&
        "result" in outputs &&
        outputs.result === false
      ) {
        this.stopped = true
        ;(outputs as any).status = AutomationStatus.STOPPED
      }

      span.addTags({ outputsKeys: Object.keys(outputs) })
      return stepSuccess(step, outputs, inputs)
    })
  }
}

export function execute(job: Job<AutomationData>, callback: WorkerCallback) {
  const appId = job.data.event.appId
  if (!appId) {
    throw new Error("Unable to execute, event doesn't contain app ID.")
  }

  const automationId = job.data.automation._id
  if (!automationId) {
    throw new Error("Unable to execute, event doesn't contain automation ID.")
  }

  return context.doInAutomationContext({
    appId,
    automationId,
    task: async () => {
      await context.ensureSnippetContext()
      const envVars = await sdkUtils.getEnvironmentVariables()
      await context.doInEnvironmentContext(envVars, async () => {
        const orchestrator = new Orchestrator(job)
        try {
          callback(null, await orchestrator.execute())
        } catch (err) {
          callback(err)
        }
      })
    },
  })
}

export async function executeInThread(
  job: Job<AutomationData>
): Promise<AutomationResults> {
  const appId = job.data.event.appId
  if (!appId) {
    throw new Error("Unable to execute, event doesn't contain app ID.")
  }

  return await context.doInAppContext(appId, async () => {
    await context.ensureSnippetContext()
    const envVars = await sdkUtils.getEnvironmentVariables()
    return await context.doInEnvironmentContext(envVars, async () => {
      const orchestrator = new Orchestrator(job)
      return orchestrator.execute()
    })
  })
}

export const removeStalled = async (job: Job<AutomationData>) => {
  const appId = job.data.event.appId
  if (!appId) {
    throw new Error("Unable to execute, event doesn't contain app ID.")
  }
  await context.doInAppContext(appId, async () => {
    const orchestrator = new Orchestrator(job)
    await orchestrator.stopCron("stalled")
  })
}
