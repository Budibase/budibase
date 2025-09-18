import { configs, context, events, logging } from "@budibase/backend-core"
import { quotas } from "@budibase/pro"
import { automations, dataFilters, helpers } from "@budibase/shared-core"
import {
  findHBSBlocks,
  processObject,
  processStringSync,
} from "@budibase/string-templates"
import {
  Automation,
  AutomationActionStepId,
  AutomationData,
  AutomationJob,
  AutomationMetadata,
  AutomationResults,
  AutomationStatus,
  AutomationStep,
  AutomationStepResult,
  AutomationStepStatus,
  AutomationTriggerResult,
  Branch,
  BranchSearchFilters,
  BranchStep,
  ContextEmitter,
  isLogicalFilter,
  LoopV2Step,
  LoopV2StepInputs,
} from "@budibase/types"
import { Job } from "bull"
import tracer from "dd-trace"
import { cloneDeep } from "lodash/fp"
import * as actions from "../automations/actions"
import * as automationUtils from "../automations/automationUtils"
import { storeLog } from "../automations/logging"
import { disableCronById } from "../automations/utils"
import { MAX_AUTOMATION_RECURRING_ERRORS } from "../constants"
import { generateAutomationMetadataID, isProdWorkspaceID } from "../db/utils"
import { AutomationContext } from "../definitions/automations"
import env from "../environment"
import { default as AutomationEmitter } from "../events/AutomationEmitter"
import * as sdkUtils from "../sdk/utils"
import { WorkerCallback } from "./definitions"
import { default as threadUtils } from "./utils"

threadUtils.threadSetup()
const CRON_STEP_ID = automations.triggers.definitions.CRON.stepId
const STOPPED_STATUS = { success: true, status: AutomationStatus.STOPPED }

function stepSuccess(
  step: Readonly<AutomationStep>,
  outputs: Record<string, any>,
  inputs?: Record<string, any>
): AutomationStepResult {
  if (step.isLegacyLoop) {
    outputs.items = automationUtils.convertLegacyLoopOutputs(outputs.items)

    const legacyChild: any = (step as LoopV2Step)?.inputs?.children?.[0]
    const legacyId = legacyChild?.id || step.id
    const legacyStepId = legacyChild?.stepId || step.stepId
    const legacyInputs = inputs || legacyChild?.inputs || step.inputs

    return {
      id: legacyId,
      stepId: legacyStepId,
      inputs: legacyInputs,
      outputs: {
        success: true,
        ...outputs,
      },
    }
  }
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
  outputs: Record<string, any>,
  inputs?: Record<string, any>
): AutomationStepResult {
  if (step.isLegacyLoop) {
    // Convert items structure and surface the child step identity for legacy loops
    outputs.items = automationUtils.convertLegacyLoopOutputs(outputs.items)

    const legacyChild: any = (step as any)?.inputs?.children?.[0]
    const legacyId = legacyChild?.id || step.id
    const legacyStepId = legacyChild?.stepId || step.stepId
    const legacyInputs = inputs || legacyChild?.inputs || step.inputs

    return {
      id: legacyId,
      stepId: legacyStepId,
      inputs: legacyInputs,
      outputs: {
        success: false,
        ...outputs,
      },
    }
  }
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

    // Pre-process the automation to transform legacy loops
    this.job.data.automation = automationUtils.preprocessAutomation(
      job.data.automation
    )

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
    const db = context.getWorkspaceDB()
    const metadata = await db.tryGet<AutomationMetadata>(metadataId)
    return metadata || { _id: metadataId, errorCount: 0 }
  }

  async incrementErrorCount() {
    const db = context.getWorkspaceDB()
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

  private isProd(): boolean {
    return isProdWorkspaceID(this.appId)
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
        state: {},
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
      if (this.isProd() && this.isCron() && this.hasErrored(ctx)) {
        errorCount = (await this.incrementErrorCount()) || 0
      }

      if (errorCount >= MAX_AUTOMATION_RECURRING_ERRORS) {
        await this.stopCron("errors", { result })
        span?.addTags({ shouldStop: true })
      } else {
        await this.logResult(result)
      }

      // Return any content pushed to state.
      if (Object.keys(ctx?.state || {}).length > 0) {
        result.state = ctx.state
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
        result: AutomationStepResult,
        looped = false
      ) {
        // Put State block data into the state
        if (step.stepId === AutomationActionStepId.EXTRACT_STATE && !looped) {
          ctx.state ??= {}
          ctx.state[result.inputs.key] = result.outputs.value
        }

        ctx.steps[step.id] = result.outputs
        ctx.steps[step.name || step.id] = result.outputs

        ctx.stepsById[step.id] = result.outputs
        ctx.stepsByName[step.name || step.id] = result.outputs

        ctx._stepIndex ||= 0
        ctx.steps[ctx._stepIndex] = result.outputs
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
          case AutomationActionStepId.LOOP_V2: {
            const result = await this.executeLoopStep(ctx, step)
            if (step.isLegacyLoop) {
              const childStep = step.inputs.children?.[0]
              if (childStep) {
                addToContext(childStep, result, true)
              }
            } else {
              addToContext(step, result, true)
            }
            stepIndex++
            break
          }
          default: {
            addToContext(
              step,
              await quotas.addAction(async () => {
                const response = await this.executeStep(ctx, step)
                if (step.stepId === AutomationActionStepId.EXTRACT_STATE) {
                  ctx.state ??= {}
                  ctx.state[response.inputs.key] = response.outputs.value
                }

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

  private async executeLoopStep(
    ctx: AutomationContext,
    step: LoopV2Step
  ): Promise<AutomationStepResult> {
    return await tracer.trace("executeLoopStep", async span => {
      // Clone the children to avoid processObject modifying them
      let children = cloneDeep(step.inputs.children) || []

      const inputs = step.inputs as LoopV2StepInputs
      await processObject(inputs, ctx)

      const maxIterations = automationUtils.getLoopMaxIterations(step)

      // Track loop depth for nested loops
      const loopDepth = (ctx._loopDepth || 0) + 1
      ctx._loopDepth = loopDepth

      try {
        let iterations = 0
        let iterable: any[] = []
        try {
          iterable = automationUtils.getLoopIterable(step)
        } catch (err) {
          span.addTags({
            status: AutomationStepStatus.INCORRECT_TYPE,
            iterations,
          })
          return stepFailure(step, {
            status: AutomationStepStatus.INCORRECT_TYPE,
          })
        }
        const isLegacyLoop = step.isLegacyLoop

        const maxStoredResults = isLegacyLoop
          ? Number.MAX_SAFE_INTEGER
          : automationUtils.getMaxStoredResults(step)

        const storage = automationUtils.initializeLoopStorage(
          children,
          maxStoredResults
        )

        for (; iterations < iterable.length; iterations++) {
          const currentItem = iterable[iterations]

          if (iterations === maxIterations) {
            span.addTags({
              status: AutomationStepStatus.MAX_ITERATIONS,
              iterations,
            })
            return stepFailure(
              step,
              automationUtils.buildLoopOutput(
                storage,
                AutomationStepStatus.MAX_ITERATIONS,
                iterations
              )
            )
          }

          if (automationUtils.matchesLoopFailureCondition(step, currentItem)) {
            span.addTags({
              status: AutomationStepStatus.FAILURE_CONDITION,
              iterations,
            })
            return stepFailure(
              step,
              automationUtils.buildLoopOutput(
                storage,
                AutomationStepStatus.FAILURE_CONDITION,
                iterations
              )
            )
          }

          // Save the current loop context to support nested loops
          const savedLoopContext = ctx.loop
          ctx.loop = { currentItem }
          try {
            // For both legacy and new loops, we need to preserve the step index
            // so child steps don't affect the main step numbering
            const savedStepIndex = ctx._stepIndex
            const iterationResults = await this.executeSteps(ctx, children)
            ctx._stepIndex = savedStepIndex

            // Process results based on their type
            for (const result of iterationResults) {
              automationUtils.processStandardResult(storage, result, iterations)
            }

            const hasFailures = iterationResults.some(
              result => result.outputs.success === false
            )
            if (hasFailures) {
              return stepFailure(
                step,
                automationUtils.buildLoopOutput(
                  storage,
                  undefined,
                  undefined,
                  true
                )
              )
            }
          } finally {
            // Restore the previous loop context (for nested loops)
            ctx.loop = savedLoopContext
          }
        }

        const status =
          iterations === 0 ? AutomationStepStatus.NO_ITERATIONS : undefined

        return stepSuccess(
          step,
          automationUtils.buildLoopOutput(storage, status, iterations)
        )
      } finally {
        ctx._loopDepth = loopDepth - 1
      }
    })
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
      if (
        step.stepId !== AutomationActionStepId.EXECUTE_SCRIPT_V2 &&
        step.stepId !== AutomationActionStepId.EXTRACT_STATE
      ) {
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
    workspaceId: appId,
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

  return await context.doInWorkspaceContext(appId, async () => {
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
  await context.doInWorkspaceContext(appId, async () => {
    const orchestrator = new Orchestrator(job)
    await orchestrator.stopCron("stalled")
  })
}
