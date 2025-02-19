export enum JobQueue {
  AUTOMATION = "automationQueue",
  APP_BACKUP = "appBackupQueue",
  AUDIT_LOG = "auditLogQueue",
  SYSTEM_EVENT_QUEUE = "systemEventQueue",
  APP_MIGRATION = "appMigration",
  DOC_WRITETHROUGH_QUEUE = "docWritethroughQueue",
}

export type { QueueOptions, Queue, JobOptions } from "bull"
