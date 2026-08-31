import { SQLiteTables, SQLiteType } from "@budibase/types"

export const AGENT_LOG_SESSION_TABLE_ID = "bb_agent_log_session"
export const PLATFORM_ACTION_SESSION_TABLE_ID = "bb_platform_action_session"

export const STATIC_SQS_TABLE_IDS = [
  AGENT_LOG_SESSION_TABLE_ID,
  PLATFORM_ACTION_SESSION_TABLE_ID,
]

export function getStaticSqsTables(): SQLiteTables {
  return {
    [AGENT_LOG_SESSION_TABLE_ID]: {
      fields: {
        _id: SQLiteType.TEXT,
        tableId: SQLiteType.TEXT,
        type: SQLiteType.TEXT,
        agentId: SQLiteType.TEXT,
        sessionId: SQLiteType.TEXT,
        trigger: SQLiteType.TEXT,
        isPreview: SQLiteType.NUMERIC,
        firstInput: SQLiteType.TEXT,
        startTime: SQLiteType.TEXT,
        lastActivityAt: SQLiteType.TEXT,
        requestIds: SQLiteType.TEXT,
        operations: SQLiteType.NUMERIC,
        status: SQLiteType.TEXT,
        createdAt: SQLiteType.TEXT,
        updatedAt: SQLiteType.TEXT,
      },
    },
    [PLATFORM_ACTION_SESSION_TABLE_ID]: {
      fields: {
        _id: SQLiteType.TEXT,
        tableId: SQLiteType.TEXT,
        sourceType: SQLiteType.TEXT,
        sourceId: SQLiteType.TEXT,
        status: SQLiteType.TEXT,
        actionCount: SQLiteType.NUMERIC,
        assetType: SQLiteType.TEXT,
        assetId: SQLiteType.TEXT,
        assetLabel: SQLiteType.TEXT,
        triggeredByType: SQLiteType.TEXT,
        triggeredById: SQLiteType.TEXT,
        triggeredByLabel: SQLiteType.TEXT,
        startedAt: SQLiteType.TEXT,
        updatedAt: SQLiteType.TEXT,
        completedAt: SQLiteType.TEXT,
        createdAt: SQLiteType.TEXT,
      },
    },
  }
}
