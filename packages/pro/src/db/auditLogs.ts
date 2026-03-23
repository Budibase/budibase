import {
  context,
  db as dbCore,
  DocumentType,
  logging,
  SEPARATOR,
  sql,
  utils,
} from "@budibase/backend-core"
import {
  AUDIT_LOG_TYPE,
  AuditLogDoc,
  AuditLogSearchParams,
  Operation,
  SearchFilters,
  SortType,
  SqlClient,
  SortOrder,
  SearchResponse,
  EnrichedQueryJson,
} from "@budibase/types"
import { Readable } from "stream"
import { GENERIC_PAGE_SIZE, auditLogs } from "../constants"
import { createAuditLogDesignDocSQL } from "./views"

const MemoryStream = require("memorystream")

const builder = new sql.Sql(SqlClient.SQL_LITE)

async function getAuditLogSqlQuery(
  filters: SearchFilters,
  bookmark: number,
  limit?: number
) {
  const request: EnrichedQueryJson = {
    operation: Operation.READ,
    table: auditLogs.searchTable(),
    tables: {},
    paginate: {
      limit: limit || GENERIC_PAGE_SIZE,
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
    throw new Error("Cannot execute multiple queries for audit log search")
  }
  return { sql: query.sql, bindings: query.bindings }
}

function generateAuditLogID(timestamp: string) {
  return `${
    DocumentType.AUDIT_LOG
  }${SEPARATOR}${timestamp}${SEPARATOR}${utils.newid()}`
}

export async function save(doc: AuditLogDoc) {
  if (!doc._id) {
    doc._id = generateAuditLogID(doc.timestamp)
  }
  if (!doc.type) {
    doc.type = AUDIT_LOG_TYPE
  }
  try {
    const db = context.getAuditLogsDB()
    const response = await db.put(doc)
    return {
      ...doc,
      _rev: response.rev,
    }
  } catch (err: any) {
    logging.logAlert("Failed to write audit log", err)
  }
}

// new search method using SQL
export async function searchSQL(
  filters: SearchFilters,
  bookmark?: number,
  opts?: { isRetry?: boolean }
): Promise<SearchResponse<AuditLogDoc>> {
  if (!bookmark) {
    bookmark = 1
  }

  const db = context.getAuditLogsDB()
  try {
    // +1 for pagination - try to get next row
    const limit = GENERIC_PAGE_SIZE + 1
    const mainQuery = await getAuditLogSqlQuery(filters, bookmark, limit)
    const table = auditLogs.searchTable()
    const rows = builder.convertJsonStringColumns<AuditLogDoc>(
      table,
      await db.sql<AuditLogDoc>(mainQuery.sql, mainQuery.bindings)
    )
    let nextRow: AuditLogDoc | undefined
    if (rows.length > limit) {
      nextRow = rows.pop()
    }
    const response: SearchResponse<AuditLogDoc> = {
      rows,
      hasNextPage: !!nextRow,
    }
    if (response.hasNextPage) {
      response.bookmark = bookmark + 1
    }
    return response
  } catch (err: any) {
    if (err.status === 404 && !opts?.isRetry) {
      await migrate()
      await createAuditLogDesignDocSQL()
      return await searchSQL(filters, bookmark, { isRetry: true })
    } else {
      throw err
    }
  }
}

export async function migrate() {
  const db = context.getAuditLogsDB()
  const auditLogs = (
    await db.allDocs<AuditLogDoc>(
      dbCore.getDocParams(DocumentType.AUDIT_LOG, null, {
        include_docs: true,
      })
    )
  ).rows.map(row => row.doc)

  const updatedLogs = auditLogs
    .filter(auditLog => auditLog && !auditLog.type)
    .map(auditLog => ({
      ...auditLog,
      type: AUDIT_LOG_TYPE,
    }))

  await db.bulkDocs(updatedLogs)
}

export function dump(params: AuditLogSearchParams): {
  promise: Promise<void>
  stream: Readable
} {
  const db = context.getAuditLogsDB()
  const stream = new MemoryStream()
  // dump the database, re-creating what the lucene filter looks for
  const promise = db.dump(stream, {
    filter: doc => {
      const auditLog = doc as AuditLogDoc
      if (!auditLog._id?.startsWith(DocumentType.AUDIT_LOG)) {
        return false
      }
      // do this as an AND like operation
      let allMatched = true
      const matcher = (
        param: string[] | undefined,
        value: string | undefined
      ) => {
        if (!param || param.length === 0) {
          return
        }
        allMatched = !!(allMatched && value && param.includes(value))
      }
      matcher(params.userIds, auditLog.userId)
      matcher(params.appIds, auditLog.appId)
      matcher(params.events, auditLog.event)
      // they should have both been filled if one was filled
      if (params.startDate || params.endDate) {
        allMatched =
          allMatched &&
          auditLog.timestamp >= params.startDate! &&
          auditLog.timestamp <= params.endDate!
      }
      // this can't be quite the same as the whitespace search, but good enough
      if (params.fullSearch) {
        const json = JSON.stringify(doc)
        allMatched = allMatched && json.includes(params.fullSearch)
      }
      return allMatched
    },
  })
  const returnStream = new MemoryStream()
  // need to run the original stream through a transform to get to the newline
  // delimited JSON structure required
  stream.on("data", (data: any) => {
    const json = JSON.parse(Buffer.from(data).toString())
    if (Array.isArray(json.docs)) {
      let str = ""
      for (let doc of json.docs) {
        str += JSON.stringify(doc) + "\n"
      }
      returnStream.write(str)
    }
  })
  stream.on("end", () => {
    returnStream.end()
  })
  return { promise, stream: returnStream }
}
