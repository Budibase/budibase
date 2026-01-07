import { context } from "@budibase/backend-core"
import { Automation, AutomationStatus, ToolType } from "@budibase/types"
import { tool } from "ai"
import { z } from "zod"
import env from "../../../environment"
import * as triggers from "../../../automations/triggers"
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
      "Trigger an automation and wait for its completion. Returns all step outputs. Only works for APP trigger type automations. IMPORTANT: You must use list_automations first to get the exact _id of the automation you want to trigger.",
    tool: tool({
      description:
        "Trigger an automation and wait for its completion. Returns all step outputs. Only works for APP trigger type automations. IMPORTANT: You must use list_automations first to get the exact _id of the automation you want to trigger.",
      inputSchema: z.object({
        automationId: z
          .string()
          .describe(
            "The exact _id of the automation to trigger (obtained from list_automations)"
          ),
        fields: z
          .string()
          .describe(
            "Input fields/data to pass to the app action automation trigger as JSON object. Ensure the schema for the automation is known before triggering it."
          ),
        timeout: z.number().nullish().describe("Timeout in seconds (optional)"),
      }),
      execute: async input => {
        const { automationId, fields, timeout } = input
        let parsedData
        try {
          parsedData = JSON.parse(fields)
        } catch (error) {
          return { error: `Invalid JSON in fields parameter: ${error}` }
        }

        const db = context.getWorkspaceDB()
        const automation = await db.tryGet<Automation>(automationId)

        if (!automation) {
          return { error: `Automation with ID ${automationId} not found` }
        }

        const triggerType = automation.definition?.trigger?.stepId
        if (triggerType !== "APP") {
          return {
            error: `Cannot trigger automation '${automation.name}'. Only APP trigger type supported. This automation has: ${triggerType}`,
          }
        }

        const response = await triggers.externalTrigger(
          automation,
          {
            fields: parsedData || {},
            timeout: timeout ? timeout * 1000 : env.AUTOMATION_THREAD_TIMEOUT,
          },
          { getResponses: true }
        )

        if (triggers.isAutomationResults(response)) {
          return {
            success: response.status === AutomationStatus.SUCCESS,
            status: response.status,
            steps: response.steps,
          }
        } else {
          return {
            success: false,
            error: response.message || "Automation did not trigger",
          }
        }
      },
    }),
  },
]

export default AUTOMATION_TOOLS
