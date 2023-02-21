import {
  Event,
  AuditLogSearchParams,
  AuditLogFilterEvent,
  AuditLogDownloadEvent,
} from "@budibase/types"
import { publishEvent } from "../events"

async function filtered(search: AuditLogSearchParams) {
  const properties: AuditLogFilterEvent = {
    filters: search,
  }
  await publishEvent(Event.AUDIT_LOG_FILTER, properties)
}

async function download(search: AuditLogSearchParams) {
  const properties: AuditLogDownloadEvent = {
    filters: search,
  }
  await publishEvent(Event.AUDIT_LOG_DOWNLOAD, properties)
}

export default {
  filtered,
  download,
}
