import type { AgentRequest } from "@budibase/types"

export type ActivityStatusTone =
  | "completed"
  | "processing"
  | "needs-input"
  | "failed"

export const getLatestEntry = (request: AgentRequest) =>
  request.entries[request.entries.length - 1]

export const getRequestTitle = (request: AgentRequest) => {
  if (request.title) {
    return request.title
  }

  const latestEntry = getLatestEntry(request)
  if (!latestEntry) {
    return "Untitled request"
  }

  return (
    latestEntry.promptHistory[0] ||
    latestEntry.promptHistory[latestEntry.promptHistory.length - 1] ||
    "Untitled request"
  )
}

export const getRequestTone = (request: AgentRequest): ActivityStatusTone => {
  if (request.status === "completed") {
    return "completed"
  }
  return "processing"
}

export const getRequestStatusLabel = (request: AgentRequest) =>
  getRequestTone(request) === "completed" ? "Completed" : "Processing"

export const getRequestDisplayId = (request: AgentRequest) =>
  request._id ||
  request.requestId ||
  `${request.agentId}-${request.latestSessionId}`

export const getRequestUpdatedAt = (request: AgentRequest) => {
  const latestEntry = getLatestEntry(request)
  return new Date(
    request.latestPromptAt ||
      latestEntry?.updatedAt ||
      request.updatedAt ||
      request.createdAt ||
      0
  )
}

export const sortRequestsByLatestActivity = (requests: AgentRequest[]) =>
  [...requests].sort((a, b) => {
    const aTime = getRequestUpdatedAt(a).getTime()
    const bTime = getRequestUpdatedAt(b).getTime()
    return bTime - aTime
  })

export const getTriggeredByLabel = (
  request: AgentRequest,
  userNames: Record<string, string>
) => {
  const userName = userNames[request.userId]
  if (userName) {
    return `User: ${userName}`
  }
  return request.userId ? "User" : "Unknown"
}
