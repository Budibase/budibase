import { getRowParams, USER_METDATA_PREFIX } from "../../db/utils"
import { db as dbCore } from "@budibase/backend-core"
import { Database, Row } from "@budibase/types"

const ROW_EXCLUSIONS = [USER_METDATA_PREFIX]

function getAppPairs(appIds: string[]) {
  // collect the app ids into dev / prod pairs
  // keyed by the dev app id
  const pairs: { [key: string]: { devId?: string; prodId?: string } } = {}
  for (let appId of appIds) {
    const devId = dbCore.getDevelopmentAppID(appId)
    if (!pairs[devId]) {
      pairs[devId] = {}
    }
    if (dbCore.isDevAppID(appId)) {
      pairs[devId].devId = appId
    } else {
      pairs[devId].prodId = appId
    }
  }
  return pairs
}

async function getAppRows(appId: string) {
  // need to specify the app ID, as this is used for different apps in one call
  return dbCore.doWithDB(appId, async (db: Database) => {
    const response = await db.allDocs(
      getRowParams(null, null, {
        include_docs: false,
      })
    )
    return response.rows
      .map(r => r.id)
      .filter(id => {
        for (let exclusion of ROW_EXCLUSIONS) {
          if (id.startsWith(exclusion)) {
            return false
          }
        }
        return true
      })
  })
}

/**
 * Return a set of all rows in the given app ids.
 * The returned rows will be unique on a per dev/prod app basis.
 * Rows duplicates may exist across apps due to data import so they are not filtered out.
 */
export async function getUniqueRows(appIds: string[]) {
  let uniqueRows: Row[] = [],
    rowsByApp: { [key: string]: Row[] } = {}
  const pairs = getAppPairs(appIds)

  for (let pair of Object.values(pairs)) {
    let appRows: Row[] = []
    for (let appId of [pair.devId, pair.prodId]) {
      if (!appId) {
        continue
      }
      try {
        appRows = appRows.concat(await getAppRows(appId))
      } catch (e) {
        console.error(e)
        // don't error out if we can't count the app rows, just continue
      }
    }

    // ensure uniqueness on a per app pair basis
    // this can't be done on all rows because app import results in
    // duplicate row ids across apps
    // the array pre-concat is important to avoid stack overflow
    const prodId = dbCore.getProdAppID((pair.devId || pair.prodId)!)
    rowsByApp[prodId] = [...new Set(appRows)]
    uniqueRows = uniqueRows.concat(rowsByApp[prodId])
  }

  return { rows: uniqueRows, appRows: rowsByApp }
}
