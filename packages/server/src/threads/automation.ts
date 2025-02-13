import { default as threadUtils } from "./utils"
import { Job } from "bull"
import {
  disableCronById,
  isErrorInOutput,
  isRecurring,
} from "../automations/utils"
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
  UserBindings,
  ContextEmitter,
  LoopStepType,
  AutomationTriggerResult,
  AutomationResults,
  AutomationStepResult,
  isLogicalFilter,
  Branch,
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
import { performance } from "perf_hooks"
import * as sdkUtils from "../sdk/utils"
import env from "../environment"
import tracer from "dd-trace"
import { isPlainObject } from "lodash"

threadUtils.threadSetup()
const CRON_STEP_ID = automations.triggers.definitions.CRON.stepId
const STOPPED_STATUS = { success: true, status: AutomationStatus.STOPPED }

function matchesLoopFailureCondition(loopStep: LoopStep, currentItem: any) {
  if (!loopStep.inputs.failure) {
    return false
  }

  if (isPlainObject(currentItem)) {
    return Object.values(currentItem).some(e => e === loopStep.inputs.failure)
  }

  return currentItem === loopStep.inputs.failure
}

function getLoopIterable(loopStep: LoopStep): any[] {
  const option = loopStep.inputs.option
  let input: any = loopStep.inputs.binding

  if (option === LoopStepType.ARRAY && typeof input === "string") {
    input = JSON.parse(input)
  }

  if (option === LoopStepType.STRING && Array.isArray(input)) {
    input = input.join(",")
  }

  if (option === LoopStepType.STRING && typeof input === "string") {
    input = automationUtils.stringSplit(input)
  }

  return Array.isArray(input) ? input : [input]
}

async function branchMatches(ctx: AutomationContext, branch: Branch) {
  const toFilter: Record<string, any> = {}

  const recurseSearchFilters = (
    filters: BranchSearchFilters
  ): BranchSearchFilters => {
    for (const filter of Object.values(filters)) {
      if (!filter) {
        continue
      }

      if (isLogicalFilter(filter)) {
        filter.conditions = filter.conditions.map(condition =>
          recurseSearchFilters(condition)
        )
      } else {
        for (const [field, value] of Object.entries(filter)) {
          toFilter[field] = processStringSync(field, prepareContext(ctx))
          if (typeof value === "string" && findHBSBlocks(value).length > 0) {
            filter[field] = processStringSync(value, prepareContext(ctx))
          }
        }
      }
    }

    return filters
  }

  const result = dataFilters.runQuery(
    [toFilter],
    recurseSearchFilters(branch.condition)
  )
  return result.length > 0
}

function prepareContext(context: AutomationContext) {
  return {
    ...context,
    steps: {
      ...context.steps,
      ...context.stepsById,
      ...context.stepsByName,
    },
  }
}

export async function enrichBaseContext(context: AutomationContext) {
  context.env = await sdkUtils.getEnvironmentVariables()

  try {
    const { config } = await configs.getSettingsConfigDoc()
    context.settings = {
      url: config.platformUrl,
      logo: config.logoUrl,
      company: config.company,
    }
  } catch (e) {
    // if settings doc doesn't exist, make the settings blank
    context.settings = {}
  }
}

/**
 * The automation orchestrator is a class responsible for executing automations.
 * It handles the context of the automation and makes sure each step gets the correct
 * inputs and handles any outputs.
 */
class Orchestrator {
  private chainCount: number
  private appId: string
  private automation: Automation
  private emitter: ContextEmitter
  private job: AutomationJob
  private stopped: boolean
  private executionOutput: AutomationResults
  private currentUser: UserBindings | undefined

  constructor(job: AutomationJob) {
    this.automation = job.data.automation

    const triggerOutput = job.data.event
    if (
      this.automation.definition.trigger.stepId === CRON_STEP_ID &&
      !triggerOutput.timestamp
    ) {
      triggerOutput.timestamp = Date.now()
    }

    this.chainCount = triggerOutput.metadata?.automationChainCount || 0
    this.appId = triggerOutput.appId as string
    this.job = job

    // remove from context
    delete triggerOutput.appId
    delete triggerOutput.metadata

    // create an emitter which has the chain count for this automation run in
    // it, so it can block excessive chaining if required
    this.emitter = new AutomationEmitter(this.chainCount + 1)

    const trigger: AutomationTriggerResult = {
      id: this.automation.definition.trigger.id,
      stepId: this.automation.definition.trigger.stepId,
      outputs: triggerOutput,
    }

    this.executionOutput = { trigger, steps: [trigger] }

    // setup the execution output
    this.stopped = false
    this.currentUser = triggerOutput.user
  }

  async getStepFunctionality(stepId: AutomationActionStepId) {
    let step = await actions.getAction(stepId)
    if (step == null) {
      throw `Cannot find automation step by name ${stepId}`
    }
    return step
  }

  async getMetadata(): Promise<AutomationMetadata> {
    const metadataId = generateAutomationMetadataID(this.automation._id!)
    const db = context.getAppDB()
    let metadata: AutomationMetadata
    try {
      metadata = await db.get(metadataId)
    } catch (err) {
      metadata = {
        _id: metadataId,
        errorCount: 0,
      }
    }
    return metadata
  }

  async stopCron(reason: string) {
    if (!this.job.opts.repeat) {
      return
    }
    logging.logWarn(
      `CRON disabled reason=${reason} - ${this.appId}/${this.automation._id}`
    )
    await disableCronById(this.job.id)
    this.executionOutput.trigger.outputs = {
      ...this.executionOutput.trigger.outputs,
      success: false,
      status: AutomationStatus.STOPPED,
    }
    this.executionOutput.steps[0] = this.executionOutput.trigger
    await storeLog(this.automation, this.executionOutput)
  }

  async checkIfShouldStop(metadata: AutomationMetadata): Promise<boolean> {
    if (!metadata.errorCount || !this.job.opts.repeat) {
      return false
    }
    if (metadata.errorCount >= MAX_AUTOMATION_RECURRING_ERRORS) {
      await this.stopCron("errors")
      return true
    }
    return false
  }

  async execute(): Promise<AutomationResults | undefined> {
    return tracer.trace(
      "Orchestrator.execute",
      { resource: "automation" },
      async span => {
        span?.addTags({
          appId: this.appId,
          automationId: this.automation._id,
        })

        let metadata: AutomationMetadata | undefined = undefined

        // check if this is a recurring automation,
        if (isProdAppID(this.appId) && isRecurring(this.automation)) {
          span?.addTags({ recurring: true })
          metadata = await this.getMetadata()
          const shouldStop = await this.checkIfShouldStop(metadata)
          if (shouldStop) {
            span?.addTags({ shouldStop: true })
            return
          }
        }

        const ctx: AutomationContext = {
          trigger: this.executionOutput.trigger.outputs,
          steps: [this.executionOutput.trigger.outputs],
          stepsById: {},
          stepsByName: {},
          user: this.currentUser,
        }
        await enrichBaseContext(ctx)

        const start = performance.now()

        const stepOutputs = await this.executeSteps(
          ctx,
          this.automation.definition.steps
        )

        this.executionOutput.steps.push(...stepOutputs)

        const end = performance.now()
        const executionTime = end - start

        console.info(
          `Automation ID: ${this.automation._id} Execution time: ${executionTime} milliseconds`,
          {
            _logKey: "automation",
            executionTime,
          }
        )

        try {
          await storeLog(this.automation, this.executionOutput)
        } catch (e: any) {
          if (e.status === 413 && e.request?.data) {
            // if content is too large we shouldn't log it
            delete e.request.data
            e.request.data = { message: "removed due to large size" }
          }
          logging.logAlert("Error writing automation log", e)
        }

        if (
          isProdAppID(this.appId) &&
          isRecurring(this.automation) &&
          metadata &&
          isErrorInOutput(this.executionOutput)
        ) {
          metadata.errorCount ??= 0
          metadata.errorCount++

          const db = context.getAppDB()
          try {
            await db.put(metadata)
          } catch (err) {
            logging.logAlertWithInfo(
              "Failed to write automation metadata",
              db.name,
              this.automation._id!,
              err
            )
          }
        }
        return this.executionOutput
      }
    )
  }

  private async executeSteps(
    ctx: AutomationContext,
    steps: AutomationStep[]
  ): Promise<AutomationStepResult[]> {
    return tracer.trace(
      "Orchestrator.executeSteps",
      { resource: "automation" },
      async span => {
        let stepIndex = 0
        const timeout =
          this.job.data.event.timeout || env.AUTOMATION_THREAD_TIMEOUT
        const stepOutputs: AutomationStepResult[] = []

        try {
          await helpers.withTimeout(timeout, async () => {
            while (stepIndex < steps.length) {
              if (this.stopped) {
                break
              }

              const step = steps[stepIndex]
              if (step.stepId === AutomationActionStepId.BRANCH) {
                const [result, ...childResults] = await this.executeBranchStep(
                  ctx,
                  step
                )

                stepOutputs.push(result)
                stepOutputs.push(...childResults)

                stepIndex++
              } else if (step.stepId === AutomationActionStepId.LOOP) {
                const stepToLoop = steps[stepIndex + 1]
                const result = await this.executeLoopStep(ctx, step, stepToLoop)

                ctx.steps.push(result.outputs)
                ctx.stepsById[stepToLoop.id] = result.outputs
                ctx.stepsByName[stepToLoop.name || stepToLoop.id] =
                  result.outputs

                stepOutputs.push(result)
                stepIndex += 2
              } else {
                const result = await this.executeStep(ctx, step)

                ctx.steps.push(result.outputs)
                ctx.stepsById[step.id] = result.outputs
                ctx.stepsByName[step.name || step.id] = result.outputs

                stepOutputs.push(result)
                stepIndex++
              }
            }
          })
        } catch (error: any) {
          if (error.errno === "ETIME") {
            span?.addTags({ timedOut: true })
            console.warn(`Automation execution timed out after ${timeout}ms`)
          }
        }

        return stepOutputs
      }
    )
  }

  private async executeLoopStep(
    ctx: AutomationContext,
    loopStep: LoopStep,
    stepToLoop: AutomationStep
  ): Promise<AutomationStepResult> {
    await processObject(loopStep.inputs, prepareContext(ctx))

    const result = {
      id: loopStep.id,
      stepId: loopStep.stepId,
      inputs: loopStep.inputs,
    }

    const loopMaxIterations =
      typeof loopStep.inputs.iterations === "string"
        ? parseInt(loopStep.inputs.iterations)
        : loopStep.inputs.iterations
    const maxIterations = Math.min(
      loopMaxIterations || env.AUTOMATION_MAX_ITERATIONS,
      env.AUTOMATION_MAX_ITERATIONS
    )

    const items: Record<string, any>[] = []
    let iterations = 0
    let iterable: any[] = []
    try {
      iterable = getLoopIterable(loopStep)
    } catch (err) {
      return {
        ...result,
        outputs: {
          success: false,
          status: AutomationStepStatus.INCORRECT_TYPE,
        },
      }
    }

    for (; iterations < iterable.length; iterations++) {
      const currentItem = iterable[iterations]

      if (iterations === maxIterations) {
        return {
          ...result,
          outputs: {
            success: false,
            iterations,
            items,
            status: AutomationStepStatus.MAX_ITERATIONS,
          },
        }
      }

      if (matchesLoopFailureCondition(loopStep, currentItem)) {
        return {
          ...result,
          outputs: {
            success: false,
            iterations,
            items,
            status: AutomationStepStatus.FAILURE_CONDITION,
          },
        }
      }

      ctx.loop = { currentItem }
      const loopedStepResult = await this.executeStep(ctx, stepToLoop)
      ctx.loop = undefined
      items.push(loopedStepResult.outputs)
    }

    return {
      ...result,
      outputs: {
        success: true,
        status:
          iterations === 0 ? AutomationStepStatus.NO_ITERATIONS : undefined,
        iterations,
        items,
      },
    }
  }

  private async executeBranchStep(
    ctx: AutomationContext,
    branchStep: BranchStep
  ): Promise<AutomationStepResult[]> {
    const { branches, children } = branchStep.inputs

    for (const branch of branches) {
      if (await branchMatches(ctx, branch)) {
        const steps = children?.[branch.id] || []

        return [
          {
            id: branchStep.id,
            stepId: branchStep.stepId,
            inputs: branchStep.inputs,
            success: true,
            outputs: {
              branchName: branch.name,
              status: `${branch.name} branch taken`,
              branchId: `${branch.id}`,
            },
          },
          ...(await this.executeSteps(ctx, steps)),
        ]
      }
    }

    this.stopped = true
    return [
      {
        id: branchStep.id,
        stepId: branchStep.stepId,
        inputs: branchStep.inputs,
        success: false,
        outputs: { status: AutomationStatus.NO_CONDITION_MET },
      },
    ]
  }

  private async executeStep(
    ctx: AutomationContext,
    step: AutomationStep
  ): Promise<AutomationStepResult> {
    return tracer.trace(
      "Orchestrator.execute.step",
      { resource: "automation" },
      async span => {
        span?.addTags({
          resource: "automation",
          step: {
            stepId: step.stepId,
            id: step.id,
            name: step.name,
            type: step.type,
            title: step.stepTitle,
            internal: step.internal,
            deprecated: step.deprecated,
          },
        })

        if (this.stopped) {
          return {
            id: step.id,
            stepId: step.stepId,
            inputs: step.inputs,
            outputs: STOPPED_STATUS,
          }
        }

        const stepFn = await this.getStepFunctionality(step.stepId)
        const inputs = automationUtils.cleanInputValues(
          await processObject(cloneDeep(step.inputs), prepareContext(ctx)),
          step.schema.inputs.properties
        )

        const outputs = await stepFn({
          inputs,
          appId: this.appId,
          emitter: this.emitter,
          context: prepareContext(ctx),
        })

        if (
          step.stepId === AutomationActionStepId.FILTER &&
          "result" in outputs &&
          outputs.result === false
        ) {
          this.stopped = true
          ;(outputs as any).status = AutomationStatus.STOPPED
        }

        return {
          id: step.id,
          stepId: step.stepId,
          inputs,
          outputs,
        }
      }
    )
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
      const envVars = await sdkUtils.getEnvironmentVariables()
      await context.doInEnvironmentContext(envVars, async () => {
        const automationOrchestrator = new Orchestrator(job)
        try {
          const response = await automationOrchestrator.execute()
          callback(null, response)
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

  const timeoutPromise = new Promise((_resolve, reject) => {
    setTimeout(() => {
      reject(new Error("Timeout exceeded"))
    }, job.data.event.timeout || env.AUTOMATION_THREAD_TIMEOUT)
  })

  return (await context.doInAppContext(appId, async () => {
    await context.ensureSnippetContext()
    const envVars = await sdkUtils.getEnvironmentVariables()
    // put into automation thread for whole context
    return await context.doInEnvironmentContext(envVars, async () => {
      const automationOrchestrator = new Orchestrator(job)
      return await Promise.race([
        automationOrchestrator.execute(),
        timeoutPromise,
      ])
    })
  })) as AutomationResults
}

export const removeStalled = async (job: Job) => {
  const appId = job.data.event.appId
  if (!appId) {
    throw new Error("Unable to execute, event doesn't contain app ID.")
  }
  await context.doInAppContext(appId, async () => {
    const automationOrchestrator = new Orchestrator(job)
    await automationOrchestrator.stopCron("stalled")
  })
}
