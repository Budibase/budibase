import {
  DeprecatedViews,
  DocumentType,
  SEPARATOR,
  StaticDatabases,
  ViewName,
} from "../constants"
import { getGlobalDB } from "../context"
import { doWithDB } from "./"
import { AllDocsResponse, Database, DatabaseQueryOpts } from "@budibase/types"
import env from "../environment"

const DESIGN_DB = "_design/database"

function DesignDoc() {
  return {
    _id: DESIGN_DB,
    // view collation information, read before writing any complex views:
    // https://docs.couchdb.org/en/master/ddocs/views/collation.html#collation-specification
    views: {},
  }
}

interface DesignDocument {
  views: any
}

async function removeDeprecated(db: Database, viewName: ViewName) {
  // @ts-ignore
  if (!DeprecatedViews[viewName]) {
    return
  }
  try {
    const designDoc = await db.get<DesignDocument>(DESIGN_DB)
    // @ts-ignore
    for (let deprecatedNames of DeprecatedViews[viewName]) {
      delete designDoc.views[deprecatedNames]
    }
    await db.put(designDoc)
  } catch (err) {
    // doesn't exist, ignore
  }
}

export async function createView(
  db: any,
  viewJs: string,
  viewName: string
): Promise<void> {
  let designDoc
  try {
    designDoc = (await db.get(DESIGN_DB)) as DesignDocument
  } catch (err) {
    // no design doc, make one
    designDoc = DesignDoc()
  }
  const view = {
    map: viewJs,
  }
  designDoc.views = {
    ...designDoc.views,
    [viewName]: view,
  }
  try {
    await db.put(designDoc)
  } catch (err: any) {
    if (err.status === 409) {
      return await createView(db, viewJs, viewName)
    } else {
      throw err
    }
  }
}

export const createNewUserEmailView = async () => {
  const db = getGlobalDB()
  const viewJs = `function(doc) {
    if (doc._id.startsWith("${DocumentType.USER}${SEPARATOR}")) {
      emit(doc.email.toLowerCase(), doc._id)
    }
  }`
  await createView(db, viewJs, ViewName.USER_BY_EMAIL)
}

export const createUserAppView = async () => {
  const db = getGlobalDB()
  const viewJs = `function(doc) {
    if (doc._id.startsWith("${DocumentType.USER}${SEPARATOR}") && doc.roles) {
      for (let prodAppId of Object.keys(doc.roles)) {
        let emitted = prodAppId + "${SEPARATOR}" + doc._id
        emit(emitted, null)
      }
    }
  }`
  await createView(db, viewJs, ViewName.USER_BY_APP)
}

export const createApiKeyView = async () => {
  const db = getGlobalDB()
  const viewJs = `function(doc) {
    if (doc._id.startsWith("${DocumentType.DEV_INFO}") && doc.apiKey) {
      emit(doc.apiKey, doc.userId)
    }
  }`
  await createView(db, viewJs, ViewName.BY_API_KEY)
}

export interface QueryViewOptions {
  arrayResponse?: boolean
}

export async function queryViewRaw<T>(
  viewName: ViewName,
  params: DatabaseQueryOpts,
  db: Database,
  createFunc: any,
  opts?: QueryViewOptions
): Promise<AllDocsResponse<T>> {
  try {
    const response = await db.query<T>(`database/${viewName}`, params)
    // await to catch error
    return response
  } catch (err: any) {
    const pouchNotFound = err && err.name === "not_found"
    const couchNotFound = err && err.status === 404
    if (pouchNotFound || couchNotFound) {
      await removeDeprecated(db, viewName)
      await createFunc()
      return queryViewRaw(viewName, params, db, createFunc, opts)
    } else if (err.status === 409) {
      // can happen when multiple queries occur at once, view couldn't be created
      // other design docs being updated, re-run
      return queryViewRaw(viewName, params, db, createFunc, opts)
    } else {
      throw err
    }
  }
}

export const queryView = async <T>(
  viewName: ViewName,
  params: DatabaseQueryOpts,
  db: Database,
  createFunc: any,
  opts?: QueryViewOptions
): Promise<T[] | T | undefined> => {
  const response = await queryViewRaw<T>(viewName, params, db, createFunc, opts)
  const rows = response.rows
  const docs = rows.map((row: any) =>
    params.include_docs ? row.doc : row.value
  )

  // if arrayResponse has been requested, always return array regardless of length
  if (opts?.arrayResponse) {
    return docs as T[]
  } else {
    // return the single document if there is only one
    return docs.length <= 1 ? (docs[0] as T) : (docs as T[])
  }
}

// PLATFORM

async function createPlatformView(viewJs: string, viewName: ViewName) {
  try {
    await doWithDB(StaticDatabases.PLATFORM_INFO.name, async (db: Database) => {
      await createView(db, viewJs, viewName)
    })
  } catch (e: any) {
    if (e.status === 409 && env.isTest()) {
      // multiple tests can try to initialise platforms views
      // at once - safe to exit on conflict
      return
    }
    throw e
  }
}

export const createPlatformAccountEmailView = async () => {
  const viewJs = `function(doc) {
    if (doc._id.startsWith("${DocumentType.ACCOUNT_METADATA}${SEPARATOR}")) {
      emit(doc.email.toLowerCase(), doc._id)
    }
  }`
  await createPlatformView(viewJs, ViewName.ACCOUNT_BY_EMAIL)
}

export const createPlatformUserView = async () => {
  const viewJs = `function(doc) {
    if (doc.tenantId) {
      emit(doc._id.toLowerCase(), doc._id)
    }

    if (doc.ssoId) {
      emit(doc.ssoId, doc._id)
    }
  }`
  await createPlatformView(viewJs, ViewName.PLATFORM_USERS_LOWERCASE)
}

export const queryPlatformView = async <T>(
  viewName: ViewName,
  params: DatabaseQueryOpts,
  opts?: QueryViewOptions
): Promise<T[] | T | undefined> => {
  const CreateFuncByName: any = {
    [ViewName.ACCOUNT_BY_EMAIL]: createPlatformAccountEmailView,
    [ViewName.PLATFORM_USERS_LOWERCASE]: createPlatformUserView,
  }

  return doWithDB(StaticDatabases.PLATFORM_INFO.name, async (db: Database) => {
    const createFn = CreateFuncByName[viewName]
    return queryView(viewName, params, db, createFn, opts)
  })
}

const CreateFuncByName: any = {
  [ViewName.USER_BY_EMAIL]: createNewUserEmailView,
  [ViewName.BY_API_KEY]: createApiKeyView,
  [ViewName.USER_BY_APP]: createUserAppView,
}

export const queryGlobalView = async <T>(
  viewName: ViewName,
  params: DatabaseQueryOpts,
  db?: Database,
  opts?: QueryViewOptions
): Promise<T[] | T | undefined> => {
  // can pass DB in if working with something specific
  if (!db) {
    db = getGlobalDB()
  }
  const createFn = CreateFuncByName[viewName]
  return queryView(viewName, params, db!, createFn, opts)
}

export async function queryGlobalViewRaw<T>(
  viewName: ViewName,
  params: DatabaseQueryOpts,
  opts?: QueryViewOptions
) {
  const db = getGlobalDB()
  const createFn = CreateFuncByName[viewName]
  return queryViewRaw<T>(viewName, params, db, createFn, opts)
}
