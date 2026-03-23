import { tenancy, db as dbCore } from "@budibase/backend-core"

const { ViewName, SEPARATOR, DocumentType, createView } = dbCore

const USER_PREFIX = DocumentType.USER + SEPARATOR

export enum GroupViewMode {
  SEARCH_BY_ID = "g_",
  SEARCH_BY_EMAIL = "e_",
}

export async function createGroupUserLookupView() {
  const db = tenancy.getGlobalDB()
  const viewJs = `function(doc) {
      if (doc._id.startsWith("${USER_PREFIX}") && Array.isArray(doc.userGroups)) {
        for (let groupId of doc.userGroups) {
          emit("${GroupViewMode.SEARCH_BY_ID}" + groupId, { email: doc.email, userId: doc._id })
          emit("${GroupViewMode.SEARCH_BY_EMAIL}" + groupId + doc.email, { email: doc.email, userId: doc._id })
        }
      }
    }`
  await createView(db, viewJs, ViewName.USER_BY_GROUP)
}
