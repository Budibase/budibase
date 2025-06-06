import { newTool } from "@budibase/types"
import sdk from "../../../sdk"
import { z } from "zod"

export default [
  newTool({
    name: "list_automations",
    description: "List all automations in the current app",
    handler: async () => {
      const automations = await sdk.automations.fetch()
      const formatted = JSON.stringify(automations, null, 2)
      return `Here are the automations in the current app:\n\n${formatted}`
    },
  }),

  newTool({
    name: "get_automation",
    description: "Get details about a specific automation by ID",
    parameters: z.object({
      automationId: z.string().describe("The ID of the automation to retrieve"),
    }),
    handler: async ({ automationId }: { automationId: string }) => {
      const automation = await sdk.automations.get(automationId)
      const formatted = JSON.stringify(automation, null, 2)
      return `Here are the details for automation ${automationId}:\n\n${formatted}`
    },
  }),

  newTool({
    name: "trigger_automation",
    description: "Manually trigger an automation with optional input data (only works for APP trigger type automations)",
    parameters: z.object({
      automationId: z.string().describe("The ID of the automation to trigger"),
      fields: z.object({}).optional().describe("Input fields/data to pass to the automation as JSON object"),
      timeout: z.number().optional().describe("Timeout in seconds (optional)"),
    }),
    handler: async ({ automationId, fields, timeout }: { automationId: string; fields?: Record<string, any>; timeout?: number }) => {
      const result = await sdk.automations.execution.trigger(automationId, fields || {}, timeout)
      const formatted = JSON.stringify(result, null, 2)
      return `Successfully triggered automation:\n\n${formatted}`
    },
  }),

]
