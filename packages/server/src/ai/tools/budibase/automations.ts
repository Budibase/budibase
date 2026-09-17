import { tool } from "ai"
import { z } from "zod"
import { context } from "@budibase/backend-core"
import {
  Automation,
  AutomationIOType,
  AutomationStatus,
  AutomationTriggerStepId,
  ToolAction,
  ToolType,
  PermissionLevel,
  PermissionType,
  ToolExecutionPrincipal,
} from "@budibase/types"
import * as triggers from "../../../automations/triggers"
import sdk from "../../../sdk"
import type { BudibaseToolDefinition } from "."
import { filterAgentToolCollectionResult } from "../authorization"

const TRIGGER_AUTOMATION_BASE_DESCRIPTION =
  "Trigger this automation (APP triggers only). Returns all step outputs."

const DEFAULT_FIELDS_DESCRIPTION =
  "Fields map matching the automation trigger schema."

const getAutomationFieldSchema = (type: AutomationIOType): z.ZodTypeAny => {
  switch (type) {
    case AutomationIOType.NUMBER:
      return z.number()
    case AutomationIOType.BOOLEAN:
      return z.boolean()
    case AutomationIOType.ARRAY:
    case AutomationIOType.ATTACHMENT:
      return z.array(z.unknown())
    case AutomationIOType.OBJECT:
    case AutomationIOType.JSON:
      return z.record(z.string(), z.unknown())
    default:
      return z.string()
  }
}

interface AutomationFieldsSource {
  definition?: {
    trigger?: {
      inputs?: object | null | void
    }
  }
}

export const buildAutomationFieldsSchema = (
  automation: AutomationFieldsSource
) => {
  const triggerInputs = automation.definition?.trigger?.inputs
  const fields =
    triggerInputs && "fields" in triggerInputs
      ? (triggerInputs.fields as Record<string, AutomationIOType> | undefined)
      : undefined
  if (!fields || Object.keys(fields).length === 0) {
    return z.record(z.string(), z.never())
  }

  return z
    .object(
      Object.fromEntries(
        Object.entries(fields).map(([name, type]) => [
          name,
          getAutomationFieldSchema(type).optional(),
        ])
      )
    )
    .strict()
}

const getAutomationFieldsSummary = (automation: Automation) => {
  const triggerInputs = automation.definition?.trigger?.inputs as {
    fields?: Record<string, AutomationIOType>
  } | null
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
}: {
  automationId: string
  fields?: Record<string, unknown> | null
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
    description: "List all automations in the current workspace",
    executionPolicy: {
      mode: "admin",
    },
    authorization: {
      permissionType: PermissionType.WORKSPACE,
      permissionLevel: PermissionLevel.READ,
    },
    filterResult: (result, runtime) =>
      filterAgentToolCollectionResult({
        result,
        collectionKey: "automations",
        permissionType: PermissionType.AUTOMATION,
        permissionLevel: PermissionLevel.READ,
        resolveResourceId: automation =>
          typeof automation === "object" && automation && "_id" in automation
            ? String(automation._id)
            : undefined,
        runtime,
      }),
    tool: tool({
      description: "List all automations in the current workspace",
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
    executionPolicy: {
      mode: "admin",
    },
    authorization: {
      permissionType: PermissionType.AUTOMATION,
      permissionLevel: PermissionLevel.READ,
      resolveResourceId: input =>
        typeof input === "object" && input && "automationId" in input
          ? String(input.automationId)
          : undefined,
    },
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
    .map((automation): BudibaseToolDefinition => {
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
      const fieldsSchema = buildAutomationFieldsSchema(automation)

      return {
        name: toolName,
        readableName: `${automationName}.trigger`,
        sourceId: automation._id,
        sourceType: ToolType.AUTOMATION,
        action: ToolAction.TRIGGER,
        sourceLabel: "Budibase",
        description,
        executionPolicy: {
          mode: "configurable",
          defaultPrincipal: ToolExecutionPrincipal.REQUESTER,
        },
        authorization: {
          permissionType: PermissionType.AUTOMATION,
          permissionLevel: PermissionLevel.EXECUTE,
          resourceId: automation._id!,
        },
        tool: tool({
          description,
          inputSchema: z.object({
            fields: fieldsSchema.nullish().describe(fieldsDescription),
          }),
          execute: async input => {
            const { fields } = input
            return triggerAutomationById({
              automationId: automation._id!,
              fields,
            })
          },
        }),
      }
    })

  return [...AUTOMATION_TOOLS, ...automationTriggerTools]
}

export default createAutomationTools
