import {
  context,
  db as dbCore,
  docIds,
  Duration,
  utils,
} from "@budibase/backend-core"
import type {
  AgentRequest,
  AgentRequestAction,
  AgentRequestEntry,
  AgentRequestsSummary,
  AgentRequestStatus,
  StatusChangedAction,
  UserMessageAction,
  ToolCallAction,
} from "@budibase/types"
import { builderSocket } from "../../../../websockets"
import {
  analyzeAgentRequestLink,
  generateAgentRequestTitle,
  generateInteractionSummary,
  generateToolCallSummary,
} from "./helpers"
import {
  queryRequestsByAgent,
  queryRequestStatuses,
  queryRequestsByUpdatedAt,
  queryRequestsByStatusAndUpdatedAt,
} from "./views"

const THREAD_CANDIDATE_LIMIT = 10
const THREAD_LOOKBACK_DAYS = 30

const nowIso = () => new Date().toISOString()

const buildEntry = ({
  sessionId,
  operation,
  source,
}: {
  sessionId: string
  operation?: {
    name: string
    prompt: string
  }
  source: string
}): AgentRequestEntry => {
  const timestamp = nowIso()

  return {
    sessionId,
    source,
    operationNames: operation?.name ? [operation.name] : [],
    createdAt: timestamp,
    updatedAt: timestamp,
    status: "active",
  }
}

const buildThread = ({
  agentId,
  userId,
  entry,
  actions = [],
}: {
  agentId: string
  userId: string
  entry: AgentRequestEntry
  actions?: AgentRequestAction[]
}): AgentRequest => {
  return {
    _id: docIds.generateAgentRequestID(),
    title: undefined,
    agentId,
    userId,
    entries: [entry],
    actions,
    createdAt: entry.createdAt,
    updatedAt: entry.updatedAt,
    status: entry.status,
  }
}

const buildFallbackUserMessageAction = (
  sessionId: string
): UserMessageAction => ({
  id: utils.newid(),
  timestamp: nowIso(),
  sessionId,
  type: "user_message",
  summary: "User sent a message",
})

async function buildUserMessageActionForTurn({
  agentId,
  sessionId,
  latestPrompt,
}: {
  agentId: string
  sessionId: string
  latestPrompt: string
}): Promise<UserMessageAction> {
  try {
    const summary = await generateInteractionSummary({
      latestPrompt,
      agentId,
      sessionId,
    })
    return {
      id: utils.newid(),
      timestamp: nowIso(),
      sessionId,
      type: "user_message",
      summary,
    }
  } catch (error) {
    console.error("Failed to generate agent request interaction summary", {
      agentId,
      sessionId,
      error,
    })
    return buildFallbackUserMessageAction(sessionId)
  }
}

// Upgrades the fallback summary in place once the LLM responds, without blocking the first save.
async function refineUserMessageActionSummary({
  request,
  actionId,
  agentId,
  sessionId,
  latestPrompt,
}: {
  request: AgentRequest
  actionId: string
  agentId: string
  sessionId: string
  latestPrompt: string
}): Promise<AgentRequest> {
  let summary: string
  try {
    summary = await generateInteractionSummary({
      latestPrompt,
      agentId,
      sessionId,
    })
  } catch (error) {
    console.error("Failed to generate agent request interaction summary", {
      agentId,
      sessionId,
      error,
    })
    return request
  }

  const latest = await context
    .getWorkspaceDB()
    .tryGet<AgentRequest>(request._id!)
  if (!latest) {
    return request
  }

  try {
    return await saveRequest({
      ...latest,
      actions: (latest.actions ?? []).map(action =>
        action.id === actionId && action.type === "user_message"
          ? { ...action, summary }
          : action
      ),
    })
  } catch (err) {
    // Best-effort upgrade - a concurrent writer (e.g. updateRequestStatus)
    // winning the race is an expected outcome, not a failure of this flow.
    if (dbCore.isDocumentConflictError(err)) {
      return latest
    }
    throw err
  }
}

const isTerminalStatus = (status: AgentRequestStatus) =>
  status === "completed" || status === "failed"

const sortRequests = (requests: AgentRequest[]) =>
  requests.sort(
    (a, b) =>
      new Date(b.updatedAt || 0).getTime() -
      new Date(a.updatedAt || 0).getTime()
  )

async function saveRequest(request: AgentRequest): Promise<AgentRequest> {
  const response = await context.getWorkspaceDB().put(request)
  const saved = {
    ...request,
    _rev: response.rev,
  }

  const workspaceId = context.getWorkspaceId()
  if (workspaceId) {
    builderSocket?.emitAgentRequestChange(context.getDevWorkspaceId(), saved)
  }

  return saved
}

// Plain Omit<T, K> isn't distributive over a union - it collapses to the
// properties common to every member, dropping variant-specific fields like
// ToolCallAction.toolName. Distributing over each member first preserves them.
type DistributiveOmit<T, K extends PropertyKey> = T extends unknown
  ? Omit<T, K>
  : never

// Appends a single action to a request that isn't already loaded in memory
// (unlike updateRequestStatus/createOrUpdateRequestForPrompt, callers here -
// e.g. agentRuntime's onStepFinish - only have a requestId). get + put isn't
// atomic, so retry on conflict since several tool calls can resolve in quick
// succession.
async function appendAction(
  requestId: string,
  action: DistributiveOmit<AgentRequestAction, "id" | "timestamp">
): Promise<void> {
  const db = context.getWorkspaceDB()

  for (let attempt = 0; attempt < 3; attempt++) {
    const request = await db.tryGet<AgentRequest>(requestId)
    if (!request) {
      return
    }

    const fullAction = {
      ...action,
      id: utils.newid(),
      timestamp: nowIso(),
    } as AgentRequestAction

    try {
      await saveRequest({
        ...request,
        actions: [...(request.actions ?? []), fullAction],
        updatedAt: fullAction.timestamp,
      })
      return
    } catch (err) {
      if (dbCore.isDocumentConflictError(err) && attempt < 2) {
        continue
      }
      throw err
    }
  }
}

export async function recordToolCall({
  requestId,
  agentId,
  sessionId,
  toolName,
  status,
  readableName,
  input,
  output,
}: {
  requestId: string
  agentId: string
  sessionId: string
  toolName: string
  status: ToolCallAction["status"]
  readableName?: string
  input?: unknown
  output?: unknown
}): Promise<void> {
  let summary: string | undefined
  try {
    summary = await generateToolCallSummary({
      toolName,
      readableName,
      status,
      input,
      output,
      agentId,
      sessionId,
    })
  } catch (error) {
    console.error("Failed to generate agent request tool call summary", {
      agentId,
      sessionId,
      toolName,
      error,
    })
  }

  await appendAction(requestId, {
    type: "tool_call",
    toolName,
    status,
    sessionId,
    ...(readableName === undefined ? {} : { readableName }),
    ...(summary === undefined ? {} : { summary }),
  })
}

async function generateAndSaveRequestTitleIfMissing({
  request,
  agentId,
  sessionId,
  latestPrompt,
  operation,
}: {
  request: AgentRequest
  agentId: string
  sessionId: string
  latestPrompt: string
  operation?: {
    name: string
    prompt: string
  }
}): Promise<AgentRequest> {
  if (request.title) {
    return request
  }

  try {
    const title = await generateAgentRequestTitle({
      latestPrompt,
      agentId,
      sessionId,
      operation,
    })

    return await saveRequest({
      ...request,
      title,
    })
  } catch (error) {
    console.error("Failed to generate agent request title", {
      agentId,
      sessionId,
      requestId: request._id,
      error,
    })
    return request
  }
}

async function createNewRequest({
  agentId,
  sessionId,
  latestPrompt,
  operation,
  source,
  userId,
}: {
  agentId: string
  sessionId: string
  latestPrompt: string
  operation?: {
    name: string
    prompt: string
  }
  source: string
  userId: string
}): Promise<AgentRequest | undefined> {
  if (!operation?.name) {
    return undefined
  }

  const fallbackAction = buildFallbackUserMessageAction(sessionId)

  const createdRequest = await saveRequest(
    buildThread({
      agentId,
      userId,
      entry: buildEntry({
        sessionId,
        operation,
        source,
      }),
      actions: [fallbackAction],
    })
  )

  const withSummary = await refineUserMessageActionSummary({
    request: createdRequest,
    actionId: fallbackAction.id,
    agentId,
    sessionId,
    latestPrompt,
  })

  return await generateAndSaveRequestTitleIfMissing({
    request: withSummary,
    agentId,
    sessionId,
    latestPrompt,
    operation,
  })
}

export async function fetchRequests({
  limit,
  page,
  status,
}: {
  limit: number
  page: number
  status?: AgentRequestStatus
}): Promise<AgentRequest[]> {
  if (status) {
    return await queryRequestsByStatusAndUpdatedAt({ status, limit, page })
  }

  return await queryRequestsByUpdatedAt({
    limit,
    page,
  })
}

export async function fetchRequestsSummary(): Promise<AgentRequestsSummary> {
  const statuses = await queryRequestStatuses()
  return {
    total: statuses.length,
    active: statuses.filter(status => status === "active").length,
    needs_input: statuses.filter(status => status === "needs_input").length,
    completed: statuses.filter(status => status === "completed").length,
    failed: statuses.filter(status => status === "failed").length,
  }
}

export async function fetchRequestsByAgent(
  agentId: string
): Promise<AgentRequest[]> {
  return sortRequests(await queryRequestsByAgent(agentId))
}

export function resolveFinalRequestStatus({
  toolCallsIncomplete,
  unrecoveredToolFailures,
}: {
  toolCallsIncomplete: boolean
  unrecoveredToolFailures: Set<string>
}): { status: "completed" | "failed"; error?: string } {
  if (toolCallsIncomplete) {
    return { status: "failed", error: "Tool calls incomplete" }
  }
  if (unrecoveredToolFailures.size > 0) {
    return {
      status: "failed",
      error: `Tool call(s) failed: ${[...unrecoveredToolFailures].join(", ")}`,
    }
  }
  return { status: "completed" }
}

export async function fetchRequestsByAgentAndUser(
  agentId: string,
  userId: string
): Promise<AgentRequest[]> {
  const requests = await fetchRequestsByAgent(agentId)
  const cutoff = Date.now() - THREAD_LOOKBACK_DAYS * Duration.fromDays(1).toMs()

  return requests
    .filter(request => request.userId === userId)
    .filter(request => new Date(request.updatedAt || 0).getTime() >= cutoff)
    .slice(0, THREAD_CANDIDATE_LIMIT)
}

export async function initActiveRequest({
  agentId,
  userId,
  sessionId,
  latestPrompt,
  operation,
  source,
}: {
  agentId: string
  userId: string
  sessionId: string
  latestPrompt: string
  operation?: {
    name: string
    prompt: string
  }
  source: string
}): Promise<{ requestId: string } | undefined> {
  if (!operation?.name) {
    return undefined
  }

  const candidates = await fetchRequestsByAgentAndUser(agentId, userId)
  const existing = candidates.find(
    r =>
      !isTerminalStatus(r.status) &&
      r.entries.some(e => e.sessionId === sessionId)
  )
  if (existing && existing._id) {
    return { requestId: existing._id }
  }

  const entry = buildEntry({ sessionId, operation, source })
  const thread = buildThread({ agentId, userId, entry })

  let title: string | undefined
  try {
    title = await generateAgentRequestTitle({
      latestPrompt,
      agentId,
      sessionId,
      operation,
    })
  } catch (error) {
    console.error("Failed to generate agent request title", {
      agentId,
      sessionId,
      error,
    })
  }

  const created = await saveRequest({ ...thread, title })
  return { requestId: created._id! }
}

export async function updateRequestStatus({
  requestId,
  status,
  error,
  isHumanResponse = false,
}: {
  requestId: string
  status: AgentRequestStatus
  error?: string
  // needs_input is only meant to move once a human has actually responded to
  // the escalation (approved/rejected/expired) - set this when that's the
  // case. Anything else touching a needs_input request (a later turn in the
  // same conversation, an unrelated error) must leave it as-is.
  isHumanResponse?: boolean
}): Promise<void> {
  const db = context.getWorkspaceDB()

  // Retries on conflict since createOrUpdateRequestForPrompt writes to the same document concurrently.
  for (let attempt = 0; attempt < 3; attempt++) {
    const request = await db.tryGet<AgentRequest>(requestId)
    if (!request) {
      return
    }

    if (isTerminalStatus(request.status)) {
      return
    }

    if (
      request.status === "needs_input" &&
      status !== "needs_input" &&
      !isHumanResponse
    ) {
      return
    }

    // Defensive re-entry (e.g. two escalate tool calls in the same turn)
    // nothing actually changed, so there's nothing to record or save.
    if (request.status === status) {
      return
    }

    const timestamp = nowIso()
    const isTerminal = isTerminalStatus(status)

    const statusChangedAction: StatusChangedAction = {
      id: utils.newid(),
      timestamp,
      type: "status_changed",
      from: request.status,
      to: status,
      ...(error === undefined ? {} : { error }),
    }

    const updatedEntries = request.entries.map((entry, idx) => {
      if (idx !== request.entries.length - 1) {
        return entry
      }
      return {
        ...entry,
        status,
        updatedAt: timestamp,
        ...(isTerminal ? { completedAt: timestamp } : {}),
        ...(error === undefined ? {} : { error }),
      }
    })

    try {
      await saveRequest({
        ...request,
        entries: updatedEntries,
        actions: [...(request.actions ?? []), statusChangedAction],
        status,
        updatedAt: timestamp,
        ...(isTerminal ? { completedAt: timestamp } : {}),
        ...(error !== undefined ? { error } : {}),
      })
      return
    } catch (err) {
      if (dbCore.isDocumentConflictError(err) && attempt < 2) {
        continue
      }
      throw err
    }
  }
}

export async function createOrUpdateRequestForPrompt({
  agentId,
  sessionId,
  latestUserPrompt,
  recentChatContext,
  operation,
  source,
  userId,
  existingRequestId,
}: {
  agentId: string
  sessionId: string
  latestUserPrompt: string
  recentChatContext?: Array<{
    role: "user" | "assistant"
    content: string
  }>
  operation?: {
    name: string
    prompt: string
  }
  source: string
  userId: string
  existingRequestId?: string
}): Promise<{ request: AgentRequest; created: boolean } | undefined> {
  const prompt = latestUserPrompt.trim()
  const resolvedOperation = operation
    ? {
        name: operation.name.trim(),
        prompt: operation.prompt.trim(),
      }
    : undefined
  const resolvedSource = source?.trim()
  if (!prompt || !resolvedSource) {
    return undefined
  }

  if (existingRequestId) {
    const existing = await context
      .getWorkspaceDB()
      .tryGet<AgentRequest>(existingRequestId)
    if (existing) {
      if (isTerminalStatus(existing.status)) {
        return { request: existing, created: false }
      }
      const withTitle = await generateAndSaveRequestTitleIfMissing({
        request: existing,
        agentId,
        sessionId,
        latestPrompt: prompt,
        operation: resolvedOperation,
      })
      const userMessageAction = await buildUserMessageActionForTurn({
        agentId,
        sessionId,
        latestPrompt: prompt,
      })

      // Re-read before writing - the status may have changed while we awaited the LLM calls above.
      const latest = await context
        .getWorkspaceDB()
        .tryGet<AgentRequest>(existingRequestId)
      if (!latest || isTerminalStatus(latest.status)) {
        return { request: latest ?? withTitle, created: false }
      }

      const updated = await saveRequest({
        ...latest,
        title: latest.title ?? withTitle.title,
        actions: [...(latest.actions ?? []), userMessageAction],
      })
      return { request: updated, created: false }
    }

    console.error("existingRequestId did not resolve to a request", {
      agentId,
      sessionId,
      existingRequestId,
    })
  }

  const candidateRequests = await fetchRequestsByAgentAndUser(agentId, userId)
  const activeCandidates = candidateRequests.filter(
    r => !isTerminalStatus(r.status)
  )
  const linkDecision = await analyzeAgentRequestLink({
    latestPrompt: prompt,
    candidateRequests: activeCandidates,
    recentChatContext,
    agentId,
    sessionId,
  })

  if (linkDecision.decision === "new_thread" || !linkDecision.requestId) {
    const createdRequest = await createNewRequest({
      agentId,
      sessionId,
      latestPrompt: prompt,
      operation: resolvedOperation,
      source: resolvedSource,
      userId,
    })
    if (!createdRequest) {
      return undefined
    }

    return {
      request: createdRequest,
      created: true,
    }
  }

  const request = activeCandidates.find(
    candidate => candidate._id === linkDecision.requestId
  )
  if (!request) {
    const createdRequest = await createNewRequest({
      agentId,
      sessionId,
      latestPrompt: prompt,
      operation: resolvedOperation,
      source: resolvedSource,
      userId,
    })
    if (!createdRequest) {
      return undefined
    }

    return {
      request: createdRequest,
      created: true,
    }
  }

  const timestamp = nowIso()
  let nextEntries = [...request.entries]
  if (
    linkDecision.entryAction === "append_latest_entry" &&
    nextEntries.length > 0
  ) {
    const latestEntry = nextEntries[nextEntries.length - 1]
    const operationNames = new Set(latestEntry.operationNames)
    if (resolvedOperation?.name) {
      operationNames.add(resolvedOperation.name)
    }

    nextEntries[nextEntries.length - 1] = {
      ...latestEntry,
      sessionId,
      source: resolvedSource,
      operationNames: [...operationNames],
      updatedAt: timestamp,
      status: "active",
    }
  } else {
    nextEntries.push(
      buildEntry({
        sessionId,
        source: resolvedSource,
        operation: resolvedOperation,
      })
    )
  }

  const userMessageAction = await buildUserMessageActionForTurn({
    agentId,
    sessionId,
    latestPrompt: prompt,
  })

  // Re-read before writing - the status may have changed while we awaited the LLM calls above.
  const latestRequest = await context
    .getWorkspaceDB()
    .tryGet<AgentRequest>(request._id!)
  if (!latestRequest || isTerminalStatus(latestRequest.status)) {
    return { request: latestRequest ?? request, created: false }
  }

  return {
    request: await saveRequest({
      ...latestRequest,
      entries: nextEntries,
      actions: [...(latestRequest.actions ?? []), userMessageAction],
      updatedAt: timestamp,
      // Linking a follow-up prompt into this thread isn't a response to the
      // escalation. Leave needs_input as-is rather than reviving it.
      status: latestRequest.status === "needs_input" ? "needs_input" : "active",
    }),
    created: false,
  }
}
