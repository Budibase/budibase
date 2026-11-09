import { context } from "@budibase/backend-core"
import { constants as proConstants, licensing } from "@budibase/pro"
import { dataFilters, Duration, isQueryToolType } from "@budibase/shared-core"
import {
  AgentOperation,
  AgentOperationApprovalPolicy,
  AgentRequester,
  ApprovalPolicyExpiry,
  ApprovedToolCall,
  ChatConversationChannel,
  ApprovalToolResultStatus,
  ConstantQuotaName,
  EscalationSource,
  type EscalationReviewContext,
  type EscalationReviewParameter,
  type Query,
  ResolutionStrategy,
  Row,
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
import { processDefaultValues } from "../../../../utilities/rowProcessor"

const SUMMARY_MAX_LENGTH = 300
const DAY_MS = Duration.fromDays(1).toMs()

export const escalationDurationMs = async (
  expiry: ApprovalPolicyExpiry | undefined
): Promise<number | undefined> => {
  const license = await licensing.cache.getCachedLicense()
  const ceilingDays =
    license.quotas?.constant?.[ConstantQuotaName.ESCALATION_DURATION_DAYS]
      ?.value
  const unlimited =
    ceilingDays == null ||
    ceilingDays === proConstants.licenses.UNLIMITED ||
    !Number.isFinite(ceilingDays)
  const requested =
    expiry?.durationSeconds === undefined
      ? undefined
      : expiry.durationSeconds * 1000
  if (unlimited) {
    return requested
  }
  const ceiling = ceilingDays * DAY_MS
  return requested === undefined ? ceiling : Math.min(requested, ceiling)
}

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
  sourceType?: ToolType
  action?: ToolAction
  // Key of the args object holding the condition fields e.g "data"
  argsKey?: string
  rules: ToolExecutionRule[]
  gateContext: EscalationGateContext
}

interface ConditionRecordResult {
  record?: Record<string, unknown>
  defaulted: Record<string, unknown>
  fields?: string[]
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

const reviewRecord = ({
  input,
  argsKey,
  defaulted,
}: {
  input: unknown
  argsKey?: string
  defaulted: Record<string, unknown>
}) => {
  const root = conditionRecord(input)
  const nested = conditionRecord(input, argsKey)
  if (!argsKey || !root || !nested) {
    return nested ? { ...nested, ...defaulted } : input
  }
  const { [argsKey]: _nested, ...directArguments } = root
  return { ...directArguments, ...nested, ...defaulted }
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

const changedFields = (
  before: Record<string, unknown>,
  after: Record<string, unknown>
) =>
  Object.fromEntries(
    Object.entries(after).filter(([key, value]) => before[key] !== value)
  )

const queryConditionRecord = async ({
  queryId,
  record,
}: {
  queryId: string
  record: Record<string, unknown>
}): Promise<ConditionRecordResult> => {
  const query = await context.getWorkspaceDB().tryGet<Query>(queryId)
  if (!query) {
    throw new Error(`Query ${queryId} not found`)
  }
  const withDefaults: Record<string, unknown> = { ...record }
  for (const parameter of query.parameters) {
    const value = withDefaults[parameter.name]
    if (value == null || value === "") {
      withDefaults[parameter.name] = parameter.default
    }
  }
  return {
    record: await sdk.queries.enrichContext(withDefaults),
    defaulted: changedFields(record, withDefaults),
  }
}

const rowConditionRecord = async ({
  tableId,
  action,
  input,
  record,
}: {
  tableId: string
  action?: ToolAction
  input: unknown
  record: Record<string, unknown>
}): Promise<ConditionRecordResult> => {
  const rowId = (input as Record<string, unknown>).rowId
  const existing: Row =
    action === ToolAction.UPDATE_ROW && typeof rowId === "string"
      ? await sdk.rows.find(tableId, rowId)
      : {}
  const row: Row = { ...existing, ...record }
  const withDefaults: Row = { ...row }
  const table = await sdk.tables.getTable(tableId)
  await processDefaultValues(table, withDefaults)
  return {
    record: withDefaults,
    defaulted: changedFields(row, withDefaults),
    fields: Object.keys(table.schema),
  }
}

const buildConditionRecord = async ({
  input,
  argsKey,
  toolName,
  action,
  sourceId,
  sourceType,
}: {
  input: unknown
  argsKey?: string
  toolName: string
  action?: ToolAction
  sourceId?: string
  sourceType?: ToolType
}): Promise<ConditionRecordResult | undefined> => {
  const record = conditionRecord(input, argsKey)
  const isQuery = isQueryToolType(sourceType)
  const isRowWrite =
    action === ToolAction.CREATE_ROW || action === ToolAction.UPDATE_ROW
  if (!record || !sourceId || (!isQuery && !isRowWrite)) {
    return { record, defaulted: {} }
  }
  try {
    if (isQuery) {
      return await queryConditionRecord({ queryId: sourceId, record })
    }
    return await rowConditionRecord({
      tableId: sourceId,
      action,
      input,
      record,
    })
  } catch (error) {
    console.warn("escalation gate: could not apply defaults for conditions", {
      toolName,
      sourceId,
      error: error instanceof Error ? error.message : String(error),
    })
    return undefined
  }
}

const hasMissingConditionField = ({
  rules,
  fields,
}: {
  rules: ToolExecutionRule[]
  fields: string[]
}) =>
  rules.some(rule =>
    rule.conditions?.some(condition => !fields.includes(condition.field))
  )

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

const unresolvedResult = (label: string) => ({
  status: ApprovalToolResultStatus.UNAVAILABLE,
  note:
    `"${label}" could not be checked against its approval rules. Tell the ` +
    "user this action cannot be run right now.",
})

export const createEscalationGateRuntime = ({
  agentId,
  operation,
  toolName,
  readableName,
  displayName,
  sourceId,
  sourceType,
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
    const condition = await buildConditionRecord({
      input,
      argsKey,
      toolName,
      action,
      sourceId,
      sourceType,
    })
    if (!condition) {
      return unresolvedResult(label)
    }
    const { record, defaulted, fields } = condition
    if (fields && hasMissingConditionField({ rules, fields })) {
      return unresolvedResult(label)
    }
    const rule = matchRule(rules, record)
    if (!rule) {
      return undefined
    }

    const policy = resolvePolicy(operation, rule.policyId)
    if (
      !policy ||
      (!policy.approvers?.length && !policy.notifications?.recipients?.length)
    ) {
      return unavailableResult(label)
    }
    const { notifications, ...policySnapshot } = policy
    if (policySnapshot.approvers) {
      policySnapshot.approvers = Array.from(new Set(policySnapshot.approvers))
    }
    const { recipients } = notifications

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
      input: reviewRecord({ input, argsKey, defaulted }),
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

    const durationMs = await escalationDurationMs(policy.expiry)
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
      ...(durationMs !== undefined && { durationMs }),
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
