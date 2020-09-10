const mustache = require("mustache")
const actions = require("./actions")
const logic = require("./logic")
const triggers = require("./triggers")

/**
 * The workflow orchestrator is a class responsible for executing workflows.
 * It relies on the strategy pattern, which allows composable behaviour to be
 * passed into its execute() function. This allows custom execution behaviour based
 * on where the orchestrator is run.
 *
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
    if (!workflow.live) {
      return
    }
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

module.exports.init = function() {
  triggers.workflowQueue.process(async job => {
    // Create orchestrator for each individual workflow (their own context)
    const workflowOrchestrator = new Orchestrator(job.data.workflow)
    await workflowOrchestrator.execute(job.data.event)
  })
}
