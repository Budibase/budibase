import { context, db as dbCore, tenancy } from "@budibase/backend-core"

const { ViewName, AutomationViewMode, SEPARATOR, DocumentType, createView } =
  dbCore
const LOG_PREFIX = DocumentType.AUTOMATION_LOG + SEPARATOR
const WORKSPACE_BACKUP_PREFIX = DocumentType.WORKSPACE_BACKUP + SEPARATOR

/**
 * A separate view that allows us to perform queries by the automation ID and time series, while the
 * main all_docs allows access to time series only
 */
export async function createLogByAutomationView() {
  const db = context.getProdWorkspaceDB()
  const viewJs = `function(doc) {
    if (doc._id.startsWith("${LOG_PREFIX}")) {
      let autoId = doc.automationId + "${SEPARATOR}"
      let status = doc.status + "${SEPARATOR}"
      let autoKey = "${AutomationViewMode.AUTOMATION}${SEPARATOR}" + autoId + doc.createdAt
      let statusKey = "${AutomationViewMode.STATUS}${SEPARATOR}" + status + doc.createdAt
      let allKey = "${AutomationViewMode.ALL}${SEPARATOR}" + status + autoId + doc.createdAt
      emit(statusKey)
      emit(autoKey)
      emit(allKey)
    }
  }`
  await createView(db, viewJs, ViewName.AUTOMATION_LOGS)
}

export async function createWorkspaceBackupTriggerView() {
  const db = tenancy.getGlobalDB()
  const viewJs = `function(doc) {
    if (doc._id.startsWith("${WORKSPACE_BACKUP_PREFIX}") && doc.type && doc.trigger) {
      let full = doc.appId + "${SEPARATOR}"
      full += doc.trigger.toLowerCase() + "${SEPARATOR}"
      full += doc.type.toLowerCase() + "${SEPARATOR}"
      emit("${WORKSPACE_BACKUP_PREFIX}" + full + doc.timestamp) 
    }
  }`
  await createView(db, viewJs, ViewName.WORKSPACE_BACKUP_BY_TRIGGER)
}
