const actions = require("./actions")
const logic = require("./logic")
const automationUtils = require("./automationUtils")
const AutomationEmitter = require("../events/AutomationEmitter")
const { processObject } = require("@budibase/string-templates")

const FILTER_STEP_ID = logic.BUILTIN_DEFINITIONS.FILTER.stepId

/**
 * The automation orchestrator is a class responsible for executing automations.
 * It handles the context of the automation and makes sure each step gets the correct
 * inputs and handles any outputs.
 */
class Orchestrator {
  constructor(automation, triggerOutput) {
    this._metadata = triggerOutput.metadata
    this._chainCount = this._metadata ? this._metadata.automationChainCount : 0
    this._appId = triggerOutput.appId
    // remove from context
    delete triggerOutput.appId
    delete triggerOutput.metadata
    // step zero is never used as the template string is zero indexed for customer facing
    this._context = { steps: [{}], trigger: triggerOutput }
    this._automation = automation
    // create an emitter which has the chain count for this automation run in it, so it can block
    // excessive chaining if required
    this._emitter = new AutomationEmitter(this._chainCount + 1)
  }

  async getStepFunctionality(type, stepId) {
    let step = null
    if (type === "ACTION") {
      step = await actions.getAction(stepId)
    } else if (type === "LOGIC") {
      step = logic.getLogic(stepId)
    }
    if (step == null) {
      throw `Cannot find automation step by name ${stepId}`
    }
    return step
  }

  async execute() {
    let automation = this._automation
    for (let step of automation.definition.steps) {
      let stepFn = await this.getStepFunctionality(step.type, step.stepId)
      step.inputs = await processObject(step.inputs, this._context)
      step.inputs = automationUtils.cleanInputValues(
        step.inputs,
        step.schema.inputs
      )
      // appId is always passed
      try {
        const outputs = await stepFn({
          inputs: step.inputs,
          appId: this._appId,
          apiKey: automation.apiKey,
          emitter: this._emitter,
          context: this._context,
        })
        if (step.stepId === FILTER_STEP_ID && !outputs.success) {
          break
        }
        this._context.steps.push(outputs)
      } catch (err) {
        console.error(`Automation error - ${step.stepId} - ${err}`)
      }
    }
  }
}

// callback is required for worker-farm to state that the worker thread has completed
module.exports = async (job, cb = null) => {
  try {
    const automationOrchestrator = new Orchestrator(
      job.data.automation,
      job.data.event
    )
    await automationOrchestrator.execute()
    if (cb) {
      cb()
    }
  } catch (err) {
    if (cb) {
      cb(err)
    }
  }
}
