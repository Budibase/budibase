const mustache = require("mustache")
const actions = require("./actions")
const logic = require("./logic")

function recurseMustache(inputs, context) {
  for (let key in Object.keys(inputs)) {
    let val = inputs[key]
    if (typeof val === "string") {
      inputs[key] = mustache.render(val, { context })
    }
    // this covers objects and arrays
    else if (typeof val === "object") {
      inputs[key] = recurseMustache(inputs[key], context)
    }
  }
  return inputs
}

/**
 * The workflow orchestrator is a class responsible for executing workflows.
 * It handles the context of the workflow and makes sure each step gets the correct
 * inputs and handles any outputs.
 */
class Orchestrator {
  constructor(workflow, triggerOutput) {
    this._instanceId = triggerOutput.instanceId
    // block zero is never used as the mustache is zero indexed for customer facing
    this._context = { blocks: [{}], trigger: triggerOutput }
    this._workflow = workflow
  }

  async getStepFunctionality(type, stepId) {
    let step = null
    if (type === "ACTION") {
      step = await actions.getAction(stepId)
    } else if (type === "LOGIC") {
      step = logic.getLogic(stepId)
    }
    if (step == null) {
      throw `Cannot find workflow step by name ${stepId}`
    }
    return step
  }

  async execute() {
    let workflow = this._workflow
    for (let block of workflow.definition.steps) {
      let stepFn = await this.getStepFunctionality(block.type, block.stepId)
      block.inputs = recurseMustache(block.inputs, this._context)
      // instanceId is always passed
      const outputs = await stepFn({
        inputs: block.inputs,
        instanceId: this._instanceId,
      })
      this._context.blocks.push(outputs)
    }
  }
}

// callback is required for worker-farm to state that the worker thread has completed
module.exports = async (job, cb = null) => {
  try {
    const workflowOrchestrator = new Orchestrator(
      job.data.workflow,
      job.data.event
    )
    await workflowOrchestrator.execute()
    if (cb) {
      cb()
    }
  } catch (err) {
    if (cb) {
      cb(err)
    }
  }
}
