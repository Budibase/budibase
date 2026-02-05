import { tool } from "ai"
import { z } from "zod"
import { context } from "@budibase/backend-core"
import {
  Automation,
  AutomationStatus,
  AutomationTriggerStepId,
  ToolType,
} from "@budibase/types"
import env from "../../../environment"
import * as triggers from "../../../automations/triggers"
import sdk from "../../../sdk"
import type { BudibaseToolDefinition } from "."

const TRIGGER_AUTOMATION_BASE_DESCRIPTION =
  "Trigger an automation and wait for its completion. Returns all step outputs. Only works for APP trigger type automations."

const DEFAULT_FIELDS_DESCRIPTION =
  "Input fields/data to pass to the app action automation trigger as a JSON object (string, number, boolean, array). Ensure the schema for the automation is known before triggering it."

type AutomationFieldValue = string | number | boolean | any[]

const triggerAutomationById = async ({
  automationId,
  fields,
  timeout,
}: {
  automationId: string
  fields?: Record<string, AutomationFieldValue> | null
  timeout?: number | null
}) => {
  const resolvedFields = fields ?? {}

  const db = context.getWorkspaceDB()
  const automation = await db.tryGet<Automation>(automationId)

  if (!automation) {
    return { error: `Automation with ID ${automationId} not found` }
  }

  const triggerType = automation.definition?.trigger?.stepId
  if (triggerType !== AutomationTriggerStepId.APP) {
    return {
      error: `Cannot trigger automation '${automation.name}'. Only APP trigger type supported. This automation has: ${triggerType}`,
    }
  }

  const response = await triggers.externalTrigger(
    automation,
    {
      fields: resolvedFields,
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

  {
    name: "trigger_automation",
    sourceType: ToolType.AUTOMATION,
    sourceLabel: "Budibase",

    description: `${TRIGGER_AUTOMATION_BASE_DESCRIPTION} IMPORTANT: You must use list_automations first to get the exact _id of the automation you want to trigger.`,
    tool: tool({
      description: `${TRIGGER_AUTOMATION_BASE_DESCRIPTION} IMPORTANT: You must use list_automations first to get the exact _id of the automation you want to trigger.`,
      inputSchema: z.object({
        automationId: z
          .string()
          .describe(
            "The exact _id of the automation to trigger (obtained from list_automations)"
          ),
        fields: z
          .record(
            z.string(),
            z.union([z.string(), z.number(), z.boolean(), z.array(z.any())])
          )
          .nullish()
          .describe(DEFAULT_FIELDS_DESCRIPTION),
        timeout: z.number().nullish().describe("Timeout in seconds (optional)"),
      }),
      execute: async input => {
        const { automationId, fields, timeout } = input as {
          automationId: string
          fields?: Record<string, AutomationFieldValue> | null
          timeout?: number | null
        }
        return triggerAutomationById({ automationId, fields, timeout })
      },
    }),
  },
]

const createAutomationTools = (
  automations: Automation[] = []
): BudibaseToolDefinition[] => {
  const automationTriggerTools = automations
    .filter(automation => {
      return (
        automation._id &&
        automation.definition?.trigger?.stepId === AutomationTriggerStepId.APP
      )
    })
    .map(automation => {
      const automationName = automation.name || automation._id!
      const sanitizedAutomationId = automation._id!.replace(
        /[^A-Za-z0-9_-]/g,
        "_"
      )
      const toolName = `${sanitizedAutomationId}_trigger_automation`.substring(
        0,
        64
      )
      const description = `Trigger "${automationName}" automation. ${TRIGGER_AUTOMATION_BASE_DESCRIPTION}`

      return {
        name: toolName,
        readableName: `${automationName}.trigger_automation`,
        sourceType: ToolType.AUTOMATION,
        sourceLabel: "Budibase",
        description,
        tool: tool({
          description,
          inputSchema: z.object({
            fields: z
              .record(
                z.string(),
                z.union([z.string(), z.number(), z.boolean(), z.array(z.any())])
              )
              .nullish()
              .describe(DEFAULT_FIELDS_DESCRIPTION),
            timeout: z
              .number()
              .nullish()
              .describe("Timeout in seconds (optional)"),
          }),
          execute: async input => {
            const { fields, timeout } = input as {
              fields?: Record<string, AutomationFieldValue> | null
              timeout?: number | null
            }
            return triggerAutomationById({
              automationId: automation._id!,
              fields,
              timeout,
            })
          },
        }),
      }
    })

  return [...AUTOMATION_TOOLS, ...automationTriggerTools]
}

export default createAutomationTools
