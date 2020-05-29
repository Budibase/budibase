import get from "lodash/fp/get"
import mustache from "mustache";

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
    this._strategy = strategy
  }

  async execute(workflowId) {
    const EXECUTE_WORKFLOW_URL = `/api/${this.instanceId}/workflows/${workflowId}`
    const workflow = await this.api.get({ url: EXECUTE_WORKFLOW_URL })
    this._strategy.run({
      workflow: workflow.definition,
      api: this.api,
      instanceId: this.instanceId,
    })
  }
}

// Execute a workflow from a running budibase app
export const clientStrategy = {
  delay: ms => new Promise(resolve => setTimeout(resolve, ms)),
  context: {},
  bindContextArgs: function(args, api) {
    const mappedArgs = { ...args }

    console.log("original args", args)

    // bind the workflow action args to the workflow context, if required
    for (let arg in args) {
      const argValue = args[arg]
      // Means that it's bound to state or workflow context
      mappedArgs[arg] = mustache.render(argValue, {
        context: this.context,
        // TODO: map to the real state
        state: {} 
      });
    }
    //   if (argValue.startsWith("$")) {
    //     // if value is bound to workflow context.
    //     if (argValue.startsWith("$context")) {
    //       const path = argValue.replace("$context.", "")
    //       // pass in the value from context
    //       mappedArgs[arg] = get(path, this.context)
    //     }

    //     // if the value is bound to state
    //     if (argValue.startsWith("$state")) {
    //       const path = argValue.replace("$state.", "")
    //       // pass in the value from state
    //       // TODO: not working
    //       mappedArgs[arg] = api.getState(path)
    //     }
    //   }
    // }

    console.log(mappedArgs)

    return Object.values(mappedArgs)
  },
  run: async function({ workflow, api, instanceId }) {
    const block = workflow.next

    console.log("Executing workflow block", block)

    if (!block) return

    // This code gets run in the browser
    if (block.environment === "CLIENT") {
      if (block.actionId === "SET_STATE") {
        // get props from the workflow context if required
        api.setState(...this.bindContextArgs(block.args))
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

    // TODO: clean this up, don't pass all those args
    await this.run({ workflow: workflow.next, instanceId, api })
  },
}
