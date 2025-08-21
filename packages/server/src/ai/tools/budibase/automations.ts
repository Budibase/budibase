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
    description:
      "Manually trigger an automation with optional input data (only works for APP trigger type automations)",
    parameters: z.object({
      automationId: z.string().describe("The ID of the automation to trigger"),
      fields: z
        .string()
        .describe(
          "Input fields/data to pass to the app action automation trigger as JSON object. Ensure the schema for the automation is known before triggering it."
        ),
      timeout: z.number().optional().describe("Timeout in seconds (optional)"),
    }),
    handler: async ({
      automationId,
      fields,
      timeout,
    }: {
      automationId: string
      fields: string
      timeout?: number
    }) => {
      let parsedData
      try {
        parsedData = JSON.parse(fields)
      } catch (error) {
        return `Error: Invalid JSON in fields parameter: ${error}`
      }
      const result = await sdk.automations.execution.trigger(
        automationId,
        parsedData || {},
        timeout
      )
      const formatted = JSON.stringify(result, null, 2)
      return `Successfully triggered automation:\n\n${formatted}`
    },
  }),
]
