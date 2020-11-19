const CouchDB = require("../../db")
const { DocumentTypes, SEPARATOR, ViewNames } = require("../../db/utils")
const SCREEN_PREFIX = DocumentTypes.SCREEN + SEPARATOR

exports.createRoutingView = async appId => {
  const db = new CouchDB(appId)
  const designDoc = await db.get("_design/database")
  const view = {
    // if using variables in a map function need to inject them before use
    map: `function(doc) {
      if (doc._id.startsWith("${SCREEN_PREFIX}")) {
        emit(doc._id, {
          id: doc._id,
          routing: doc.routing,
        })
      }
    }`,
  }
  designDoc.views = {
    ...designDoc.views,
    [ViewNames.ROUTING]: view,
  }
  await db.put(designDoc)
}
