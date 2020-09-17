const mustache = require("mustache")
const actions = require("./actions")
const logic = require("./logic")

function cleanMustache(string) {
  let charToReplace = {
    "[": ".",
    "]": "",
  }
  let regex = new RegExp(/{{[^}}]*}}/g)
  let match
  while ((match = regex.exec(string)) !== null) {
    let baseIdx = string.indexOf(match)
    for (let key of Object.keys(charToReplace)) {
      let idxChar = match[0].indexOf(key)
      if (idxChar !== -1) {
        string =
          string.slice(baseIdx, baseIdx + idxChar) +
          charToReplace[key] +
          string.slice(baseIdx + idxChar + 1)
      }
    }
  }
  return string
}

function recurseMustache(inputs, context) {
  for (let key of Object.keys(inputs)) {
    let val = inputs[key]
    if (typeof val === "string") {
      val = cleanMustache(inputs[key])
      inputs[key] = mustache.render(val, context)
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
    // step zero is never used as the mustache is zero indexed for customer facing
    this._context = { steps: [{}], trigger: triggerOutput }
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
    for (let step of workflow.definition.steps) {
      let stepFn = await this.getStepFunctionality(step.type, step.stepId)
      step.inputs = recurseMustache(step.inputs, this._context)
      // instanceId is always passed
      const outputs = await stepFn({
        inputs: step.inputs,
        instanceId: this._instanceId,
      })
      this._context.steps.push(outputs)
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
