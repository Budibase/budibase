import { Readable } from "stream"
import { events } from "@budibase/backend-core"
import { auditLogs } from "@budibase/pro"
import {
  SearchAuditLogsRequest,
  SearchAuditLogsResponse,
  DownloadAuditLogsRequest,
  DefinitionsAuditLogsResponse,
  AuditLogSearchParams,
  UserCtx,
} from "@budibase/types"

export async function search(
  ctx: UserCtx<SearchAuditLogsRequest, SearchAuditLogsResponse>
) {
  const search: AuditLogSearchParams = ctx.request.body
  const fetched = await auditLogs.fetch(search)
  await events.auditLog.filtered(search)
  ctx.body = fetched
}

export async function download(
  ctx: UserCtx<DownloadAuditLogsRequest, Readable>
) {
  const search: AuditLogSearchParams = ctx.request.body
  const { stream } = auditLogs.download(search)
  await events.auditLog.downloaded(search)
  ctx.attachment(`audit-logs-${Date.now()}.log`)
  ctx.body = stream
}

export async function definitions(
  ctx: UserCtx<void, DefinitionsAuditLogsResponse>
) {
  ctx.body = {
    events: auditLogs.definitions(),
  }
}
