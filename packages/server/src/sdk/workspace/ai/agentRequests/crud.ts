import { context, docIds } from "@budibase/backend-core"
import type {
  AgentRequest,
  AgentRequestEntry,
  AgentRequestPromptHistoryItem,
} from "@budibase/types"
import { DocumentType } from "@budibase/types"
import { analyzeAgentRequestLink, generateAgentRequestTitle } from "./helpers"

const THREAD_CANDIDATE_LIMIT = 10
const THREAD_LOOKBACK_DAYS = 30

const nowIso = () => new Date().toISOString()

const buildEntry = ({
  sessionId,
  latestPrompt,
  operation,
  source,
}: {
  sessionId: string
  latestPrompt: string
  operation?: {
    name: string
    prompt: string
  }
  source: string
}): AgentRequestEntry => {
  const promptHistoryItem: AgentRequestPromptHistoryItem = {
    message: latestPrompt,
    date: nowIso(),
    ...(operation
      ? {
          operations: [
            {
              name: operation.name,
              prompt: operation.prompt,
            },
          ],
        }
      : {}),
  }

  return {
    sessionId,
    source,
    promptHistory: [promptHistoryItem],
    status: "completed",
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
    status: entry.status,
  }
}

const getLatestPromptHistoryItem = (request: AgentRequest) => {
  const latestEntry = request.entries[request.entries.length - 1]
  if (!latestEntry) {
    return undefined
  }

  return latestEntry.promptHistory[latestEntry.promptHistory.length - 1]
}

const sortRequests = (requests: AgentRequest[]) =>
  requests.sort((a, b) => {
    const aTime = new Date(getLatestPromptHistoryItem(a)?.date || 0).getTime()
    const bTime = new Date(getLatestPromptHistoryItem(b)?.date || 0).getTime()
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

async function maybeGenerateAndSaveRequestTitle({
  request,
  agentId,
  sessionId,
  operation,
}: {
  request: AgentRequest
  agentId: string
  sessionId: string
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
      request,
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
        latestPrompt,
        operation,
        source,
      }),
    })
  )

  return await maybeGenerateAndSaveRequestTitle({
    request: createdRequest,
    agentId,
    sessionId,
    operation,
  })
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
        new Date(getLatestPromptHistoryItem(request)?.date || 0).getTime() >=
        cutoff
    )
    .slice(0, THREAD_CANDIDATE_LIMIT)
}

export async function createOrUpdateRequestForPrompt({
  agentId,
  sessionId,
  latestUserPrompt,
  operation,
  source,
  userId,
}: {
  agentId: string
  sessionId: string
  latestUserPrompt: string
  operation?: {
    name: string
    prompt: string
  }
  source: string
  userId: string
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

  const candidateRequests = await fetchRequestsByAgentAndUser(agentId, userId)
  const linkDecision = await analyzeAgentRequestLink({
    latestPrompt: prompt,
    candidateRequests,
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

  const request = candidateRequests.find(
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

  let nextEntries = [...request.entries]
  if (
    linkDecision.entryAction === "append_latest_entry" &&
    nextEntries.length > 0
  ) {
    const latestEntry = nextEntries[nextEntries.length - 1]
    const nextPromptHistoryItem: AgentRequestPromptHistoryItem = {
      message: prompt,
      date: nowIso(),
      ...(resolvedOperation
        ? {
            operations: [
              {
                name: resolvedOperation.name,
                prompt: resolvedOperation.prompt,
              },
            ],
          }
        : {}),
    }
    nextEntries[nextEntries.length - 1] = {
      ...latestEntry,
      sessionId,
      source: resolvedSource,
      promptHistory: [...latestEntry.promptHistory, nextPromptHistoryItem],
      status: "completed",
    }
  } else {
    nextEntries.push(
      buildEntry({
        sessionId,
        latestPrompt: prompt,
        source: resolvedSource,
        operation: resolvedOperation,
      })
    )
  }

  return {
    request: await saveRequest({
      ...request,
      entries: nextEntries,
      status: "completed",
    }),
    created: false,
  }
}
