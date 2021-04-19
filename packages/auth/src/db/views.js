const { DocumentTypes, ViewNames, StaticDatabases } = require("./utils")
const { CouchDB } = require("./index")

exports.createUserEmailView = async () => {
  const db = new CouchDB(StaticDatabases.GLOBAL.name)
  const designDoc = await db.get("_design/database")
  const view = {
    // if using variables in a map function need to inject them before use
    map: `function(doc) {
      if (doc._id.startsWith("${DocumentTypes.USER}")) {
        emit(doc.email, doc._id)
      }
    }`,
  }
  designDoc.views = {
    ...designDoc.views,
    [ViewNames.USER_BY_EMAIL]: view,
  }
  await db.put(designDoc)
}
