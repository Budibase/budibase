import { z } from "zod"
import { context } from "@budibase/backend-core"
import { newTool } from ".."
import sdk from "../../../sdk"
import * as triggers from "../../../automations/triggers"
import env from "../../../environment"
import { Automation, AutomationStatus, ToolType } from "@budibase/types"

export default [
  newTool({
    name: "list_automations",
    sourceType: ToolType.BUDIBASE,
    sourceLabel: "Budibase",
    description:
      "List all automations in the current app. Each automation has a unique _id field that must be used when calling trigger_automation or get_automation.",
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
      "Trigger an automation and wait for its completion. Returns all step outputs. Only works for APP trigger type automations. IMPORTANT: You must use list_automations first to get the exact _id of the automation you want to trigger.",
    parameters: z.object({
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
]
