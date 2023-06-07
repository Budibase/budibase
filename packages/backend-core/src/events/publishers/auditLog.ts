import {
  Event,
  AuditLogSearchParams,
  AuditLogFilteredEvent,
  AuditLogDownloadedEvent,
} from "@budibase/types"
import { publishEvent } from "../events"

async function filtered(search: AuditLogSearchParams) {
  const properties: AuditLogFilteredEvent = {
    filters: search,
  }
  await publishEvent(Event.AUDIT_LOGS_FILTERED, properties)
}

async function downloaded(search: AuditLogSearchParams) {
  const properties: AuditLogDownloadedEvent = {
    filters: search,
  }
  await publishEvent(Event.AUDIT_LOGS_DOWNLOADED, properties)
}

export default {
  filtered,
  downloaded,
}
