import { get } from "svelte/store";
import { setState } from "../../state/setState";
import mustache from "mustache";
import { appStore } from "../../state/store";

/**
 * The workflow orchestrator is a class responsible for executing workflows.
 * It relies on the strategy pattern, which allows composable behaviour to be
 * passed into its execute() function. This allows custom execution behaviour based
 * on where the orchestrator is run.
 *
 */
export default class Orchestrator {
  constructor(api, instanceId) {
    this.api = api
    this.instanceId = instanceId
  }

  set strategy(strategy) {
    this._strategy = strategy({ api: this.api, instanceId: this.instanceId });
  }

  async execute(workflowId) {
    const EXECUTE_WORKFLOW_URL = `/api/${this.instanceId}/workflows/${workflowId}`
    const workflow = await this.api.get({ url: EXECUTE_WORKFLOW_URL })
    this._strategy.run(workflow.definition)
  }
}

// Execute a workflow from a running budibase app
export const clientStrategy = ({ api, instanceId }) => ({
  delay: ms => new Promise(resolve => setTimeout(resolve, ms)),
  context: {},
  bindContextArgs: function(args) {
    const mappedArgs = { ...args }

    console.log("original args", args)

    // bind the workflow action args to the workflow context, if required
    for (let arg in args) {
      const argValue = args[arg]
      // Means that it's bound to state or workflow context
      console.log(argValue, get(appStore));
      mappedArgs[arg] = mustache.render(argValue, {
        context: this.context,
        state: get(appStore) 
      });
    }

    console.log(mappedArgs)

    return mappedArgs
  },
  run: async function(workflow) {
    const block = workflow.next

    console.log("Executing workflow block", block)

    if (!block) return

    // This code gets run in the browser
    if (block.environment === "CLIENT") {
      if (block.actionId === "SET_STATE") {
        // get props from the workflow context if required
        setState(...Object.values(this.bindContextArgs(block.args)))
        // update the context with the data
        this.context = {
          ...this.context,
          SET_STATE: block.args,
        }
      }

      if (block.actionId === "NAVIGATE") {
      }

      if (block.actionId === "DELAY") {
        await this.delay(block.args.time)       
      }

      if (block.actionId === "FILTER") {
        const { field, condition, value } = block.args;
        switch (condition) {
          case "=":
            if (field !== value) return;
            break;
          case "!=":
            if (field === value) return;
            break;
          case "gt":
            if (field < value) return;
            break;
          case "lt":
            if (field > value) return;
          default:
            return;
        }
      }
    }

    // this workflow block gets executed on the server
    if (block.environment === "SERVER") {
      const EXECUTE_WORKFLOW_URL = `/api/${instanceId}/workflows/action`
      const response = await api.post({
        url: EXECUTE_WORKFLOW_URL,
        body: {
          action: block.actionId,
          args: this.bindContextArgs(block.args, api),
        },
      })

      this.context = {
        ...this.context,
        [block.actionId]: response,
      }
    }

    console.log("workflowContext", this.context)

    await this.run(workflow.next)
  },
})
