import { context, docIds, Duration } from "@budibase/backend-core"
import type {
  AgentRequest,
  AgentRequestEntry,
  AgentRequestStatus,
} from "@budibase/types"
import { analyzeAgentRequestLink, generateAgentRequestTitle } from "./helpers"
import { queryRequestsByAgent, queryRequestsByUpdatedAt } from "./views"

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
}: {
  agentId: string
  userId: string
  entry: AgentRequestEntry
}): AgentRequest => {
  return {
    _id: docIds.generateAgentRequestID(),
    title: undefined,
    agentId,
    userId,
    entries: [entry],
    createdAt: entry.createdAt,
    updatedAt: entry.updatedAt,
    status: entry.status,
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
  return {
    ...request,
    _rev: response.rev,
  }
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

  const createdRequest = await saveRequest(
    buildThread({
      agentId,
      userId,
      entry: buildEntry({
        sessionId,
        operation,
        source,
      }),
    })
  )

  return await generateAndSaveRequestTitleIfMissing({
    request: createdRequest,
    agentId,
    sessionId,
    latestPrompt,
    operation,
  })
}

export async function fetchRequests({
  limit,
  page,
}: {
  limit: number
  page: number
}): Promise<AgentRequest[]> {
  return await queryRequestsByUpdatedAt({
    limit,
    page,
  })
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
  const request = await context.getWorkspaceDB().tryGet<AgentRequest>(requestId)
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

  const timestamp = nowIso()
  const isTerminal = status === "completed" || status === "failed"

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

  await saveRequest({
    ...request,
    entries: updatedEntries,
    status,
    updatedAt: timestamp,
    ...(isTerminal ? { completedAt: timestamp } : {}),
    ...(error !== undefined ? { error } : {}),
  })
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
      const updated = await generateAndSaveRequestTitleIfMissing({
        request: existing,
        agentId,
        sessionId,
        latestPrompt: prompt,
        operation: resolvedOperation,
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

  return {
    request: await saveRequest({
      ...request,
      entries: nextEntries,
      updatedAt: timestamp,
      // Linking a follow-up prompt into this thread isn't a response to the
      // escalation. Leave needs_input as-is rather than reviving it.
      status: request.status === "needs_input" ? "needs_input" : "active",
    }),
    created: false,
  }
}
