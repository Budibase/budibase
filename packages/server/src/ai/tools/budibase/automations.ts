import { ToolType } from "@budibase/types"
import { tool } from "ai"
import { z } from "zod"
import sdk from "../../../sdk"
import type { BudibaseToolDefinition } from "."

const AUTOMATION_TOOLS: BudibaseToolDefinition[] = [
  {
    name: "list_automations",
    sourceType: ToolType.BUDIBASE,
    sourceLabel: "Budibase",
    description: "List all automations in the current app",
    tool: tool({
      description: "List all automations in the current app",
      inputSchema: z.object({}),
      execute: async () => {
        const automations = await sdk.automations.fetch()
        return { automations }
      },
    }),
  },

  {
    name: "get_automation",
    sourceType: ToolType.BUDIBASE,
    sourceLabel: "Budibase",

    description: "Get details about a specific automation by ID",
    tool: tool({
      description: "Get details about a specific automation by ID",
      inputSchema: z.object({
        automationId: z
          .string()
          .describe("The ID of the automation to retrieve"),
      }),
      execute: async (input: unknown) => {
        const { automationId } = input as { automationId: string }
        const automation = await sdk.automations.get(automationId)
        return { automation }
      },
    }),
  },

  {
    name: "trigger_automation",
    sourceType: ToolType.BUDIBASE,
    sourceLabel: "Budibase",

    description:
      "Manually trigger an automation with optional input data (only works for APP trigger type automations)",
    tool: tool({
      description:
        "Manually trigger an automation with optional input data (only works for APP trigger type automations)",
      inputSchema: z.object({
        automationId: z
          .string()
          .describe("The ID of the automation to trigger"),
        fields: z
          .string()
          .describe(
            "Input fields/data to pass to the app action automation trigger as JSON object. Ensure the schema for the automation is known before triggering it."
          ),
        timeout: z.number().nullish().describe("Timeout in seconds (optional)"),
      }),
      execute: async (input: unknown) => {
        const { automationId, fields, timeout } = input as {
          automationId: string
          fields: string
          timeout?: number | null
        }
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
  },
]

export default AUTOMATION_TOOLS
