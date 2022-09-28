import { DocumentType, ViewName, DeprecatedViews, SEPARATOR } from "./utils"
import { getGlobalDB } from "../context"
import PouchDB from "pouchdb"
import { StaticDatabases } from "./constants"
import { doWithDB } from "./"

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

async function removeDeprecated(db: PouchDB.Database, viewName: ViewName) {
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

export async function createView(db: any, viewJs: string, viewName: string) {
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
  await db.put(designDoc)
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

export const createAccountEmailView = async () => {
  const viewJs = `function(doc) {
    if (doc._id.startsWith("${DocumentType.ACCOUNT_METADATA}${SEPARATOR}")) {
      emit(doc.email.toLowerCase(), doc._id)
    }
  }`
  await doWithDB(
    StaticDatabases.PLATFORM_INFO.name,
    async (db: PouchDB.Database) => {
      await createView(db, viewJs, ViewName.ACCOUNT_BY_EMAIL)
    }
  )
}

export const createUserAppView = async () => {
  const db = getGlobalDB() as PouchDB.Database
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

export const createUserBuildersView = async () => {
  const db = getGlobalDB()
  const viewJs = `function(doc) {
    if (doc.builder && doc.builder.global === true) {
      emit(doc._id, doc._id)
    }
  }`
  await createView(db, viewJs, ViewName.USER_BY_BUILDERS)
}

export const createPlatformUserView = async () => {
  const viewJs = `function(doc) {
    if (doc.tenantId) {
      emit(doc._id.toLowerCase(), doc._id)
    }
  }`
  await doWithDB(
    StaticDatabases.PLATFORM_INFO.name,
    async (db: PouchDB.Database) => {
      await createView(db, viewJs, ViewName.PLATFORM_USERS_LOWERCASE)
    }
  )
}

export interface QueryViewOptions {
  arrayResponse?: boolean
}

export const queryView = async <T>(
  viewName: ViewName,
  params: PouchDB.Query.Options<T, T>,
  db: PouchDB.Database,
  createFunc: any,
  opts?: QueryViewOptions
): Promise<T[] | T | undefined> => {
  try {
    let response = await db.query<T, T>(`database/${viewName}`, params)
    const rows = response.rows
    const docs = rows.map(row => (params.include_docs ? row.doc : row.value))

    // if arrayResponse has been requested, always return array regardless of length
    if (opts?.arrayResponse) {
      return docs
    } else {
      // return the single document if there is only one
      return docs.length <= 1 ? docs[0] : docs
    }
  } catch (err: any) {
    if (err != null && err.name === "not_found") {
      await removeDeprecated(db, viewName)
      await createFunc()
      return queryView(viewName, params, db, createFunc, opts)
    } else {
      throw err
    }
  }
}

export const queryPlatformView = async <T>(
  viewName: ViewName,
  params: PouchDB.Query.Options<T, T>,
  opts?: QueryViewOptions
): Promise<T[] | T | undefined> => {
  const CreateFuncByName: any = {
    [ViewName.ACCOUNT_BY_EMAIL]: createAccountEmailView,
    [ViewName.PLATFORM_USERS_LOWERCASE]: createPlatformUserView,
  }

  return doWithDB(
    StaticDatabases.PLATFORM_INFO.name,
    async (db: PouchDB.Database) => {
      const createFn = CreateFuncByName[viewName]
      return queryView(viewName, params, db, createFn, opts)
    }
  )
}

export const queryGlobalView = async <T>(
  viewName: ViewName,
  params: PouchDB.Query.Options<T, T>,
  db?: PouchDB.Database,
  opts?: QueryViewOptions
): Promise<T[] | T | undefined> => {
  const CreateFuncByName: any = {
    [ViewName.USER_BY_EMAIL]: createNewUserEmailView,
    [ViewName.BY_API_KEY]: createApiKeyView,
    [ViewName.USER_BY_BUILDERS]: createUserBuildersView,
    [ViewName.USER_BY_APP]: createUserAppView,
  }
  // can pass DB in if working with something specific
  if (!db) {
    db = getGlobalDB() as PouchDB.Database
  }
  const createFn = CreateFuncByName[viewName]
  return queryView(viewName, params, db, createFn, opts)
}
