import LoggingProcessor from "./LoggingProcessor"
import AuditLogsProcessor from "./AuditLogsProcessor"
import EventBrokerProcessor from "./EventBrokerProcessor"
import PlatformActionPersistProcessor from "./platformActions/platformActionsPersistProcessor"
import Processors from "./Processors"
import { AuditLogFn, GetLicenseKeyFn } from "@budibase/types"

const loggingProcessor = new LoggingProcessor()
const auditLogsProcessor = new AuditLogsProcessor()
const eventBrokerProcessor = new EventBrokerProcessor()
const platformActionPersistProcessor = new PlatformActionPersistProcessor()

export function init(auditingFn: AuditLogFn, getLicenseKeyFn: GetLicenseKeyFn) {
  EventBrokerProcessor.init(getLicenseKeyFn)
  return AuditLogsProcessor.init(auditingFn)
}

export const processors = new Processors([
  loggingProcessor,
  auditLogsProcessor,
  eventBrokerProcessor,
  platformActionPersistProcessor,
])
