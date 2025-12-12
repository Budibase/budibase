import { z } from "zod"
import { newTool } from ".."
import sdk from "../../../sdk"
import { ToolType } from "@budibase/types"

export default [
  newTool({
    name: "list_automations",
    sourceType: ToolType.BUDIBASE,
    sourceLabel: "Budibase",
    description: "List all automations in the current app",
    handler: async () => {
      const automations = await sdk.automations.fetch()
      return { automations }
    },
  }),

  newTool({
    name: "get_automation",
    sourceType: ToolType.BUDIBASE,
    sourceLabel: "Budibase",

    description: "Get details about a specific automation by ID",
    parameters: z.object({
      automationId: z.string().describe("The ID of the automation to retrieve"),
    }),
    handler: async ({ automationId }: { automationId: string }) => {
      const automation = await sdk.automations.get(automationId)
      return { automation }
    },
  }),

  newTool({
    name: "trigger_automation",
    sourceType: ToolType.BUDIBASE,
    sourceLabel: "Budibase",

    description:
      "Manually trigger an automation with optional input data (only works for APP trigger type automations)",
    parameters: z.object({
      automationId: z.string().describe("The ID of the automation to trigger"),
      fields: z
        .string()
        .describe(
          "Input fields/data to pass to the app action automation trigger as JSON object. Ensure the schema for the automation is known before triggering it."
        ),
      timeout: z.number().nullish().describe("Timeout in seconds (optional)"),
    }),
    handler: async ({
      automationId,
      fields,
      timeout,
    }: {
      automationId: string
      fields: string
      timeout?: number | null
    }) => {
      let parsedData
      try {
        parsedData = JSON.parse(fields)
      } catch (error) {
        return { error: `Invalid JSON in fields parameter: ${error}` }
      }
      const result = await sdk.automations.execution.trigger(
        automationId,
        parsedData || {},
        timeout ?? undefined
      )
      return { result }
    },
  }),
]
