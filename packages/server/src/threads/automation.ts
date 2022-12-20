import { default as threadUtils } from "./utils"
import { Job } from "bull"
threadUtils.threadSetup()
import {
  isRecurring,
  disableCronById,
  isErrorInOutput,
} from "../automations/utils"
import * as actions from "../automations/actions"
import * as automationUtils from "../automations/automationUtils"
import { default as AutomationEmitter } from "../events/AutomationEmitter"
import { generateAutomationMetadataID, isProdAppID } from "../db/utils"
import { definitions as triggerDefs } from "../automations/triggerInfo"
import { AutomationErrors, MAX_AUTOMATION_RECURRING_ERRORS } from "../constants"
import { storeLog } from "../automations/logging"
import { Automation, AutomationStep, AutomationStatus } from "@budibase/types"
import {
  LoopStep,
  LoopStepType,
  LoopInput,
  TriggerOutput,
  AutomationContext,
  AutomationMetadata,
} from "../definitions/automations"
import { WorkerCallback } from "./definitions"
import { context, logging } from "@budibase/backend-core"
import { processObject } from "@budibase/string-templates"
import { cloneDeep } from "lodash/fp"
import env from "../environment"
const FILTER_STEP_ID = actions.ACTION_DEFINITIONS.FILTER.stepId
const LOOP_STEP_ID = actions.ACTION_DEFINITIONS.LOOP.stepId
const CRON_STEP_ID = triggerDefs.CRON.stepId
const STOPPED_STATUS = { success: true, status: AutomationStatus.STOPPED }

function getLoopIterations(loopStep: LoopStep, input: LoopInput) {
  const binding = automationUtils.typecastForLooping(loopStep, input)
  if (!loopStep || !binding) {
    return 1
  }
  return Array.isArray(binding)
    ? binding.length
    : automationUtils.stringSplit(binding).length
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

  constructor(job: Job) {
    let automation = job.data.automation,
      triggerOutput = job.data.event
    const metadata = triggerOutput.metadata
    this._chainCount = metadata ? metadata.automationChainCount : 0
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
    if (stepId === CRON_STEP_ID) {
      triggerOutput.timestamp = Date.now()
    }
    return triggerOutput
  }

  async getStepFunctionality(stepId: string) {
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
    loopStepNumber: number | undefined,
    step: AutomationStep,
    output: any,
    result: { success: boolean; status: string }
  ) {
    if (!loopStepNumber) {
      throw new Error("No loop step number provided.")
    }
    this.executionOutput.steps.splice(loopStepNumber, 0, {
      id: step.id,
      stepId: step.stepId,
      outputs: {
        ...output,
        success: result.success,
        status: result.status,
      },
      inputs: step.inputs,
    })
    this._context.steps.splice(loopStepNumber, 0, {
      ...output,
      success: result.success,
      status: result.status,
    })
  }

  async execute() {
    let automation = this._automation
    let stopped = false
    let loopStep: AutomationStep | undefined = undefined

    let stepCount = 0
    let loopStepNumber: any = undefined
    let loopSteps: LoopStep[] | undefined = []
    let metadata
    let wasLoopStep = false
    // check if this is a recurring automation,
    if (isProdAppID(this._appId) && isRecurring(automation)) {
      metadata = await this.getMetadata()
      const shouldStop = await this.checkIfShouldStop(metadata)
      if (shouldStop) {
        return
      }
    }

    for (let step of automation.definition.steps) {
      stepCount++
      let input: any,
        iterations = 1,
        iterationCount = 0

      if (step.stepId === LOOP_STEP_ID) {
        loopStep = step
        loopStepNumber = stepCount
        continue
      }

      if (loopStep) {
        input = await processObject(loopStep.inputs, this._context)
        iterations = getLoopIterations(loopStep as LoopStep, input)
      }
      for (let index = 0; index < iterations; index++) {
        let originalStepInput = cloneDeep(step.inputs)
        // Handle if the user has set a max iteration count or if it reaches the max limit set by us
        if (loopStep && input.binding) {
          let newInput: any = await processObject(
            loopStep.inputs,
            cloneDeep(this._context)
          )

          let tempOutput = { items: loopSteps, iterations: iterationCount }
          try {
            newInput.binding = automationUtils.typecastForLooping(
              loopStep as LoopStep,
              newInput
            )
          } catch (err) {
            this.updateContextAndOutput(loopStepNumber, step, tempOutput, {
              status: AutomationErrors.INCORRECT_TYPE,
              success: false,
            })
            loopSteps = undefined
            loopStep = undefined
            break
          }

          let item
          if (
            typeof loopStep.inputs.binding === "string" &&
            loopStep.inputs.option === "String"
          ) {
            item = automationUtils.stringSplit(newInput.binding)
          } else {
            item = loopStep.inputs.binding
          }
          this._context.steps[loopStepNumber] = {
            currentItem: item[index],
          }

          // The "Loop" binding in the front end is "fake", so replace it here so the context can understand it
          // Pretty hacky because we need to account for the row object
          for (let [key, value] of Object.entries(originalStepInput)) {
            if (typeof value === "object") {
              for (let [innerKey, innerValue] of Object.entries(
                originalStepInput[key]
              )) {
                if (typeof innerValue === "string") {
                  originalStepInput[key][innerKey] =
                    automationUtils.substituteLoopStep(
                      innerValue,
                      `steps.${loopStepNumber}`
                    )
                } else if (typeof value === "object") {
                  for (let [innerObject, innerValue] of Object.entries(
                    originalStepInput[key][innerKey]
                  )) {
                    originalStepInput[key][innerKey][innerObject] =
                      automationUtils.substituteLoopStep(
                        innerValue as string,
                        `steps.${loopStepNumber}`
                      )
                  }
                }
              }
            } else {
              if (typeof value === "string") {
                originalStepInput[key] = automationUtils.substituteLoopStep(
                  value,
                  `steps.${loopStepNumber}`
                )
              }
            }
          }
          if (
            index === env.AUTOMATION_MAX_ITERATIONS ||
            index === parseInt(loopStep.inputs.iterations)
          ) {
            this.updateContextAndOutput(loopStepNumber, step, tempOutput, {
              status: AutomationErrors.MAX_ITERATIONS,
              success: true,
            })
            loopSteps = undefined
            loopStep = undefined
            break
          }

          let isFailure = false
          const currentItem = this._context.steps[loopStepNumber]?.currentItem
          if (currentItem && typeof currentItem === "object") {
            isFailure = Object.keys(currentItem).some(value => {
              return currentItem[value] === loopStep?.inputs.failure
            })
          } else {
            isFailure = currentItem && currentItem === loopStep.inputs.failure
          }

          if (isFailure) {
            this.updateContextAndOutput(loopStepNumber, step, tempOutput, {
              status: AutomationErrors.FAILURE_CONDITION,
              success: false,
            })
            loopSteps = undefined
            loopStep = undefined
            break
          }
        }

        // execution stopped, record state for that
        if (stopped) {
          this.updateExecutionOutput(step.id, step.stepId, {}, STOPPED_STATUS)
          continue
        }

        // If it's a loop step, we need to manually add the bindings to the context
        let stepFn = await this.getStepFunctionality(step.stepId)
        let inputs = await processObject(originalStepInput, this._context)
        inputs = automationUtils.cleanInputValues(inputs, step.schema.inputs)

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
            this.updateExecutionOutput(step.id, step.stepId, step.inputs, {
              ...outputs,
              ...STOPPED_STATUS,
            })
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
          if (index === iterations - 1) {
            loopStep = undefined
            this._context.steps.splice(loopStepNumber, 1)
            break
          }
        }
      }

      // Delete the step after the loop step as it's irrelevant, since information is included
      // in the loop step
      if (wasLoopStep) {
        this._context.steps.splice(loopStepNumber + 1, 1)
        wasLoopStep = false
      }

      if (loopSteps && loopSteps.length) {
        let tempOutput = {
          success: true,
          items: loopSteps,
          iterations: iterationCount,
        }
        this.executionOutput.steps.splice(loopStepNumber + 1, 0, {
          id: step.id,
          stepId: step.stepId,
          outputs: tempOutput,
          inputs: step.inputs,
        })
        this._context.steps[loopStepNumber] = tempOutput

        loopSteps = undefined
        wasLoopStep = true
      }
    }

    // store the logs for the automation run
    await storeLog(this._automation, this.executionOutput)
    if (isProdAppID(this._appId) && isRecurring(automation) && metadata) {
      await this.updateMetadata(metadata)
    }
    return this.executionOutput
  }
}

export function execute(job: Job, callback: WorkerCallback) {
  const appId = job.data.event.appId
  if (!appId) {
    throw new Error("Unable to execute, event doesn't contain app ID.")
  }
  return context.doInAppContext(appId, async () => {
    const automationOrchestrator = new Orchestrator(job)
    try {
      const response = await automationOrchestrator.execute()
      callback(null, response)
    } catch (err) {
      callback(err)
    }
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
