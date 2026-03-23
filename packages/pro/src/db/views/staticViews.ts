import {
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
