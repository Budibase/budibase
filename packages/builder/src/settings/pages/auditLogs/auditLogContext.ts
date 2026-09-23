import type { AuditLogEnriched } from "@budibase/types"

export const AUDIT_LOGS_CONTEXT = "auditLogs" as const

export interface AuditLogsContext {
  viewDetails: (detail: AuditLogEnriched) => void
}
