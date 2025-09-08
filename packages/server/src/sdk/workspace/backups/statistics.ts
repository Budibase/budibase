import { context, db as dbCore } from "@budibase/backend-core"
import { Database } from "@budibase/types"
import sdk from "../.."
import {
  getAutomationParams,
  getDatasourceParams,
  getTableParams,
} from "../../../db/utils"

async function runInContext(appId: string, cb: any, db?: Database) {
  if (db) {
    return cb(db)
  } else {
    const devId = dbCore.getDevWorkspaceID(appId)
    return context.doInWorkspaceContext(devId, () => {
      const db = context.getWorkspaceDB()
      return cb(db)
    })
  }
}

export async function calculateDatasourceCount(appId: string, db?: Database) {
  return runInContext(
    appId,
    async (db: Database) => {
      const datasourceList = await db.allDocs(getDatasourceParams())
      const tableList = await db.allDocs(getTableParams())
      return datasourceList.rows.length + tableList.rows.length
    },
    db
  )
}

export async function calculateAutomationCount(appId: string, db?: Database) {
  return runInContext(
    appId,
    async (db: Database) => {
      const automationList = await db.allDocs(getAutomationParams())
      return automationList.rows.length
    },
    db
  )
}

export async function calculateScreenCount(appId: string, db?: Database) {
  return runInContext(
    appId,
    async (db: Database) => {
      const screenList = await sdk.screens.fetch(db)
      return screenList.length
    },
    db
  )
}

export async function calculateBackupStats(appId: string) {
  return runInContext(appId, async (db: Database) => {
    const promises = []
    promises.push(calculateDatasourceCount(appId, db))
    promises.push(calculateAutomationCount(appId, db))
    promises.push(calculateScreenCount(appId, db))
    const responses = await Promise.all(promises)
    return {
      datasources: responses[0],
      automations: responses[1],
      screens: responses[2],
    }
  })
}
