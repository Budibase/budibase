import { AutomationResults } from "../../definitions/automation"
import { getAppDB } from "@budibase/backend-core/context"
import {
  generateAutomationLogID,
  getAutomationLogParams,
  // getQueryIndex,
  // ViewNames,
} from "../../db/utils"
// import { createLogByAutomationView } from "../../db/views/staticViews"

const FREE_EXPIRY_SEC = 86400
// const PRO_EXPIRY_SEC = FREE_EXPIRY_SEC * 30

async function clearOldHistory() {
  const db = getAppDB()
  // TODO: handle license lookup for deletion
  const time = new Date(new Date().getTime() - FREE_EXPIRY_SEC * 1000)
  const queryParams: any = {
    endIso: time,
  }
  const results = await db.allDocs(getAutomationLogParams(queryParams))
  const toDelete = results.map((doc: any) => ({
    _id: doc.id,
    _rev: doc.rev,
    _deleted: true,
  }))
  await db.bulkDocs(toDelete)
}

// async function getByAutomationID(automationId: string) {
//   const db = getAppDB()
//   try {
//     const queryParams: any = {
//       automationId,
//     }
//     return (
//       await db.query(
//         getQueryIndex(ViewNames.LOGS_BY_AUTOMATION),
//         getAutomationLogParams(queryParams, { include_docs: true })
//       )
//     ).rows.map((row: any) => row.doc)
//   } catch (err: any) {
//     if (err != null && err.name === "not_found") {
//       await createLogByAutomationView()
//       return getByAutomationID(automationId)
//     }
//   }
// }

export async function storeHistory(
  automationId: string,
  results: AutomationResults
) {
  const db = getAppDB()
  const isoDate = new Date().toISOString()
  const id = generateAutomationLogID(isoDate, automationId)
  await db.put({
    // results contain automationId and status for view
    ...results,
    createdAt: isoDate,
    _id: id,
  })
  // clear up old history for app
  await clearOldHistory()
}

export async function retrieve() {}
