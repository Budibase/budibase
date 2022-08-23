const {
  DocumentType,
  ViewName,
  DeprecatedViews,
  SEPARATOR,
} = require("./utils")
const { getGlobalDB } = require("../tenancy")

const DESIGN_DB = "_design/database"

function DesignDoc() {
  return {
    _id: DESIGN_DB,
    // view collation information, read before writing any complex views:
    // https://docs.couchdb.org/en/master/ddocs/views/collation.html#collation-specification
    views: {},
  }
}

async function removeDeprecated(db, viewName) {
  if (!DeprecatedViews[viewName]) {
    return
  }
  try {
    const designDoc = await db.get(DESIGN_DB)
    for (let deprecatedNames of DeprecatedViews[viewName]) {
      delete designDoc.views[deprecatedNames]
    }
    await db.put(designDoc)
  } catch (err) {
    // doesn't exist, ignore
  }
}

exports.createNewUserEmailView = async () => {
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

exports.createUserAppView = async () => {
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

exports.createApiKeyView = async () => {
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

exports.createUserBuildersView = async () => {
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

exports.queryGlobalView = async (viewName, params, db = null) => {
  const CreateFuncByName = {
    [ViewName.USER_BY_EMAIL]: exports.createNewUserEmailView,
    [ViewName.BY_API_KEY]: exports.createApiKeyView,
    [ViewName.USER_BY_BUILDERS]: exports.createUserBuildersView,
    [ViewName.USER_BY_APP]: exports.createUserAppView,
  }
  // can pass DB in if working with something specific
  if (!db) {
    db = getGlobalDB()
  }
  try {
    let response = (await db.query(`database/${viewName}`, params)).rows
    response = response.map(resp =>
      params.include_docs ? resp.doc : resp.value
    )
    return response.length <= 1 ? response[0] : response
  } catch (err) {
    if (err != null && err.name === "not_found") {
      const createFunc = CreateFuncByName[viewName]
      await removeDeprecated(db, viewName)
      await createFunc()
      return exports.queryGlobalView(viewName, params)
    } else {
      throw err
    }
  }
}
