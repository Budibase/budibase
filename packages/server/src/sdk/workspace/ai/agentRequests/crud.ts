import { context, docIds } from "@budibase/backend-core"
import type { AgentRequest, AgentRequestEntry } from "@budibase/types"
import { DocumentType } from "@budibase/types"
import { analyzeAgentRequestLink, generateAgentRequestTitle } from "./helpers"

const THREAD_CANDIDATE_LIMIT = 10
const THREAD_LOOKBACK_DAYS = 30

const nowIso = () => new Date().toISOString()

const buildEntry = ({
  sessionId,
  latestPrompt,
}: {
  sessionId: string
  latestPrompt: string
}): AgentRequestEntry => {
  const now = nowIso()
  return {
    entryId: docIds.generateAgentRequestID().split("_").slice(1).join("_"),
    sessionId,
    promptHistory: [latestPrompt],
    interactionCount: 1,
    status: "waiting",
    createdAt: now,
    updatedAt: now,
  }
}

const buildThread = ({
  agentId,
  sessionId,
  userId,
  entry,
}: {
  agentId: string
  sessionId: string
  userId: string
  entry: AgentRequestEntry
}): AgentRequest => {
  const requestId = docIds.generateAgentRequestID()
  return {
    _id: requestId,
    requestId,
    title: undefined,
    agentId,
    userId,
    sessionIds: [sessionId],
    entries: [entry],
    status: entry.status,
    requestCount: 1,
    interactionCount: entry.interactionCount,
    createdAt: entry.createdAt,
    updatedAt: entry.updatedAt,
    latestPromptAt: entry.updatedAt,
    latestCompletedAt: undefined,
    latestSessionId: sessionId,
  }
}

const sortRequests = (requests: AgentRequest[]) =>
  requests.sort((a, b) => {
    const aTime = new Date(
      a.latestPromptAt || a.updatedAt || a.createdAt || 0
    ).getTime()
    const bTime = new Date(
      b.latestPromptAt || b.updatedAt || b.createdAt || 0
    ).getTime()
    return bTime - aTime
  })

export async function fetchThread(
  requestId: string
): Promise<AgentRequest | undefined> {
  return await context.getWorkspaceDB().tryGet<AgentRequest>(requestId)
}

async function saveRequest(request: AgentRequest): Promise<AgentRequest> {
  const response = await context.getWorkspaceDB().put(request)
  return {
    ...request,
    _rev: response.rev,
  }
}

export async function fetchRequests(): Promise<AgentRequest[]> {
  const db = context.getProdWorkspaceDB()
  const response = await db.allDocs<AgentRequest>({
    ...docIds.getDocParams(DocumentType.AGENT_REQUEST, undefined, {
      include_docs: true,
    }),
  })

  return sortRequests(
    response.rows
      .map(row => row.doc)
      .filter((doc): doc is AgentRequest => !!doc)
  )
}

export async function fetchRequestsByAgent(
  agentId: string
): Promise<AgentRequest[]> {
  const requests = await fetchRequests()
  return requests.filter(request => request.agentId === agentId)
}

export async function fetchRequestsByAgentAndUser(
  agentId: string,
  userId: string
): Promise<AgentRequest[]> {
  const requests = await fetchRequestsByAgent(agentId)
  const cutoff = Date.now() - THREAD_LOOKBACK_DAYS * 24 * 60 * 60 * 1000
  return requests
    .filter(request => request.userId === userId)
    .filter(
      request =>
        new Date(request.latestPromptAt || request.updatedAt || 0).getTime() >=
        cutoff
    )
    .slice(0, THREAD_CANDIDATE_LIMIT)
}

export async function createOrUpdateRequestForPrompt({
  agentId,
  sessionId,
  latestPrompt,
  userId,
}: {
  agentId: string
  sessionId: string
  latestPrompt: string
  userId: string
}): Promise<{ request: AgentRequest; created: boolean } | undefined> {
  const prompt = latestPrompt.trim()
  if (!prompt) {
    return undefined
  }

  const candidateRequests = await fetchRequestsByAgentAndUser(agentId, userId)
  const linkDecision = await analyzeAgentRequestLink({
    latestPrompt: prompt,
    candidateRequests,
    agentId,
    sessionId,
  })

  if (linkDecision.decision === "new_thread" || !linkDecision.requestId) {
    return {
      request: await saveRequest(
        buildThread({
          agentId,
          sessionId,
          userId,
          entry: buildEntry({
            sessionId,
            latestPrompt: prompt,
          }),
        })
      ),
      created: true,
    }
  }

  const request = candidateRequests.find(
    candidate => candidate.requestId === linkDecision.requestId
  )
  if (!request) {
    return {
      request: await saveRequest(
        buildThread({
          agentId,
          sessionId,
          userId,
          entry: buildEntry({
            sessionId,
            latestPrompt: prompt,
          }),
        })
      ),
      created: true,
    }
  }

  const now = nowIso()
  const nextSessionIds = request.sessionIds.includes(sessionId)
    ? request.sessionIds
    : [...request.sessionIds, sessionId]

  let nextEntries = [...request.entries]
  if (
    linkDecision.entryAction === "append_latest_entry" &&
    nextEntries.length > 0
  ) {
    const latestEntry = nextEntries[nextEntries.length - 1]
    nextEntries[nextEntries.length - 1] = {
      ...latestEntry,
      sessionId,
      promptHistory: [...latestEntry.promptHistory, prompt],
      interactionCount: latestEntry.interactionCount + 1,
      status: "waiting",
      updatedAt: now,
    }
  } else {
    nextEntries.push(
      buildEntry({
        sessionId,
        latestPrompt: prompt,
      })
    )
  }

  const latestEntry = nextEntries[nextEntries.length - 1]
  return {
    request: await saveRequest({
      ...request,
      sessionIds: nextSessionIds,
      entries: nextEntries,
      status: latestEntry.status,
      requestCount: nextEntries.length,
      interactionCount: nextEntries.reduce(
        (total, entry) => total + entry.interactionCount,
        0
      ),
      updatedAt: now,
      latestPromptAt: latestEntry.updatedAt,
      latestSessionId: sessionId,
    }),
    created: false,
  }
}

export async function markLatestCompletedBySession({
  agentId,
  sessionId,
}: {
  agentId: string
  sessionId: string
}): Promise<AgentRequest | undefined> {
  const requests = await fetchRequestsByAgent(agentId)
  const request = sortRequests(
    requests.filter(candidate => candidate.sessionIds.includes(sessionId))
  )[0]
  if (!request || request.entries.length === 0) {
    return undefined
  }

  const latestIndex = [...request.entries]
    .map((entry, index) => ({ entry, index }))
    .filter(({ entry }) => entry.sessionId === sessionId)
    .sort(
      (a, b) =>
        new Date(b.entry.updatedAt || b.entry.createdAt).getTime() -
        new Date(a.entry.updatedAt || a.entry.createdAt).getTime()
    )[0]?.index

  if (latestIndex == null) {
    return undefined
  }

  const now = nowIso()
  const nextEntries = [...request.entries]
  nextEntries[latestIndex] = {
    ...nextEntries[latestIndex],
    status: "completed",
    updatedAt: now,
  }
  const latestEntry = nextEntries[nextEntries.length - 1]

  return await saveRequest({
    ...request,
    entries: nextEntries,
    status: latestEntry.status,
    updatedAt: now,
    latestCompletedAt: now,
  })
}

export async function generateAndSaveRequestTitle({
  requestId,
  agentId,
  sessionId,
}: {
  requestId: string
  agentId: string
  sessionId: string
}): Promise<AgentRequest | undefined> {
  const request = await fetchThread(requestId)
  if (!request || request.title) {
    return request
  }

  const title = await generateAgentRequestTitle({
    request,
    agentId,
    sessionId,
  })

  return await saveRequest({
    ...request,
    title,
    updatedAt: nowIso(),
  })
}
