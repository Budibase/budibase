import { context } from "@budibase/backend-core"
import type { FetchAgentLogsResponse } from "@budibase/types"
import {
  clampStartDate,
  getMergedSessionLimit,
  normalizeSessionLimit,
  oldestLogDate,
  parseBookmarkPage,
} from "./shared"
import { clearOldHistory, listSessionIndexDocs } from "./sessionIndex"

export async function fetchSessions(
  agentId: string,
  startDate: string,
  endDate: string,
  bookmark?: string,
  limit?: number,
  statusFilter?: string,
  triggerFilter?: string
): Promise<FetchAgentLogsResponse> {
  const page = parseBookmarkPage(bookmark)
  const pageSize = normalizeSessionLimit(limit)
  const pageStart = (page - 1) * pageSize
  const mergedLimit = getMergedSessionLimit(page, pageSize)
  const maxStartDate = await oldestLogDate()
  const clampedStartDate = clampStartDate(startDate, maxStartDate)
  const developmentDb = context.getDevWorkspaceDB()
  const productionDb = context.getProdWorkspaceDB()

  await Promise.all([
    clearOldHistory(developmentDb),
    clearOldHistory(productionDb),
  ])
  const [developmentRows, productionRows] = await Promise.all([
    listSessionIndexDocs({
      agentId,
      startDate: clampedStartDate,
      endDate,
      limit: mergedLimit,
      statusFilter,
      triggerFilter,
      db: developmentDb,
    }),
    listSessionIndexDocs({
      agentId,
      startDate: clampedStartDate,
      endDate,
      limit: mergedLimit,
      statusFilter,
      triggerFilter,
      db: productionDb,
    }),
  ])

  const rows = [
    ...developmentRows.map(session => ({
      session,
      environment: "development" as const,
    })),
    ...productionRows.map(session => ({
      session,
      environment: "production" as const,
    })),
  ]
    .sort((a, b) => {
      const aTime = new Date(a.session.lastActivityAt || 0).getTime()
      const bTime = new Date(b.session.lastActivityAt || 0).getTime()
      return bTime - aTime
    })
    .filter(
      (item, index, items) =>
        items.findIndex(
          other =>
            other.environment === item.environment &&
            other.session.sessionId === item.session.sessionId
        ) === index
    )

  const pagedRows = rows.slice(pageStart, pageStart + pageSize + 1)
  const hasMore = pagedRows.length > pageSize
  if (hasMore) {
    pagedRows.pop()
  }

  return {
    sessions: pagedRows.map(({ session, environment }) => ({
      sessionId: session.sessionId,
      environment,
      firstInput: session.firstInput || "",
      trigger: session.trigger,
      isPreview: !!session.isPreview,
      startTime: session.startTime,
      operations: session.operations || 0,
      status: session.status,
      entries: [],
    })),
    hasMore,
    nextBookmark: hasMore ? String(page + 1) : undefined,
  }
}
