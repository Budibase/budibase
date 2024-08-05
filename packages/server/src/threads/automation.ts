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
} from "@budibase/types"
import {
  AutomationContext,
  LoopInput,
  LoopStep,
  TriggerOutput,
} from "../definitions/automations"
import { WorkerCallback } from "./definitions"
import { context, logging } from "@budibase/backend-core"
import { processObject } from "@budibase/string-templates"
import { cloneDeep } from "lodash/fp"
import { performance } from "perf_hooks"
import * as sdkUtils from "../sdk/utils"
import env from "../environment"
import tracer from "dd-trace"

threadUtils.threadSetup()
const FILTER_STEP_ID = actions.BUILTIN_ACTION_DEFINITIONS.FILTER.stepId
const LOOP_STEP_ID = actions.BUILTIN_ACTION_DEFINITIONS.LOOP.stepId
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

        // this will retrieve from context created at start of thread
        this._context.env = await sdkUtils.getEnvironmentVariables()
        let automation = this._automation
        let stopped = false
        let loopStep: LoopStep | undefined = undefined

        let stepCount = 0
        let currentLoopStepIndex: number = 0
        let loopSteps: LoopStep[] | undefined = []
        let metadata
        let timeoutFlag = false
        let wasLoopStep = false
        let timeout = this._job.data.event.timeout
        // check if this is a recurring automation,
        if (isProdAppID(this._appId) && isRecurring(automation)) {
          span?.addTags({ recurring: true })
          metadata = await this.getMetadata()
          const shouldStop = await this.checkIfShouldStop(metadata)
          if (shouldStop) {
            span?.addTags({ shouldStop: true })
            return
          }
        }
        const start = performance.now()
        for (let step of automation.definition.steps) {
          const stepSpan = tracer.startSpan("Orchestrator.execute.step", {
            childOf: span,
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

          let input: LoopInput | undefined,
            iterations = 1,
            iterationCount = 0

          try {
            if (timeoutFlag) {
              span?.addTags({ timedOut: true })
              break
            }

            if (timeout) {
              setTimeout(() => {
                timeoutFlag = true
              }, timeout || env.AUTOMATION_THREAD_TIMEOUT)
            }

            stepCount++
            if (step.stepId === LOOP_STEP_ID) {
              loopStep = step as LoopStep
              currentLoopStepIndex = stepCount
              continue
            }

            if (loopStep) {
              input = await processObject(loopStep.inputs, this._context)
              iterations = getLoopIterations(loopStep)
              stepSpan?.addTags({ step: { iterations } })
            }

            for (let stepIndex = 0; stepIndex < iterations; stepIndex++) {
              let originalStepInput = cloneDeep(step.inputs)
              if (loopStep && input?.binding) {
                let tempOutput = {
                  items: loopSteps,
                  iterations: iterationCount,
                }
                try {
                  loopStep.inputs.binding = automationUtils.typecastForLooping(
                    loopStep.inputs as LoopInput
                  )
                } catch (err) {
                  this.updateContextAndOutput(
                    currentLoopStepIndex,
                    step,
                    tempOutput,
                    {
                      status: AutomationErrors.INCORRECT_TYPE,
                      success: false,
                    }
                  )
                  loopSteps = undefined
                  loopStep = undefined
                  break
                }
                let item: any[] = []
                if (
                  typeof loopStep.inputs.binding === "string" &&
                  loopStep.inputs.option === "String"
                ) {
                  item = automationUtils.stringSplit(loopStep.inputs.binding)
                } else if (Array.isArray(loopStep.inputs.binding)) {
                  item = loopStep.inputs.binding
                }
                this._context.steps[currentLoopStepIndex] = {
                  currentItem: item[stepIndex],
                }

                originalStepInput = replaceFakeBindings(
                  originalStepInput,
                  currentLoopStepIndex
                )

                if (
                  stepIndex === env.AUTOMATION_MAX_ITERATIONS ||
                  (loopStep.inputs.iterations &&
                    stepIndex === parseInt(loopStep.inputs.iterations))
                ) {
                  this.updateContextAndOutput(
                    currentLoopStepIndex,
                    step,
                    tempOutput,
                    {
                      status: AutomationErrors.MAX_ITERATIONS,
                      success: true,
                    }
                  )
                  loopSteps = undefined
                  loopStep = undefined
                  break
                }

                let isFailure = false
                const currentItem =
                  this._context.steps[currentLoopStepIndex]?.currentItem
                if (currentItem && typeof currentItem === "object") {
                  isFailure = Object.keys(currentItem).some(value => {
                    return currentItem[value] === loopStep?.inputs.failure
                  })
                } else {
                  isFailure =
                    currentItem && currentItem === loopStep.inputs.failure
                }

                if (isFailure) {
                  this.updateContextAndOutput(
                    currentLoopStepIndex,
                    step,
                    tempOutput,
                    {
                      status: AutomationErrors.FAILURE_CONDITION,
                      success: false,
                    }
                  )
                  loopSteps = undefined
                  loopStep = undefined
                  break
                }
              }

              // execution stopped, record state for that
              if (stopped) {
                this.updateExecutionOutput(
                  step.id,
                  step.stepId,
                  {},
                  STOPPED_STATUS
                )
                continue
              }

              let stepFn = await this.getStepFunctionality(
                step.stepId as AutomationActionStepId
              )
              let inputs = await processObject(originalStepInput, this._context)
              inputs = automationUtils.cleanInputValues(
                inputs,
                step.schema.inputs
              )
              try {
                // appId is always passed
                const outputs = await stepFn({
                  inputs: inputs,
                  appId: this._appId,
                  emitter: this._emitter,
                  context: this._context,
                })

                this._context.steps[stepCount] = outputs
                // if filter causes us to stop execution don't break the loop, set a var
                // so that we can finish iterating through the steps and record that it stopped
                if (step.stepId === FILTER_STEP_ID && !outputs.result) {
                  stopped = true
                  this.updateExecutionOutput(
                    step.id,
                    step.stepId,
                    step.inputs,
                    {
                      ...outputs,
                      ...STOPPED_STATUS,
                    }
                  )
                  continue
                }
                if (loopStep && loopSteps) {
                  loopSteps.push(outputs)
                } else {
                  this.updateExecutionOutput(
                    step.id,
                    step.stepId,
                    step.inputs,
                    outputs
                  )
                }
              } catch (err) {
                console.error(`Automation error - ${step.stepId} - ${err}`)
                return err
              }

              if (loopStep) {
                iterationCount++
                if (stepIndex === iterations - 1) {
                  loopStep = undefined
                  this._context.steps.splice(currentLoopStepIndex, 1)
                  break
                }
              }
            }
          } finally {
            stepSpan?.finish()
          }

          if (loopStep && iterations === 0) {
            loopStep = undefined
            this.executionOutput.steps.splice(currentLoopStepIndex + 1, 0, {
              id: step.id,
              stepId: step.stepId,
              outputs: {
                status: AutomationStepStatus.NO_ITERATIONS,
                success: true,
              },
              inputs: {},
            })

            this._context.steps.splice(currentLoopStepIndex, 1)
            iterations = 1
          }

          // Delete the step after the loop step as it's irrelevant, since information is included
          // in the loop step
          if (wasLoopStep && !loopStep) {
            this._context.steps.splice(currentLoopStepIndex + 1, 1)
            wasLoopStep = false
          }
          if (loopSteps && loopSteps.length) {
            let tempOutput = {
              success: true,
              items: loopSteps,
              iterations: iterationCount,
            }
            this.executionOutput.steps.splice(currentLoopStepIndex + 1, 0, {
              id: step.id,
              stepId: step.stepId,
              outputs: tempOutput,
              inputs: step.inputs,
            })
            this._context.steps[currentLoopStepIndex] = tempOutput

            wasLoopStep = true
            loopSteps = []
          }
        }

        const end = performance.now()
        const executionTime = end - start

        console.info(
          `Automation ID: ${automation._id} Execution time: ${executionTime} milliseconds`,
          {
            _logKey: "automation",
            executionTime,
          }
        )

        // store the logs for the automation run
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
        if (isProdAppID(this._appId) && isRecurring(automation) && metadata) {
          await this.updateMetadata(metadata)
        }
        return this.executionOutput
      }
    )
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
