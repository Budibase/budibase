const mustache = require("mustache")
const actions = require("./actions")
const logic = require("./logic")

/**
 * The workflow orchestrator is a class responsible for executing workflows.
 * It handles the context of the workflow and makes sure each step gets the correct
 * inputs and handles any outputs.
 */
class Orchestrator {
  constructor(workflow) {
    this._context = {}
    this._workflow = workflow
  }

  async getStep(type, stepId) {
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

  async execute(context) {
    let workflow = this._workflow
    for (let block of workflow.definition.steps) {
      let step = await this.getStep(block.type, block.stepId)
      let args = { ...block.args }
      // bind the workflow action args to the workflow context, if required
      for (let arg of Object.keys(args)) {
        const argValue = args[arg]
        // We don't want to render mustache templates on non-strings
        if (typeof argValue !== "string") continue

        args[arg] = mustache.render(argValue, { context: this._context })
      }
      const response = await step({
        args,
        context,
      })

      this._context = {
        ...this._context,
        [block.id]: response,
      }
    }
  }
}

// callback is required for worker-farm to state that the worker thread has completed
module.exports = async (job, cb = null) => {
  try {
    const workflowOrchestrator = new Orchestrator(job.data.workflow)
    await workflowOrchestrator.execute(job.data.event)
    if (cb) {
      cb()
    }
  } catch (err) {
    if (cb) {
      cb(err)
    }
  }
}
