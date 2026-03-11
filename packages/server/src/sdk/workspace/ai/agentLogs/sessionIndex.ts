import { context, SQS_DATASOURCE_INTERNAL } from "@budibase/backend-core"
import type {
  AgentLogSessionIndexDoc,
  AgentLogSessionSnapshot,
  Document,
  EnrichedQueryJson,
  SearchFilters,
  Table,
} from "@budibase/types"
import {
  FieldType,
  Operation,
  SortOrder,
  SortType,
  TableSourceType,
} from "@budibase/types"
import * as tableSqs from "../../tables/internal/sqs"
import { AGENT_LOG_SESSION_TABLE_ID } from "../../sqs/staticTables"
import {
  builder,
  DEFAULT_BOOKMARK_PAGE,
  EXPIRED_LIMIT,
  getDateBoundaryISO,
  getSessionDocId,
  maxDate,
  minDate,
  oldestLogDate,
  parseIndexedRequestIds,
} from "./shared"

function agentLogSessionTable(): Table {
  return {
    type: "table",
    sourceType: TableSourceType.INTERNAL,
    name: AGENT_LOG_SESSION_TABLE_ID,
    sourceId: SQS_DATASOURCE_INTERNAL,
    primary: ["_id"],
    schema: {
      firstInput: {
        name: "firstInput",
        type: FieldType.STRING,
      },
      requestIds: {
        name: "requestIds",
        type: FieldType.STRING,
      },
    },
  }
}

async function querySql<T extends Document>(
  request: EnrichedQueryJson,
  table: Table,
  db = context.getWorkspaceDB()
): Promise<T[]> {
  await tableSqs.ensureStaticTables(db)

  const query = builder._query(request)
  if (Array.isArray(query)) {
    throw new Error("Cannot execute multiple queries for agent log search")
  }

  const rows = await db.sql<T>(query.sql, query.bindings)
  return builder.convertJsonStringColumns(
    table,
    rows as Array<T & Record<string, unknown>>
  ) as T[]
}

function buildSessionFilters(
  agentId: string,
  startDate: string,
  endDate: string,
  statusFilter?: string,
  triggerFilter?: string
): SearchFilters {
  const oneOf: NonNullable<SearchFilters["oneOf"]> = {
    agentId: [agentId],
  }
  if (statusFilter && statusFilter !== "all") {
    oneOf.status = [statusFilter]
  }
  if (triggerFilter && triggerFilter !== "all") {
    oneOf.trigger = [triggerFilter]
  }

  return {
    oneOf,
    range: {
      lastActivityAt: {
        low: getDateBoundaryISO(startDate, "start"),
        high: getDateBoundaryISO(endDate, "end"),
      },
    },
  }
}

export async function listSessionIndexDocs({
  agentId,
  startDate,
  endDate,
  limit,
  statusFilter,
  triggerFilter,
  db,
}: {
  agentId: string
  startDate: string
  endDate: string
  limit: number
  statusFilter?: string
  triggerFilter?: string
  db: ReturnType<typeof context.getWorkspaceDB>
}) {
  const sessionTable = agentLogSessionTable()

  return await querySql<AgentLogSessionIndexDoc>(
    {
      operation: Operation.READ,
      table: sessionTable,
      tables: {},
      paginate: {
        page: 1,
        limit,
      },
      filters: buildSessionFilters(
        agentId,
        startDate,
        endDate,
        statusFilter,
        triggerFilter
      ),
      resource: {
        fields: [],
      },
      sort: {
        lastActivityAt: {
          direction: SortOrder.DESCENDING,
          type: SortType.STRING,
        },
      },
    },
    sessionTable,
    db
  )
}

export async function getExpiredSessions(
  db = context.getWorkspaceDB()
): Promise<AgentLogSessionIndexDoc[]> {
  const expiredEnd = await oldestLogDate()
  const sessionTable = agentLogSessionTable()

  return await querySql<AgentLogSessionIndexDoc>(
    {
      operation: Operation.READ,
      table: sessionTable,
      tables: {},
      paginate: {
        page: DEFAULT_BOOKMARK_PAGE,
        limit: EXPIRED_LIMIT,
      },
      filters: {
        range: {
          lastActivityAt: {
            high: expiredEnd,
          },
        },
      },
      resource: {
        fields: [],
      },
      sort: {
        lastActivityAt: {
          direction: SortOrder.ASCENDING,
          type: SortType.STRING,
        },
      },
    },
    sessionTable,
    db
  )
}

export async function clearOldHistory(
  db = context.getWorkspaceDB()
): Promise<void> {
  try {
    const expiredEnd = await oldestLogDate()
    const expiredSessions = await getExpiredSessions(db)
    if (!expiredSessions.length) {
      return
    }

    const docs = await db.getMultiple<AgentLogSessionIndexDoc>(
      expiredSessions.map(session => session._id),
      { allowMissing: true }
    )
    const toDelete = docs
      .filter(
        doc =>
          !!doc?._id &&
          !!doc?._rev &&
          new Date(doc.lastActivityAt).getTime() <=
            new Date(expiredEnd).getTime()
      )
      .map(doc => ({
        _id: doc._id!,
        _rev: doc._rev!,
        _deleted: true,
      }))

    if (!toDelete.length) {
      return
    }

    await db.bulkDocs(toDelete)
  } catch (error) {
    console.log("Failed to cleanup agent log history", error)
  }
}

export async function upsertSessionIndexDoc(
  db: ReturnType<typeof context.getWorkspaceDB>,
  snapshot: AgentLogSessionSnapshot
): Promise<void> {
  const sessionDocId = getSessionDocId(snapshot.agentId, snapshot.sessionId)
  const now = new Date().toISOString()

  for (let attempt = 0; attempt < 3; attempt++) {
    const existing = await db.tryGet<AgentLogSessionIndexDoc>(sessionDocId)
    const requestIds = parseIndexedRequestIds(existing?.requestIds)
    for (const requestId of snapshot.requestIds) {
      requestIds.add(requestId)
    }
    const startTime = existing
      ? minDate(existing.startTime, snapshot.startTime)
      : snapshot.startTime
    const lastActivityAt = existing
      ? maxDate(existing.lastActivityAt, snapshot.endTime || snapshot.startTime)
      : snapshot.endTime || snapshot.startTime
    const status =
      existing?.status === "error" || snapshot.status === "error"
        ? "error"
        : "success"

    const doc: AgentLogSessionIndexDoc = {
      ...(existing ? { _rev: existing._rev } : {}),
      _id: sessionDocId,
      tableId: AGENT_LOG_SESSION_TABLE_ID,
      type: "agent_log_session",
      agentId: snapshot.agentId,
      sessionId: snapshot.sessionId,
      trigger: existing?.trigger || snapshot.trigger,
      isPreview: existing?.isPreview ?? snapshot.isPreview,
      firstInput: existing?.firstInput || snapshot.firstInput,
      startTime,
      lastActivityAt,
      requestIds: JSON.stringify([...requestIds]),
      operations: requestIds.size,
      status,
      createdAt: existing?.createdAt || now,
      updatedAt: now,
    }

    try {
      await db.put(doc)
      return
    } catch (error: any) {
      if (error?.status === 409 && attempt < 2) {
        continue
      }
      throw error
    }
  }
}

export async function getSessionSummary(
  agentId: string,
  sessionId: string,
  db: ReturnType<typeof context.getWorkspaceDB>
) {
  await tableSqs.ensureStaticTables(db)
  return await db.tryGet<AgentLogSessionIndexDoc>(
    getSessionDocId(agentId, sessionId)
  )
}

export { oldestLogDate }
