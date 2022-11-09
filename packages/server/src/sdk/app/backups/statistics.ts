import { context, db as dbCore, PouchLike } from "@budibase/backend-core"
import {
  getDatasourceParams,
  getTableParams,
  getAutomationParams,
  getScreenParams,
} from "../../../db/utils"

async function runInContext(appId: string, cb: any, db?: PouchLike) {
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

export async function calculateDatasourceCount(appId: string, db?: PouchLike) {
  return runInContext(
    appId,
    async (db: PouchLike) => {
      const datasourceList = await db.allDocs(getDatasourceParams())
      const tableList = await db.allDocs(getTableParams())
      return datasourceList.rows.length + tableList.rows.length
    },
    db
  )
}

export async function calculateAutomationCount(appId: string, db?: PouchLike) {
  return runInContext(
    appId,
    async (db: PouchLike) => {
      const automationList = await db.allDocs(getAutomationParams())
      return automationList.rows.length
    },
    db
  )
}

export async function calculateScreenCount(appId: string, db?: PouchLike) {
  return runInContext(
    appId,
    async (db: PouchLike) => {
      const screenList = await db.allDocs(getScreenParams())
      return screenList.rows.length
    },
    db
  )
}

export async function calculateBackupStats(appId: string) {
  return runInContext(appId, async (db: PouchLike) => {
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
