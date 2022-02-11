const { DocumentTypes, ViewNames } = require("./utils")
const { getGlobalDB } = require("../tenancy")

function DesignDoc() {
  return {
    _id: "_design/database",
    // view collation information, read before writing any complex views:
    // https://docs.couchdb.org/en/master/ddocs/views/collation.html#collation-specification
    views: {},
  }
}

exports.createUserEmailView = async () => {
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
      if (doc._id.startsWith("${DocumentTypes.USER}")) {
        emit(doc.email.toLowerCase(), doc._id)
      }
    }`,
  }
  designDoc.views = {
    ...designDoc.views,
    [ViewNames.USER_BY_EMAIL]: view,
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
      if (doc._id.startsWith("${DocumentTypes.DEV_INFO}") && doc.apiKey) {
        emit(doc.apiKey, doc.userId)
      }
    }`,
  }
  designDoc.views = {
    ...designDoc.views,
    [ViewNames.BY_API_KEY]: view,
  }
  await db.put(designDoc)
}

exports.queryGlobalView = async (viewName, params, db = null) => {
  const CreateFuncByName = {
    [ViewNames.USER_BY_EMAIL]: exports.createUserEmailView,
    [ViewNames.BY_API_KEY]: exports.createApiKeyView,
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
      await createFunc()
      return exports.queryGlobalView(viewName, params)
    } else {
      throw err
    }
  }
}
