import { context } from "@budibase/backend-core"
import { dataFilters } from "@budibase/shared-core"
import {
  AgentOperation,
  AgentOperationApprovalPolicy,
  AgentRequester,
  ApprovedToolCall,
  ChatConversationChannel,
  ApprovalToolResultStatus,
  EscalationSource,
  type EscalationReviewContext,
  type EscalationReviewParameter,
  ResolutionStrategy,
  ToolExecutionRule,
  ToolAction,
  ToolType,
} from "@budibase/types"
import type { ModelMessage } from "ai"
import isEqual from "lodash/isEqual"
import type { EscalationGateRuntime } from "../../../../ai/tools"
import { APPROVAL_REQUIRED_TITLE_PREFIX } from "../../../../escalation/constants"
import sdk from "../../.."
import { escalationProcessor } from "../../../../escalation/processor"
import { resolutionStrategyBinding } from "../../../../escalation/resolutionStrategies"
import {
  formatToolParameters,
  stringifyToolParameters,
  truncateReviewField,
} from "../../../../escalation/reviewContext"

export const DEFAULT_ESCALATION_DELAY_SECONDS = 3600

const SUMMARY_MAX_LENGTH = 300

export interface EscalationGateContext {
  sessionId: string
  channel?: ChatConversationChannel
  userId?: string
  requester?: AgentRequester
  requesterLabel?: string
  getMessages: () => ModelMessage[]
  getRequestId: () => string | undefined
  executedApproval?: ApprovedToolCall
  generateCardCopy?: (input: {
    label: string
    parameters?: EscalationReviewParameter[]
    operation: string
  }) => Promise<{ title: string; summary: string } | undefined>
}

interface CreateGateParams {
  agentId: string
  operation: AgentOperation
  toolName: string
  readableName?: string
  displayName?: string
  sourceId?: string
  action?: ToolAction
  // Key of the args object holding the condition fields e.g "data"
  argsKey?: string
  rules: ToolExecutionRule[]
  gateContext: EscalationGateContext
}

export const resolveToolArgsKey = (tool: {
  sourceType: ToolType
  action?: ToolAction
}): string | undefined => {
  if (
    (tool.sourceType === ToolType.INTERNAL_TABLE ||
      tool.sourceType === ToolType.EXTERNAL_TABLE) &&
    (tool.action === ToolAction.CREATE_ROW ||
      tool.action === ToolAction.UPDATE_ROW)
  ) {
    return "data"
  }
  if (
    tool.sourceType === ToolType.AUTOMATION &&
    tool.action === ToolAction.TRIGGER
  ) {
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

const reviewRecord = (input: unknown, argsKey?: string) => {
  const root = conditionRecord(input)
  const nested = conditionRecord(input, argsKey)
  if (!argsKey || !root || !nested) {
    return nested ?? input
  }
  const { [argsKey]: _nested, ...directArguments } = root
  return { ...directArguments, ...nested }
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
  action?: ToolAction
  sourceId?: string
}): Promise<Record<string, unknown> | undefined> => {
  const record = conditionRecord(input, argsKey)
  if (!record || action !== ToolAction.UPDATE_ROW || !sourceId) {
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

// Generated and fallback copy only receive the values explicitly shared with
// reviewers, never the complete invocation arguments.
const summariseArgs = (
  label: string,
  parameters?: EscalationReviewParameter[]
) => {
  const summary = parameters
    ? `${label}: ${stringifyToolParameters(parameters).replace(/\s+/g, " ")}`
    : `${label} requires approval.`
  return summary.length > SUMMARY_MAX_LENGTH
    ? `${summary.slice(0, SUMMARY_MAX_LENGTH - 1)}…`
    : summary
}

const unavailableResult = (label: string) => ({
  status: ApprovalToolResultStatus.UNAVAILABLE,
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
  displayName,
  sourceId,
  action,
  argsKey,
  rules,
  gateContext,
}: CreateGateParams): EscalationGateRuntime => ({
  intercept: async (input, { toolCallId, messages }) => {
    const label = readableName ?? toolName
    const executed = gateContext.executedApproval
    if (
      executed &&
      executed.toolName === toolName &&
      executed.sourceId === sourceId &&
      isEqual(executed.args, input)
    ) {
      return {
        status: ApprovalToolResultStatus.ALREADY_APPROVED,
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
      action,
      sourceId,
    })
    const rule = matchRule(rules, record)
    if (!rule) {
      return undefined
    }

    const policy = resolvePolicy(operation, rule.policyId)
    if (!policy?.notifications?.recipients?.length) {
      return unavailableResult(label)
    }
    const { notifications, ...policySnapshot } = policy
    if (policySnapshot.approvers) {
      policySnapshot.approvers = Array.from(new Set(policySnapshot.approvers))
    }
    const { recipients, delay } = notifications

    const frozenMessages = messages?.length
      ? messages
      : gateContext.getMessages()
    const appId = context.getWorkspaceId()
    const tenantId = context.getTenantId()
    if (!appId) {
      throw new Error("escalation gate: missing workspace context")
    }

    const requestedBy = gateContext.requesterLabel ?? "Unknown requester"
    const parameters = formatToolParameters({
      input: reviewRecord(input, argsKey),
      names: rule.reviewParameters,
    })
    const actionLabel = truncateReviewField(label)
    const toolDisplay = truncateReviewField(displayName ?? label)
    let title = `${APPROVAL_REQUIRED_TITLE_PREFIX} ${label}`
    let summary = summariseArgs(label, parameters)
    try {
      const copy = await gateContext.generateCardCopy?.({
        label,
        parameters,
        operation: operation.name,
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

    const reviewContext: EscalationReviewContext = {
      requestedBy: truncateReviewField(requestedBy),
      operation: truncateReviewField(operation.name),
      action: actionLabel,
      ...(toolDisplay !== actionLabel && { toolName: toolDisplay }),
      ...(parameters && { parameters }),
    }
    const { escalationId } = await escalationProcessor.create({
      source: EscalationSource.OPERATION,
      appId,
      tenantId,
      message: summary,
      title,
      summary,
      reviewContext,
      delay: (delay ?? DEFAULT_ESCALATION_DELAY_SECONDS) * 1000,
      recipients,
      resolutionStrategy: resolutionStrategyBinding(
        policy.approvers?.length
          ? (policy.approvalType ?? ResolutionStrategy.FIRST_RESPONSE)
          : ResolutionStrategy.FIRST_RESPONSE
      ),
      rule,
      policy: policySnapshot,
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
      status: ApprovalToolResultStatus.PENDING_APPROVAL,
      escalationId,
      title,
      summary,
      reviewContext,
      note:
        `Approval requested for ${label}. The action is paused until a ` +
        "human responds - do not attempt it again in this turn.",
    }
  },
})
