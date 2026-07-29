import {
  context,
  DocumentType,
  logging,
  SEPARATOR,
  sql,
} from "@budibase/backend-core"
import {
  AGENT_CONVERSATION_LOG_TYPE,
  AgentConversationLogDoc,
  EnrichedQueryJson,
  Operation,
  SearchFilters,
  SearchResponse,
  SortOrder,
  SortType,
  SqlClient,
} from "@budibase/types"
import { GENERIC_PAGE_SIZE, agentConversationLogs } from "../constants"
import { createAgentConversationLogDesignDocSQL } from "./views"

const builder = new sql.Sql(SqlClient.SQL_LITE)
const MAX_SEARCH_ROWS = 5000

function getStatusCode(err: unknown) {
  if (typeof err === "object" && err && "status" in err) {
    return typeof err.status === "number" ? err.status : undefined
  }
}

async function getSqlQuery(
  filters: SearchFilters,
  bookmark: number,
  limit: number
) {
  const request: EnrichedQueryJson = {
    operation: Operation.READ,
    table: agentConversationLogs.searchTable(),
    tables: {},
    paginate: {
      limit,
      page: bookmark,
    },
    filters,
    resource: {
      fields: [],
    },
    sort: {
      timestamp: {
        direction: SortOrder.DESCENDING,
        type: SortType.STRING,
      },
    },
  }
  const query = builder._query(request)
  if (Array.isArray(query)) {
    throw new Error("Cannot execute multiple queries for agent log search")
  }
  return { sql: query.sql, bindings: query.bindings }
}

export function generateLogID(
  conversationId: string,
  messageId: string,
  entryId: string
) {
  return [
    DocumentType.AGENT_CONVERSATION_LOG,
    encodeURIComponent(conversationId),
    encodeURIComponent(messageId),
    encodeURIComponent(entryId),
  ].join(SEPARATOR)
}

export async function save(doc: AgentConversationLogDoc) {
  if (!doc._id) {
    doc._id = generateLogID(doc.conversationId, doc.messageId, doc.entryId)
  }
  if (!doc.type) {
    doc.type = AGENT_CONVERSATION_LOG_TYPE
  }
  try {
    const db = context.getAgentConversationLogsDB()
    const response = await db.put(doc)
    return {
      ...doc,
      _rev: response.rev,
    }
  } catch (err) {
    if (getStatusCode(err) !== 409) {
      logging.logAlert("Failed to write agent conversation log", err)
    }
  }
}

export async function searchSQL(
  filters: SearchFilters,
  bookmark?: number,
  limit = GENERIC_PAGE_SIZE,
  opts?: { isRetry?: boolean }
): Promise<SearchResponse<AgentConversationLogDoc>> {
  if (!bookmark) {
    bookmark = 1
  }

  const db = context.getAgentConversationLogsDB()
  try {
    const pageLimit = limit + 1
    const mainQuery = await getSqlQuery(filters, bookmark, pageLimit)
    const table = agentConversationLogs.searchTable()
    const rows = builder.convertJsonStringColumns<AgentConversationLogDoc>(
      table,
      await db.sql<AgentConversationLogDoc>(mainQuery.sql, mainQuery.bindings)
    )
    let nextRow: AgentConversationLogDoc | undefined
    if (rows.length > limit) {
      nextRow = rows.pop()
    }
    const response: SearchResponse<AgentConversationLogDoc> = {
      rows,
      hasNextPage: !!nextRow,
    }
    if (response.hasNextPage) {
      response.bookmark = bookmark + 1
    }
    return response
  } catch (err) {
    if (getStatusCode(err) === 404 && !opts?.isRetry) {
      await createAgentConversationLogDesignDocSQL()
      return await searchSQL(filters, bookmark, limit, { isRetry: true })
    } else {
      throw err
    }
  }
}

export async function searchAll(filters: SearchFilters) {
  let bookmark = 1
  let rows: AgentConversationLogDoc[] = []
  while (rows.length < MAX_SEARCH_ROWS) {
    const response = await searchSQL(filters, bookmark, GENERIC_PAGE_SIZE)
    rows = rows.concat(response.rows)
    if (!response.hasNextPage || !response.bookmark) {
      break
    }
    bookmark = Number(response.bookmark)
  }
  return rows
}
