import { default as threadUtils } from "./utils"
import { Job } from "bull"
import {
  disableCronById,
  isErrorInOutput,
  isRecurring,
} from "../automations/utils"
import * as actions from "../automations/actions"
import * as automationUtils from "../automations/automationUtils"
import { replaceFakeBindings } from "../automations/loopUtils"
import { dataFilters, helpers, utils } from "@budibase/shared-core"
import { default as AutomationEmitter } from "../events/AutomationEmitter"
import { generateAutomationMetadataID, isProdAppID } from "../db/utils"
import { definitions as triggerDefs } from "../automations/triggerInfo"
import { AutomationErrors, MAX_AUTOMATION_RECURRING_ERRORS } from "../constants"
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
  isLogicalSearchOperator,
  LoopStep,
  UserBindings,
  isBasicSearchOperator,
} from "@budibase/types"
import {
  AutomationContext,
  AutomationResponse,
  TriggerOutput,
} from "../definitions/automations"
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

threadUtils.threadSetup()
const CRON_STEP_ID = triggerDefs.CRON.stepId
const STOPPED_STATUS = { success: true, status: AutomationStatus.STOPPED }

function getLoopIterations(loopStep: LoopStep) {
  const binding = loopStep.inputs.binding
  if (!binding) {
    return 0
  }
  try {
    const json = typeof binding === "string" ? JSON.parse(binding) : binding
    if (Array.isArray(json)) {
      return json.length
    }
  } catch (err) {
    // ignore error - wasn't able to parse
  }
  if (typeof binding === "string") {
    return automationUtils.stringSplit(binding).length
  }
  return 0
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
  private emitter: any
  private context: AutomationContext
  private job: Job
  private loopStepOutputs: LoopStep[]
  private stopped: boolean
  private executionOutput: AutomationResponse
  private currentUser: UserBindings | undefined

  constructor(job: AutomationJob) {
    let automation = job.data.automation
    let triggerOutput = job.data.event
    const metadata = triggerOutput.metadata
    this.chainCount = metadata ? metadata.automationChainCount! : 0
    this.appId = triggerOutput.appId as string
    this.job = job
    const triggerStepId = automation.definition.trigger.stepId
    triggerOutput = this.cleanupTriggerOutputs(triggerStepId, triggerOutput)
    // remove from context
    delete triggerOutput.appId
    delete triggerOutput.metadata
    // step zero is never used as the template string is zero indexed for customer facing
    this.context = {
      steps: [{}],
      stepsById: {},
      stepsByName: {},
      trigger: triggerOutput,
    }

    this.automation = automation
    // create an emitter which has the chain count for this automation run in it, so it can block
    // excessive chaining if required
    this.emitter = new AutomationEmitter(this.chainCount + 1)
    this.executionOutput = { trigger: {}, steps: [] }
    // setup the execution output
    const triggerId = automation.definition.trigger.id
    this.updateExecutionOutput(triggerId, triggerStepId, null, triggerOutput)
    this.loopStepOutputs = []
    this.stopped = false
    this.currentUser = triggerOutput.user
  }

  cleanupTriggerOutputs(stepId: string, triggerOutput: TriggerOutput) {
    if (stepId === CRON_STEP_ID && !triggerOutput.timestamp) {
      triggerOutput.timestamp = Date.now()
    }
    return triggerOutput
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
    const automation = this.automation
    const trigger = automation.definition.trigger
    await disableCronById(this.job.id)
    this.updateExecutionOutput(
      trigger.id,
      trigger.stepId,
      {},
      {
        status: AutomationStatus.STOPPED_ERROR,
        success: false,
      }
    )
    await storeLog(automation, this.executionOutput)
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

  async updateMetadata(metadata: AutomationMetadata) {
    const output = this.executionOutput,
      automation = this.automation
    if (!output || !isRecurring(automation)) {
      return
    }
    const count = metadata.errorCount
    const isError = isErrorInOutput(output)
    // nothing to do in this scenario, escape
    if (!count && !isError) {
      return
    }
    if (isError) {
      metadata.errorCount = count ? count + 1 : 1
    } else {
      metadata.errorCount = 0
    }
    const db = context.getAppDB()
    try {
      await db.put(metadata)
    } catch (err) {
      logging.logAlertWithInfo(
        "Failed to write automation metadata",
        db.name,
        automation._id!,
        err
      )
    }
  }

  updateExecutionOutput(id: string, stepId: string, inputs: any, outputs: any) {
    const stepObj = { id, stepId, inputs, outputs }
    // replacing trigger when disabling CRON
    if (
      stepId === CRON_STEP_ID &&
      outputs.status === AutomationStatus.STOPPED_ERROR
    ) {
      this.executionOutput.trigger = stepObj
      this.executionOutput.steps = [stepObj]
      return
    }
    // first entry is always the trigger (constructor)
    if (
      this.executionOutput.steps.length === 0 ||
      this.executionOutput.trigger.id === id
    ) {
      this.executionOutput.trigger = stepObj
    }
    this.executionOutput.steps.push(stepObj)
  }

  updateContextAndOutput(
    currentLoopStepIndex: number | undefined,
    step: AutomationStep,
    output: any,
    result: { success: boolean; status: string }
  ) {
    if (currentLoopStepIndex === undefined) {
      throw new Error("No loop step number provided.")
    }
    this.executionOutput.steps.splice(currentLoopStepIndex, 0, {
      id: step.id,
      stepId: step.stepId,
      outputs: {
        ...output,
        success: result.success,
        status: result.status,
      },
      inputs: step.inputs,
    })
    this.context.steps.splice(currentLoopStepIndex, 0, {
      ...output,
      success: result.success,
      status: result.status,
    })
  }

  async execute(): Promise<AutomationResponse | undefined> {
    return tracer.trace(
      "Orchestrator.execute",
      { resource: "automation" },
      async span => {
        span?.addTags({
          appId: this.appId,
          automationId: this.automation._id,
        })
        this.context.env = await sdkUtils.getEnvironmentVariables()
        this.context.user = this.currentUser

        try {
          const { config } = await configs.getSettingsConfigDoc()
          this.context.settings = {
            url: config.platformUrl,
            logo: config.logoUrl,
            company: config.company,
          }
        } catch (e) {
          // if settings doc doesn't exist, make the settings blank
          this.context.settings = {}
        }

        let metadata

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
        const start = performance.now()

        await this.executeSteps(this.automation.definition.steps)

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
          metadata
        ) {
          await this.updateMetadata(metadata)
        }
        return this.executionOutput
      }
    )
  }

  private async executeSteps(
    steps: AutomationStep[],
    pathIdx?: number
  ): Promise<void> {
    return tracer.trace(
      "Orchestrator.executeSteps",
      { resource: "automation" },
      async span => {
        let stepIndex = 0
        const timeout =
          this.job.data.event.timeout || env.AUTOMATION_THREAD_TIMEOUT

        try {
          await helpers.withTimeout(
            timeout,
            (async () => {
              while (stepIndex < steps.length) {
                const step = steps[stepIndex]
                if (step.stepId === AutomationActionStepId.BRANCH) {
                  // stepIndex for current step context offset
                  // pathIdx relating to the full list of steps in the run
                  await this.executeBranchStep(step, stepIndex + (pathIdx || 0))
                  stepIndex++
                } else if (step.stepId === AutomationActionStepId.LOOP) {
                  stepIndex = await this.executeLoopStep(
                    step,
                    steps,
                    stepIndex,
                    pathIdx
                  )
                } else {
                  if (!this.stopped) {
                    await this.executeStep(step)
                  }
                  stepIndex++
                }
              }
            })()
          )
        } catch (error: any) {
          if (error.errno === "ETIME") {
            span?.addTags({ timedOut: true })
            console.warn(`Automation execution timed out after ${timeout}ms`)
          }
        }
      }
    )
  }

  private async executeLoopStep(
    loopStep: LoopStep,
    steps: AutomationStep[],
    stepIdx: number,
    pathIdx?: number
  ): Promise<number> {
    await processObject(loopStep.inputs, this.mergeContexts(this.context))
    const iterations = getLoopIterations(loopStep)
    let stepToLoopIndex = stepIdx + 1
    let pathStepIdx = (pathIdx || stepIdx) + 1

    let iterationCount = 0
    let shouldCleanup = true
    let reachedMaxIterations = false

    for (let loopStepIndex = 0; loopStepIndex < iterations; loopStepIndex++) {
      try {
        loopStep.inputs.binding = automationUtils.typecastForLooping(
          loopStep.inputs
        )
      } catch (err) {
        this.updateContextAndOutput(
          pathStepIdx + 1,
          steps[stepToLoopIndex],
          {},
          {
            status: AutomationErrors.INCORRECT_TYPE,
            success: false,
          }
        )
        shouldCleanup = false
        break
      }
      const maxIterations = automationUtils.ensureMaxIterationsAsNumber(
        loopStep.inputs.iterations
      )

      if (
        loopStepIndex === env.AUTOMATION_MAX_ITERATIONS ||
        (loopStep.inputs.iterations && loopStepIndex === maxIterations)
      ) {
        reachedMaxIterations = true
        shouldCleanup = true
        break
      }

      let isFailure = false
      const currentItem = this.getCurrentLoopItem(loopStep, loopStepIndex)
      if (currentItem && typeof currentItem === "object") {
        isFailure = Object.keys(currentItem).some(value => {
          return currentItem[value] === loopStep?.inputs.failure
        })
      } else {
        isFailure = currentItem && currentItem === loopStep.inputs.failure
      }

      if (isFailure) {
        this.updateContextAndOutput(
          pathStepIdx + 1,
          steps[stepToLoopIndex],
          {
            items: this.loopStepOutputs,
            iterations: loopStepIndex,
          },
          {
            status: AutomationErrors.FAILURE_CONDITION,
            success: false,
          }
        )
        shouldCleanup = false
        break
      }

      this.context.steps[pathStepIdx] = {
        currentItem: this.getCurrentLoopItem(loopStep, loopStepIndex),
      }

      stepToLoopIndex = stepIdx + 1

      await this.executeStep(steps[stepToLoopIndex], stepToLoopIndex)
      iterationCount++
    }

    if (shouldCleanup) {
      let tempOutput =
        iterations === 0
          ? {
              status: AutomationStepStatus.NO_ITERATIONS,
              success: true,
            }
          : {
              success: true,
              items: this.loopStepOutputs,
              iterations: iterationCount,
            }

      if (reachedMaxIterations && iterations !== 0) {
        tempOutput.status = AutomationStepStatus.MAX_ITERATIONS
      }

      // Loop Step clean up
      this.executionOutput.steps.splice(pathStepIdx, 0, {
        id: steps[stepToLoopIndex].id,
        stepId: steps[stepToLoopIndex].stepId,
        outputs: tempOutput,
        inputs: steps[stepToLoopIndex].inputs,
      })

      this.context.stepsById[steps[stepToLoopIndex].id] = tempOutput
      const stepName = steps[stepToLoopIndex].name || steps[stepToLoopIndex].id
      this.context.stepsByName[stepName] = tempOutput
      this.context.steps[this.context.steps.length] = tempOutput
      this.context.steps = this.context.steps.filter(
        item => !item.hasOwnProperty.call(item, "currentItem")
      )

      this.loopStepOutputs = []
    }

    return stepToLoopIndex + 1
  }
  private async executeBranchStep(
    branchStep: BranchStep,
    pathIdx?: number
  ): Promise<void> {
    const { branches, children } = branchStep.inputs

    for (const branch of branches) {
      const condition = await this.evaluateBranchCondition(branch.condition)
      if (condition) {
        const branchStatus = {
          branchName: branch.name,
          status: `${branch.name} branch taken`,
          branchId: `${branch.id}`,
          success: true,
        }

        this.updateExecutionOutput(
          branchStep.id,
          branchStep.stepId,
          branchStep.inputs,
          branchStatus
        )
        this.context.steps[this.context.steps.length] = branchStatus
        this.context.stepsById[branchStep.id] = branchStatus

        const branchSteps = children?.[branch.id] || []
        // A final +1 to accomodate the branch step itself
        await this.executeSteps(branchSteps, (pathIdx || 0) + 1)
        return
      }
    }

    this.stopped = true
    this.updateExecutionOutput(
      branchStep.id,
      branchStep.stepId,
      branchStep.inputs,
      {
        success: false,
        status: AutomationStatus.NO_CONDITION_MET,
      }
    )
  }

  private async evaluateBranchCondition(
    conditions: BranchSearchFilters
  ): Promise<boolean> {
    const toFilter: Record<string, any> = {}

    const recurseSearchFilters = (
      filters: BranchSearchFilters
    ): BranchSearchFilters => {
      for (const filterKey of Object.keys(
        filters
      ) as (keyof typeof filters)[]) {
        if (!filters[filterKey]) {
          continue
        }

        if (isLogicalSearchOperator(filterKey)) {
          filters[filterKey].conditions = filters[filterKey].conditions.map(
            condition => recurseSearchFilters(condition)
          )
        } else if (isBasicSearchOperator(filterKey)) {
          for (const [field, value] of Object.entries(filters[filterKey])) {
            const fromContext = processStringSync(
              field,
              this.mergeContexts(this.context)
            )
            toFilter[field] = fromContext

            if (typeof value === "string" && findHBSBlocks(value).length > 0) {
              const processedVal = processStringSync(
                value,
                this.mergeContexts(this.context)
              )

              filters[filterKey][field] = processedVal
            }
          }
        } else {
          // We want to types to complain if we extend BranchSearchFilters, but not to throw if the request comes with some extra data. It will just be ignored
          utils.unreachable(filterKey, { doNotThrow: true })
        }
      }

      return filters
    }

    const processedConditions = recurseSearchFilters(conditions)

    const result = dataFilters.runQuery([toFilter], processedConditions)
    return result.length > 0
  }
  private async executeStep(
    step: AutomationStep,
    loopIteration?: number
  ): Promise<void> {
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
          this.updateExecutionOutput(step.id, step.stepId, {}, STOPPED_STATUS)
          return
        }

        let originalStepInput = cloneDeep(step.inputs)
        if (loopIteration !== undefined) {
          originalStepInput = replaceFakeBindings(
            originalStepInput,
            loopIteration
          )
        }

        const stepFn = await this.getStepFunctionality(step.stepId)
        let inputs = await processObject(
          originalStepInput,
          this.mergeContexts(this.context)
        )
        inputs = automationUtils.cleanInputValues(inputs, step.schema.inputs)

        const outputs = await stepFn({
          inputs: inputs,
          appId: this.appId,
          emitter: this.emitter,
          context: this.mergeContexts(this.context),
        })
        this.handleStepOutput(step, outputs, loopIteration)
      }
    )
  }

  private getCurrentLoopItem(loopStep: LoopStep, index: number): any {
    if (!loopStep) return null
    if (
      typeof loopStep.inputs.binding === "string" &&
      loopStep.inputs.option === "String"
    ) {
      return automationUtils.stringSplit(loopStep.inputs.binding)[index]
    } else if (Array.isArray(loopStep.inputs.binding)) {
      return loopStep.inputs.binding[index]
    }
    return null
  }

  private mergeContexts(context: AutomationContext) {
    const mergeContexts = {
      ...context,
      steps: {
        ...context.steps,
        ...context.stepsById,
        ...context.stepsByName,
      },
    }
    return mergeContexts
  }

  private handleStepOutput(
    step: AutomationStep,
    outputs: any,
    loopIteration: number | undefined
  ): void {
    if (step.stepId === AutomationActionStepId.FILTER && !outputs.result) {
      this.stopped = true
      this.updateExecutionOutput(step.id, step.stepId, step.inputs, {
        ...outputs,
        ...STOPPED_STATUS,
      })
    } else if (loopIteration !== undefined) {
      this.loopStepOutputs = this.loopStepOutputs || []
      this.loopStepOutputs.push(outputs)
    } else {
      this.updateExecutionOutput(step.id, step.stepId, step.inputs, outputs)
      this.context.steps[this.context.steps.length] = outputs
      this.context.stepsById![step.id] = outputs
      const stepName = step.name || step.id
      this.context.stepsByName![stepName] = outputs
    }
  }
}

export function execute(job: Job<AutomationData>, callback: WorkerCallback) {
  const appId = job.data.event.appId
  const automationId = job.data.automation._id
  if (!appId) {
    throw new Error("Unable to execute, event doesn't contain app ID.")
  }
  if (!automationId) {
    throw new Error("Unable to execute, event doesn't contain automation ID.")
  }
  return context.doInAutomationContext({
    appId,
    automationId,
    task: async () => {
      const envVars = await sdkUtils.getEnvironmentVariables()
      // put into automation thread for whole context
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
): Promise<AutomationResponse> {
  const appId = job.data.event.appId
  if (!appId) {
    throw new Error("Unable to execute, event doesn't contain app ID.")
  }

  const timeoutPromise = new Promise((resolve, reject) => {
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
  })) as AutomationResponse
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
