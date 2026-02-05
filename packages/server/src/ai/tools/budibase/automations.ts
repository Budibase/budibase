import { context } from "@budibase/backend-core"
import { Automation, AutomationStatus, ToolType } from "@budibase/types"
import { tool } from "ai"
import { z } from "zod"
import env from "../../../environment"
import * as triggers from "../../../automations/triggers"
import sdk from "../../../sdk"
import type { BudibaseToolDefinition } from "."

const PLAIN_TEXT_WARNING =
  "CRITICAL: Use plain text values only. Do NOT include HTML tags, markdown formatting, " +
  "or content containing quotes, backslashes, or special characters - these break JSON parsing. " +
  "Summarize or strip complex content. Max 500 characters per field."

const FIELDS_DESCRIPTION =
  'Input fields/data to pass to the automation trigger as a JSON object. Example: {"message": "Hello"}. ' +
  "Do NOT nest this inside a string; pass the object directly. " +
  "Values must be plain text - no HTML, markdown, or special characters."

interface AutomationTool {
  description: string
  inputSchema: z.ZodObject<any>
  execute: (automationId: string, input: any) => Promise<any>
}

const AUTOMATION_TOOL: Record<string, AutomationTool> = {
  trigger: {
    description:
      "Trigger this automation and wait for completion. Returns all step outputs. Only works for APP trigger type automations.",
    inputSchema: z.object({
      fields: z
        .record(z.string(), z.any())
        .nullish()
        .describe(`${FIELDS_DESCRIPTION} ${PLAIN_TEXT_WARNING}`),
      timeout: z.number().nullish().describe("Timeout in seconds (optional)"),
    }),
    execute: async (automationId, { fields, timeout }) => {
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
          fields: fields || {},
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
  },
}

const formatActionLabel = (action: string) =>
  action
    .split("_")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")

export const createAutomationTools = ({
  automationId,
  automationName,
}: {
  automationId: string
  automationName: string
}): BudibaseToolDefinition[] => {
  return Object.entries(AUTOMATION_TOOL).map(([action, def]) => {
    const description = `${formatActionLabel(action)} automation "${automationName}". ${def.description}`
    // OpenAI tool names must match [A-Za-z0-9_-] and be ≤64 chars
    const sanitizedAutomationId = automationId.replace(/[^A-Za-z0-9_-]/g, "_")
    const toolName = `${sanitizedAutomationId}_${action}`.substring(0, 64)
    return {
      name: toolName,
      readableName: `${automationName}.${action}`,
      sourceType: ToolType.AUTOMATION,
      sourceLabel: "Budibase",
      description,
      tool: tool({
        description,
        inputSchema: def.inputSchema,
        execute: async input => def.execute(automationId, input),
      }),
    }
  })
}

const AUTOMATION_TOOLS: BudibaseToolDefinition[] = [
  {
    name: "list_automations",
    sourceType: ToolType.AUTOMATION,
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
    sourceType: ToolType.AUTOMATION,
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
]

export default AUTOMATION_TOOLS
