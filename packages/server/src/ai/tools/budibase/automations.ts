import { tool } from "ai"
import { z } from "zod"
import { context } from "@budibase/backend-core"
import {
  Automation,
  AutomationIOType,
  AutomationStatus,
  AutomationTriggerStepId,
  ToolType,
} from "@budibase/types"
import env from "../../../environment"
import * as triggers from "../../../automations/triggers"
import sdk from "../../../sdk"
import type { BudibaseToolDefinition } from "."

const TRIGGER_AUTOMATION_BASE_DESCRIPTION =
  "Trigger this automation (APP triggers only). Returns all step outputs."

const DEFAULT_FIELDS_DESCRIPTION =
  "Fields map: key/value pairs. Values must be string, number, boolean, or array (no nested objects)."

type AutomationFieldValue = string | number | boolean | any[]

const getAutomationFieldsSummary = (automation: Automation) => {
  const triggerInputs = automation.definition?.trigger?.inputs as
    | { fields?: Record<string, AutomationIOType> }
    | undefined
  const fields = triggerInputs?.fields
  if (!fields || Object.keys(fields).length === 0) {
    return ""
  }

  return Object.entries(fields)
    .map(([name, type]) => `${name} (${type})`)
    .join(", ")
}

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
      execute: async input => {
        const { automationId } = input
        const automation = await sdk.automations.get(automationId)
        return { automation }
      },
    }),
  },
]

const createAutomationTools = (
  automations: Automation[] = []
): BudibaseToolDefinition[] => {
  const automationTriggerTools = automations
    .filter(
      automation =>
        automation._id &&
        automation.definition?.trigger?.stepId === AutomationTriggerStepId.APP
    )
    .map(automation => {
      const automationName = automation.name || automation._id!
      const sanitizedAutomationId = automation._id!.replace(
        /[^A-Za-z0-9_-]/g,
        "_"
      )
      const toolName = `${sanitizedAutomationId}_trigger`.substring(0, 64)
      const fieldsSummary = getAutomationFieldsSummary(automation)
      const fieldsDescription = fieldsSummary
        ? `${DEFAULT_FIELDS_DESCRIPTION} Available fields: ${fieldsSummary}.`
        : DEFAULT_FIELDS_DESCRIPTION
      const description = fieldsSummary
        ? `Trigger "${automationName}" automation. ${TRIGGER_AUTOMATION_BASE_DESCRIPTION} Fields: ${fieldsSummary}.`
        : `Trigger "${automationName}" automation. ${TRIGGER_AUTOMATION_BASE_DESCRIPTION}`

      return {
        name: toolName,
        readableName: `${automationName}.trigger`,
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
              .describe(fieldsDescription),
            timeout: z
              .number()
              .nullish()
              .describe("Timeout in seconds (optional)"),
          }),
          execute: async input => {
            const { fields, timeout } = input
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
