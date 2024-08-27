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
  BranchStep,
  LoopStep,
  SearchFilters,
} from "@budibase/types"
import { AutomationContext, TriggerOutput } from "../definitions/automations"
import { WorkerCallback } from "./definitions"
import { context, logging } from "@budibase/backend-core"
import { processObject } from "@budibase/string-templates"
import { cloneDeep } from "lodash/fp"
import { performance } from "perf_hooks"
import * as sdkUtils from "../sdk/utils"
import env from "../environment"
import tracer, { Span } from "dd-trace"

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
  _chainCount: number
  _appId: string
  _automation: Automation
  _emitter: any
  _context: AutomationContext
  _job: Job
  _loopStepOutputs: LoopStep[]
  _stopped: boolean
  _parentSpan?: Span
  _loopStep?: LoopStep
  executionOutput: AutomationContext

  constructor(job: AutomationJob) {
    let automation = job.data.automation
    let triggerOutput = job.data.event
    const metadata = triggerOutput.metadata
    this._chainCount = metadata ? metadata.automationChainCount! : 0
    this._appId = triggerOutput.appId as string
    this._job = job
    const triggerStepId = automation.definition.trigger.stepId
    triggerOutput = this.cleanupTriggerOutputs(triggerStepId, triggerOutput)
    // remove from context
    delete triggerOutput.appId
    delete triggerOutput.metadata
    // step zero is never used as the template string is zero indexed for customer facing
    this._context = { steps: [{}], trigger: triggerOutput }
    this._automation = automation
    // create an emitter which has the chain count for this automation run in it, so it can block
    // excessive chaining if required
    this._emitter = new AutomationEmitter(this._chainCount + 1)
    this.executionOutput = { trigger: {}, steps: [] }
    // setup the execution output
    const triggerId = automation.definition.trigger.id
    this.updateExecutionOutput(triggerId, triggerStepId, null, triggerOutput)
    this._loopStepOutputs = []
    this._stopped = false
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
    const metadataId = generateAutomationMetadataID(this._automation._id!)
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
    if (!this._job.opts.repeat) {
      return
    }
    logging.logWarn(
      `CRON disabled reason=${reason} - ${this._appId}/${this._automation._id}`
    )
    const automation = this._automation
    const trigger = automation.definition.trigger
    await disableCronById(this._job.id)
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
    if (!metadata.errorCount || !this._job.opts.repeat) {
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
      automation = this._automation
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
    if (!currentLoopStepIndex) {
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

    this._context.steps.splice(currentLoopStepIndex, 0, {
      ...output,
      success: result.success,
      status: result.status,
    })
  }

  async execute(): Promise<any> {
    return tracer.trace(
      "Orchestrator.execute",
      { resource: "automation" },
      async span => {
        span?.addTags({
          appId: this._appId,
          automationId: this._automation._id,
        })
        this._parentSpan = span
        this._context.env = await sdkUtils.getEnvironmentVariables()

        let metadata

        // check if this is a recurring automation,
        if (isProdAppID(this._appId) && isRecurring(this._automation)) {
          span?.addTags({ recurring: true })
          metadata = await this.getMetadata()
          const shouldStop = await this.checkIfShouldStop(metadata)
          if (shouldStop) {
            span?.addTags({ shouldStop: true })
            return
          }
        }
        const start = performance.now()

        await this.executeSteps(this._automation.definition.steps)

        const end = performance.now()
        const executionTime = end - start

        console.info(
          `Automation ID: ${this._automation._id} Execution time: ${executionTime} milliseconds`,
          {
            _logKey: "automation",
            executionTime,
          }
        )

        try {
          await storeLog(this._automation, this.executionOutput)
        } catch (e: any) {
          if (e.status === 413 && e.request?.data) {
            // if content is too large we shouldn't log it
            delete e.request.data
            e.request.data = { message: "removed due to large size" }
          }
          logging.logAlert("Error writing automation log", e)
        }
        if (
          isProdAppID(this._appId) &&
          isRecurring(this._automation) &&
          metadata
        ) {
          await this.updateMetadata(metadata)
        }
        return this.executionOutput
      }
    )
  }

  private async executeSteps(steps: AutomationStep[]): Promise<void> {
    let stepIndex = 0
    let timeoutFlag
    let timeout = this._job.data.event.timeout
    while (stepIndex < steps.length) {
      if (timeoutFlag) {
        this._parentSpan?.addTags({ timedOut: true })
        break
      }

      if (timeout) {
        setTimeout(() => {
          timeoutFlag = true
        }, timeout || env.AUTOMATION_THREAD_TIMEOUT)
      }

      const step = steps[stepIndex]
      if (step.stepId === AutomationActionStepId.BRANCH) {
        await this.executeBranchStep(step)
      } else if (step.stepId === AutomationActionStepId.LOOP) {
        stepIndex = await this.executeLoopStep(step, steps, stepIndex)
      } else {
        await this.executeStep(step)
        stepIndex++
      }
    }
  }

  private async executeLoopStep(
    loopStep: LoopStep,
    steps: AutomationStep[],
    currentIndex: number
  ): Promise<number> {
    this._loopStep = loopStep
    await processObject(this._loopStep.inputs, this._context)
    const iterations = getLoopIterations(this._loopStep)
    let stepToLoopIndex = currentIndex + 1
    let iterationCount = 0

    for (let loopStepIndex = 0; loopStepIndex < iterations; loopStepIndex++) {
      try {
        this._loopStep.inputs.binding = automationUtils.typecastForLooping(
          this._loopStep.inputs
        )
      } catch (err) {
        this.updateContextAndOutput(
          currentIndex,
          this._loopStep,
          {},
          {
            status: AutomationErrors.INCORRECT_TYPE,
            success: false,
          }
        )
      }

      if (
        loopStepIndex === env.AUTOMATION_MAX_ITERATIONS ||
        (this._loopStep.inputs.iterations &&
          loopStepIndex === parseInt(this._loopStep.inputs.iterations))
      ) {
        this.updateContextAndOutput(
          loopStepIndex,
          steps[stepToLoopIndex],
          {
            items: this._loopStepOutputs,
            iterations: loopStepIndex,
          },
          {
            status: AutomationErrors.MAX_ITERATIONS,
            success: true,
          }
        )
        break
      }

      let isFailure = false
      const currentItem = this.getCurrentLoopItem(loopStepIndex)
      if (currentItem && typeof currentItem === "object") {
        isFailure = Object.keys(currentItem).some(value => {
          return currentItem[value] === this._loopStep?.inputs.failure
        })
      } else {
        isFailure = currentItem && currentItem === this._loopStep.inputs.failure
      }

      if (isFailure) {
        this.updateContextAndOutput(
          loopStepIndex,
          steps[stepToLoopIndex],
          {
            items: this._loopStepOutputs,
            iterations: loopStepIndex,
          },
          {
            status: AutomationErrors.FAILURE_CONDITION,
            success: false,
          }
        )
        break
      }

      this._context.steps[currentIndex + 1] = {
        currentItem: this.getCurrentLoopItem(loopStepIndex),
      }

      stepToLoopIndex = currentIndex + 1

      await this.executeStep(steps[stepToLoopIndex], stepToLoopIndex)
      iterationCount++
    }

    let tempOutput =
      iterations === 0
        ? {
            status: AutomationStepStatus.NO_ITERATIONS,
            success: true,
          }
        : {
            success: true,
            items: this._loopStepOutputs,
            iterations: iterationCount,
          }

    // Loop Step clean up
    this.executionOutput.steps.splice(currentIndex + 1, 0, {
      id: steps[stepToLoopIndex].id,
      stepId: steps[stepToLoopIndex].stepId,
      outputs: tempOutput,
      inputs: steps[stepToLoopIndex].inputs,
    })
    this._context.steps[currentIndex + 1] = tempOutput
    this._loopStepOutputs = []
    this._loopStep = undefined
    return stepToLoopIndex + 1
  }

  private async executeBranchStep(branchStep: BranchStep): Promise<void> {
    const { branches, children } = branchStep.inputs

    for (const branch of branches) {
      const condition = await this.evaluateBranchCondition(branch.condition)
      if (condition) {
        const branchSteps = children?.[branch.name] || []
        await this.executeSteps(branchSteps)
        break
      }
    }

    // Update execution output for the branch step
    this.updateExecutionOutput(
      branchStep.id,
      branchStep.stepId,
      branchStep.inputs,
      {
        success: true,
        status: AutomationStatus.SUCCESS,
      }
    )
  }

  private async evaluateBranchCondition(
    condition: SearchFilters
  ): Promise<boolean> {
    return true
  }

  private async executeStep(
    step: AutomationStep,
    iteration?: number
  ): Promise<void> {
    const stepSpan = tracer.startSpan("Orchestrator.execute.step", {
      childOf: this._parentSpan,
    })
    stepSpan.addTags({
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

    try {
      if (this._stopped) {
        this.updateExecutionOutput(step.id, step.stepId, {}, STOPPED_STATUS)
        return
      }

      let originalStepInput = cloneDeep(step.inputs)
      if (this._loopStep) {
        originalStepInput = replaceFakeBindings(originalStepInput, iteration!)
      }
      const stepFn = await this.getStepFunctionality(step.stepId)
      let inputs = await processObject(originalStepInput, this._context)
      inputs = automationUtils.cleanInputValues(inputs, step.schema.inputs)

      const outputs = await stepFn({
        inputs: inputs,
        appId: this._appId,
        emitter: this._emitter,
        context: this._context,
      })
      this.handleStepOutput(step, outputs)
    } catch (err) {
      console.error(`Automation error - ${step.stepId} - ${err}`)
      throw err
    } finally {
      stepSpan?.finish()
    }
  }

  private getCurrentLoopItem(index: number): any {
    if (!this._loopStep) return null
    if (
      typeof this._loopStep.inputs.binding === "string" &&
      this._loopStep.inputs.option === "String"
    ) {
      return automationUtils.stringSplit(this._loopStep.inputs.binding)[index]
    } else if (Array.isArray(this._loopStep.inputs.binding)) {
      return this._loopStep.inputs.binding[index]
    }
    return null
  }

  private handleStepOutput(step: AutomationStep, outputs: any): void {
    if (step.stepId === AutomationActionStepId.FILTER && !outputs.result) {
      this._stopped = true
      this.updateExecutionOutput(step.id, step.stepId, step.inputs, {
        ...outputs,
        ...STOPPED_STATUS,
      })
    } else if (this._loopStep) {
      this._loopStepOutputs = this._loopStepOutputs || []
      this._loopStepOutputs.push(outputs)
    } else {
      this.updateExecutionOutput(step.id, step.stepId, step.inputs, outputs)
    }
    this._context.steps[this._context.steps.length] = outputs
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

export async function executeInThread(job: Job<AutomationData>) {
  const appId = job.data.event.appId
  if (!appId) {
    throw new Error("Unable to execute, event doesn't contain app ID.")
  }

  const timeoutPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error("Timeout exceeded"))
    }, job.data.event.timeout || env.AUTOMATION_THREAD_TIMEOUT)
  })

  return await context.doInAppContext(appId, async () => {
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
  })
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
