import {
  DocumentType,
  ViewName,
  GlobalViewName,
  DeprecatedViews,
  SEPARATOR,
} from "./utils"
import { getGlobalDB } from "../tenancy"
import PouchDB from "pouchdb"
import { Document } from "@budibase/types"

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

export const createNewUserEmailView = async () => {
  const db = getGlobalDB()
  let designDoc
  try {
    designDoc = await db.get(DESIGN_DB)
  } catch (err) {
    // no design doc, make one
    designDoc = DesignDoc()
  }
  const view = {
    // if using variables in a map function need to inject them before use
    map: `function(doc) {
      if (doc._id.startsWith("${DocumentType.USER}${SEPARATOR}")) {
        emit(doc.email.toLowerCase(), doc._id)
      }
    }`,
  }
  designDoc.views = {
    ...designDoc.views,
    [ViewName.USER_BY_EMAIL]: view,
  }
  await db.put(designDoc)
}

export const createUserAppView = async () => {
  const db = getGlobalDB()
  let designDoc
  try {
    designDoc = await db.get("_design/database")
  } catch (err) {
    // no design doc, make one
    designDoc = DesignDoc()
  }
  const view = {
    // if using variables in a map function need to inject them before use
    map: `function(doc) {
      if (doc._id.startsWith("${DocumentType.USER}${SEPARATOR}") && doc.roles) {
        for (let prodAppId of Object.keys(doc.roles)) {
          let emitted = prodAppId + "${SEPARATOR}" + doc._id
          emit(emitted, null)
        }
      }
    }`,
  }
  designDoc.views = {
    ...designDoc.views,
    [ViewName.USER_BY_APP]: view,
  }
  await db.put(designDoc)
}

export const createApiKeyView = async () => {
  const db = getGlobalDB()
  let designDoc
  try {
    designDoc = await db.get("_design/database")
  } catch (err) {
    designDoc = DesignDoc()
  }
  const view = {
    map: `function(doc) {
      if (doc._id.startsWith("${DocumentType.DEV_INFO}") && doc.apiKey) {
        emit(doc.apiKey, doc.userId)
      }
    }`,
  }
  designDoc.views = {
    ...designDoc.views,
    [ViewName.BY_API_KEY]: view,
  }
  await db.put(designDoc)
}

export const createUserBuildersView = async () => {
  const db = getGlobalDB()
  let designDoc
  try {
    designDoc = await db.get("_design/database")
  } catch (err) {
    // no design doc, make one
    designDoc = DesignDoc()
  }
  const view = {
    map: `function(doc) {
      if (doc.builder && doc.builder.global === true) {
        emit(doc._id, doc._id)
      }
    }`,
  }
  designDoc.views = {
    ...designDoc.views,
    [ViewName.USER_BY_BUILDERS]: view,
  }
  await db.put(designDoc)
}

export const queryGlobalView = async <T extends Document>(
  viewName: GlobalViewName,
  params: PouchDB.Query.Options<T, T>,
  db?: PouchDB.Database
): Promise<T[] | T | undefined> => {
  const CreateFuncByName = {
    [ViewName.USER_BY_EMAIL]: createNewUserEmailView,
    [ViewName.BY_API_KEY]: createApiKeyView,
    [ViewName.USER_BY_BUILDERS]: createUserBuildersView,
    [ViewName.USER_BY_APP]: createUserAppView,
  }
  // can pass DB in if working with something specific
  if (!db) {
    db = getGlobalDB() as PouchDB.Database
  }

  try {
    const response = await db.query<T, T>(`database/${viewName}`, params)
    const rows = response.rows
    const docs = rows.map(row => (params.include_docs ? row.doc : row.value))
    return docs.length <= 1 ? docs[0] : docs
  } catch (err: any) {
    if (err != null && err.name === "not_found") {
      const createFunc = CreateFuncByName[viewName]
      await removeDeprecated(db, viewName)
      await createFunc()
      return queryGlobalView(viewName, params)
    } else {
      throw err
    }
  }
}
