import { get } from "svelte/store"
import mustache from "mustache"
import { appStore } from "../../state/store"
import Orchestrator from "./orchestrator";
import clientActions from "./actions"

// Execute a workflow from a running budibase app
export const clientStrategy = ({ api, instanceId }) => ({
  context: {},
  bindContextArgs: function(args) {
    const mappedArgs = { ...args }

    // bind the workflow action args to the workflow context, if required
    for (let arg in args) {
      const argValue = args[arg]

      // We don't want to render mustache templates on non-strings
      if (typeof argValue !== "string") continue

      // Render the string with values from the workflow context and state
      mappedArgs[arg] = mustache.render(argValue, {
        context: this.context,
        state: get(appStore),
      })
    }

    return mappedArgs
  },
  run: async function(workflow) {
    for (let block of workflow.steps) {
      console.log("Executing workflow block", block)

      // This code gets run in the browser
      if (block.environment === "CLIENT") {
        const action = clientActions[block.actionId]
        await action({
          context: this.context,
          args: this.bindContextArgs(block.args),
          id: block.id,
        })
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
    }
  },
})

export const triggerWorkflow = api => async ({ workflow }) => {
  const instanceId = "inst_ad75c7f_4f3e7d5d80a74b17a5187a18e2aba85e";

  const workflowOrchestrator = new Orchestrator(api, instanceId)
  workflowOrchestrator.strategy = clientStrategy

  const EXECUTE_WORKFLOW_URL = `/api/${instanceId}/workflows/${workflow}`
  const workflowDefinition = await api.get({ url: EXECUTE_WORKFLOW_URL })

  workflowOrchestrator.execute(workflowDefinition)
}
