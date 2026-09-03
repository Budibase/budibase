import { context } from "@budibase/backend-core"
import { dataFilters } from "@budibase/shared-core"
import {
  AgentEscalationConfig,
  AgentOperation,
  AgentOperationApprovalPolicy,
  AgentRequester,
  ChatConversationChannel,
  EscalateToolResultStatus,
  EscalationSource,
  ResolutionStrategy,
  ToolExecutionRule,
  ToolType,
} from "@budibase/types"
import type { ModelMessage } from "ai"
import type { EscalationGateRuntime } from "../../../../ai/tools"
import sdk from "../../.."
import { escalationProcessor } from "../../../../escalation/processor"
import { resolutionStrategyBinding } from "../../../../escalation/resolutionStrategies"

export const DEFAULT_ESCALATION_DELAY_SECONDS = 3600

const SUMMARY_MAX_LENGTH = 300

export interface EscalationGateContext {
  sessionId: string
  channel?: ChatConversationChannel
  userId?: string
  requester?: AgentRequester
  getMessages: () => ModelMessage[]
  getRequestId: () => string | undefined
  executedApproval?: { toolName: string }
  generateCardCopy?: (input: {
    label: string
    args: unknown
  }) => Promise<{ title: string; summary: string } | undefined>
}

interface CreateGateParams {
  agentId: string
  operation: AgentOperation
  toolName: string
  readableName?: string
  sourceId?: string
  // Key of the args object holding the condition fields e.g "data"
  argsKey?: string
  rules: ToolExecutionRule[]
  gateContext: EscalationGateContext
}

export const resolveToolAction = (tool: {
  name: string
  readableName?: string
}): string => (tool.readableName ?? tool.name).split(".").pop() ?? ""

export const resolveToolArgsKey = (tool: {
  name: string
  readableName?: string
  sourceType: ToolType
}): string | undefined => {
  const action = resolveToolAction(tool)
  if (
    (tool.sourceType === ToolType.INTERNAL_TABLE ||
      tool.sourceType === ToolType.EXTERNAL_TABLE) &&
    (action === "create_row" || action === "update_row")
  ) {
    return "data"
  }
  if (tool.sourceType === ToolType.AUTOMATION && action === "trigger") {
    return "fields"
  }
  return undefined
}

const conditionRecord = (
  input: unknown,
  argsKey?: string
): Record<string, unknown> | undefined => {
  const root =
    argsKey && input && typeof input === "object"
      ? (input as Record<string, unknown>)[argsKey]
      : input
  return root && typeof root === "object" && !Array.isArray(root)
    ? (root as Record<string, unknown>)
    : undefined
}

const ruleMatches = (
  rule: ToolExecutionRule,
  record: Record<string, unknown> | undefined
): boolean => {
  const conditions = rule.conditions ?? []
  if (!conditions.length) {
    return true
  }
  if (!record) {
    return true
  }
  const query = dataFilters.buildQuery(conditions)
  return dataFilters.runQuery([record], query).length > 0
}

const buildConditionRecord = async ({
  input,
  argsKey,
  toolName,
  action,
  sourceId,
}: {
  input: unknown
  argsKey?: string
  toolName: string
  action: string
  sourceId?: string
}): Promise<Record<string, unknown> | undefined> => {
  const record = conditionRecord(input, argsKey)
  if (!record || action !== "update_row" || !sourceId) {
    return record
  }
  const rowId = (input as Record<string, unknown>).rowId
  if (typeof rowId !== "string") {
    return record
  }
  try {
    const existing = await sdk.rows.find(sourceId, rowId)
    return { ...existing, ...record }
  } catch (error) {
    console.warn("escalation gate: could not load row for update conditions", {
      toolName,
      rowId,
      error: error instanceof Error ? error.message : String(error),
    })
    return undefined
  }
}

// First matching rule in array order wins.
const matchRule = (
  rules: ToolExecutionRule[],
  record: Record<string, unknown> | undefined
) => rules.find(rule => ruleMatches(rule, record))

const resolvePolicy = (
  operation: AgentOperation,
  policyId: string
): AgentOperationApprovalPolicy | undefined =>
  operation.approvalPolicies?.find(policy => policy.id === policyId)

const summariseArgs = (label: string, input: unknown) => {
  let args: string
  try {
    args = JSON.stringify(input)
  } catch {
    args = String(input)
  }
  const summary = `${label}: ${args}`
  return summary.length > SUMMARY_MAX_LENGTH
    ? `${summary.slice(0, SUMMARY_MAX_LENGTH - 1)}…`
    : summary
}

const unavailableResult = (label: string) => ({
  status: EscalateToolResultStatus.UNAVAILABLE,
  note:
    `"${label}" requires approval but its approval policy is missing or has ` +
    "no reviewers configured. Tell the user this action cannot be requested " +
    "right now.",
})

export const createEscalationGateRuntime = ({
  agentId,
  operation,
  toolName,
  readableName,
  sourceId,
  argsKey,
  rules,
  gateContext,
}: CreateGateParams): EscalationGateRuntime => ({
  intercept: async (input, { toolCallId, messages }) => {
    const label = readableName ?? toolName
    const executed = gateContext.executedApproval
    if (executed && executed.toolName === toolName) {
      return {
        status: EscalateToolResultStatus.UNAVAILABLE,
        note:
          `"${label}" was already executed under this conversation's ` +
          "approval - its result is above. Report that outcome. The user " +
          "must ask again before another attempt can be requested.",
      }
    }
    const record = await buildConditionRecord({
      input,
      argsKey,
      toolName,
      action: resolveToolAction({ name: toolName, readableName }),
      sourceId,
    })
    const rule = matchRule(rules, record)
    console.log("escalation gate: rule evaluation", {
      toolName,
      ruleCount: rules.length,
      matchedIndex: rule ? rules.indexOf(rule) : -1,
      policyId: rule?.policyId,
      conditions: rule?.conditions,
    })
    if (!rule) {
      return undefined
    }

    const policy = resolvePolicy(operation, rule.policyId)
    const notifications: AgentEscalationConfig | undefined =
      policy?.notifications
    if (!policy || !notifications?.recipients?.length) {
      return unavailableResult(label)
    }

    const frozenMessages = messages?.length
      ? messages
      : gateContext.getMessages()
    const appId = context.getWorkspaceId()
    const tenantId = context.getTenantId()
    if (!appId) {
      throw new Error("escalation gate: missing workspace context")
    }

    let title = `Approval required: ${label}`
    let summary = summariseArgs(label, input)
    try {
      const copy = await gateContext.generateCardCopy?.({
        label,
        args: input,
      })
      if (copy?.title && copy?.summary) {
        title = copy.title
        summary = copy.summary
      }
    } catch (error) {
      console.warn("escalation gate: card copy generation failed", {
        toolName,
        error: error instanceof Error ? error.message : String(error),
      })
    }

    const { escalationId } = await escalationProcessor.create({
      source: EscalationSource.OPERATION,
      appId,
      tenantId,
      message: summary,
      title,
      summary,
      delay: (notifications.delay ?? DEFAULT_ESCALATION_DELAY_SECONDS) * 1000,
      recipients: notifications.recipients,
      resolutionStrategy: resolutionStrategyBinding(
        policy.approvalType ?? ResolutionStrategy.FIRST_RESPONSE
      ),
      agentId,
      operationId: operation.id,
      requestId: gateContext.getRequestId(),
      context: {
        agentId,
        operationId: operation.id,
        sessionId: gateContext.sessionId,
        channel: gateContext.channel,
        userId: gateContext.userId,
        requester: gateContext.requester,
        messages: frozenMessages,
        pendingToolCall: {
          toolCallId,
          toolName,
          args: input,
          sourceId,
        },
      },
    })

    return {
      status: EscalateToolResultStatus.PENDING_APPROVAL,
      escalationId,
      title,
      summary,
      note:
        `Approval requested for ${label}. The action is paused until a ` +
        "human responds - do not attempt it again in this turn.",
    }
  },
})
