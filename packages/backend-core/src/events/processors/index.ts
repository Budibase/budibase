import { AuditLogFn } from "@budibase/types"
import AnalyticsProcessor from "./AnalyticsProcessor"
import AuditLogsProcessor from "./AuditLogsProcessor"
import LoggingProcessor from "./LoggingProcessor"
import Processors from "./Processors"

export const analyticsProcessor = new AnalyticsProcessor()
const loggingProcessor = new LoggingProcessor()
const auditLogsProcessor = new AuditLogsProcessor()

export function init(auditingFn: AuditLogFn) {
  return AuditLogsProcessor.init(auditingFn)
}

export const processors = new Processors([
  analyticsProcessor,
  loggingProcessor,
  auditLogsProcessor,
])
