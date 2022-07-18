import {
  DEFAULT_TENANT_ID,
  getAppId,
  getTenantIDFromAppID,
  updateTenantId,
} from "./index"
import cls from "./FunctionContext"
import { IdentityContext } from "@budibase/types"
import { ContextKeys } from "./constants"
import { dangerousGetDB, closeDB } from "../db"
import { isEqual } from "lodash"
import { getDevelopmentAppID, getProdAppID } from "../db/conversions"
import env from "../environment"

export async function updateUsing(
  usingKey: string,
  existing: boolean,
  internal: (opts: { existing: boolean }) => Promise<any>
) {
  const using = cls.getFromContext(usingKey)
  if (using && existing) {
    cls.setOnContext(usingKey, using + 1)
    return internal({ existing: true })
  } else {
    return cls.run(async () => {
      cls.setOnContext(usingKey, 1)
      return internal({ existing: false })
    })
  }
}

export async function closeWithUsing(
  usingKey: string,
  closeFn: () => Promise<any>
) {
  const using = cls.getFromContext(usingKey)
  if (!using || using <= 1) {
    await closeFn()
  } else {
    cls.setOnContext(usingKey, using - 1)
  }
}

export const setAppTenantId = (appId: string) => {
  const appTenantId = getTenantIDFromAppID(appId) || DEFAULT_TENANT_ID
  updateTenantId(appTenantId)
}

export const setIdentity = (identity: IdentityContext | null) => {
  cls.setOnContext(ContextKeys.IDENTITY, identity)
}

// this function makes sure the PouchDB objects are closed and
// fully deleted when finished - this protects against memory leaks
export async function closeAppDBs() {
  const dbKeys = [
    ContextKeys.CURRENT_DB,
    ContextKeys.PROD_DB,
    ContextKeys.DEV_DB,
  ]
  for (let dbKey of dbKeys) {
    const db = cls.getFromContext(dbKey)
    if (!db) {
      continue
    }
    await closeDB(db)
    // clear the DB from context, incase someone tries to use it again
    cls.setOnContext(dbKey, null)
  }
  // clear the app ID now that the databases are closed
  if (cls.getFromContext(ContextKeys.APP_ID)) {
    cls.setOnContext(ContextKeys.APP_ID, null)
  }
  if (cls.getFromContext(ContextKeys.DB_OPTS)) {
    cls.setOnContext(ContextKeys.DB_OPTS, null)
  }
}

export function getContextDB(key: string, opts: any) {
  const dbOptsKey = `${key}${ContextKeys.DB_OPTS}`
  let storedOpts = cls.getFromContext(dbOptsKey)
  let db = cls.getFromContext(key)
  if (db && isEqual(opts, storedOpts)) {
    return db
  }

  const appId = getAppId()
  let toUseAppId

  switch (key) {
    case ContextKeys.CURRENT_DB:
      toUseAppId = appId
      break
    case ContextKeys.PROD_DB:
      toUseAppId = getProdAppID(appId)
      break
    case ContextKeys.DEV_DB:
      toUseAppId = getDevelopmentAppID(appId)
      break
  }
  db = dangerousGetDB(toUseAppId, opts)
  try {
    cls.setOnContext(key, db)
    if (opts) {
      cls.setOnContext(dbOptsKey, opts)
    }
  } catch (err) {
    if (!env.isTest()) {
      throw err
    }
  }
  return db
}
