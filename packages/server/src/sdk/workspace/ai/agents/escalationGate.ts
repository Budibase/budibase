import { context } from "@budibase/backend-core"
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
} from "@budibase/types"
import type { ModelMessage } from "ai"
import type { EscalationGateRuntime } from "../../../../ai/tools"
import { escalationProcessor } from "../../../../escalation/processor"
import { resolutionStrategyBinding } from "../../../../escalation/resolutionStrategies"
import {
  formatToolParameters,
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
  rules: ToolExecutionRule[]
  gateContext: EscalationGateContext
}

// Conditions aren't evaluated until the Phase 3 evaluator exists - until
// then every rule matches, so first-match = first rule.
const matchRule = (rules: ToolExecutionRule[]) => rules[0]

const resolvePolicy = (
  operation: AgentOperation,
  policyId: string
): AgentOperationApprovalPolicy | undefined =>
  operation.approvalPolicies?.find(policy => policy.id === policyId)

// Used for the notification title and summary whenever generated card copy is
// unavailable, so it renders the same redacted arguments the reviewer sees
// rather than the raw input.
const summariseArgs = (label: string, input: unknown) => {
  const summary = `${label}: ${formatToolParameters(input).replace(/\s+/g, " ")}`
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
    const rule = matchRule(rules)
    if (!rule) {
      return unavailableResult(label)
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
      reviewContext: {
        requestedBy: truncateReviewField(
          gateContext.requesterLabel ?? "Unknown requester"
        ),
        operation: truncateReviewField(operation.name),
        action: truncateReviewField(label),
        parameters: formatToolParameters(input),
      },
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
