import { context, db as dbCore, tenancy } from "@budibase/backend-core"

const { ViewName, AutomationViewMode, SEPARATOR, DocumentType, createView } =
  dbCore
const LOG_PREFIX = DocumentType.AUTOMATION_LOG + SEPARATOR
const APP_BACKUP_PREFIX = DocumentType.APP_BACKUP + SEPARATOR

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

export async function createAppBackupTriggerView() {
  const db = tenancy.getGlobalDB()
  const viewJs = `function(doc) {
    if (doc._id.startsWith("${APP_BACKUP_PREFIX}") && doc.type && doc.trigger) {
      let full = doc.appId + "${SEPARATOR}"
      full += doc.trigger.toLowerCase() + "${SEPARATOR}"
      full += doc.type.toLowerCase() + "${SEPARATOR}"
      emit("${APP_BACKUP_PREFIX}" + full + doc.timestamp) 
    }
  }`
  await createView(db, viewJs, ViewName.WORKSPACE_BACKUP_BY_TRIGGER)
}
