import {
  AGENT_CONVERSATION_LOG_TYPE,
  AUDIT_LOG_TYPE,
  PreSaveSQLiteDefinition,
  SQLiteType,
} from "@budibase/types"
import { context, sql, SQLITE_DESIGN_DOC_ID } from "@budibase/backend-core"

export async function createAuditLogDesignDocSQL() {
  const base = sql.designDoc.base("type")
  base.sql.tables = {
    [AUDIT_LOG_TYPE]: {
      fields: {
        appId: SQLiteType.TEXT,
        event: SQLiteType.TEXT,
        userId: SQLiteType.TEXT,
        timestamp: SQLiteType.TEXT,
        metadata: SQLiteType.TEXT,
        name: SQLiteType.TEXT,
        type: SQLiteType.TEXT,
        fallback: SQLiteType.TEXT,
      },
    },
  }
  const db = context.getAuditLogsDB()
  let designDoc: PreSaveSQLiteDefinition
  try {
    designDoc = await db.get<PreSaveSQLiteDefinition>(SQLITE_DESIGN_DOC_ID)
    designDoc = {
      ...designDoc,
      ...base,
    }
  } catch (err: any) {
    if (err.status === 404) {
      designDoc = base
    } else {
      throw err
    }
  }
  await db.put(designDoc)
}

export async function createAgentConversationLogDesignDocSQL() {
  const base = sql.designDoc.base("type")
  base.sql.tables = {
    [AGENT_CONVERSATION_LOG_TYPE]: {
      fields: {
        conversationId: SQLiteType.TEXT,
        messageId: SQLiteType.TEXT,
        entryId: SQLiteType.TEXT,
        agentId: SQLiteType.TEXT,
        appId: SQLiteType.TEXT,
        userId: SQLiteType.TEXT,
        timestamp: SQLiteType.TEXT,
        role: SQLiteType.TEXT,
        text: SQLiteType.TEXT,
        channelProvider: SQLiteType.TEXT,
        transient: SQLiteType.NUMERIC,
        metadata: SQLiteType.TEXT,
        type: SQLiteType.TEXT,
      },
    },
  }
  const db = context.getAgentConversationLogsDB()
  let designDoc: PreSaveSQLiteDefinition
  try {
    designDoc = await db.get<PreSaveSQLiteDefinition>(SQLITE_DESIGN_DOC_ID)
    designDoc = {
      ...designDoc,
      ...base,
    }
  } catch (err: any) {
    if (err.status === 404) {
      designDoc = base
    } else {
      throw err
    }
  }
  await db.put(designDoc)
}
