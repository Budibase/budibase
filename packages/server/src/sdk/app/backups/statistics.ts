import { context, db as dbCore } from "@budibase/backend-core"
import { Database } from "@budibase/types"
import {
  getDatasourceParams,
  getTableParams,
  getAutomationParams,
  getScreenParams,
} from "../../../db/utils"

async function runInContext(appId: string, cb: any, db?: Database) {
  if (db) {
    return cb(db)
  } else {
    const devAppId = dbCore.getDevAppID(appId)
    return context.doInAppContext(devAppId, () => {
      const db = context.getAppDB()
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
      const screenList = await db.allDocs(getScreenParams())
      return screenList.rows.length
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
