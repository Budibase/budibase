const CouchDB = require("../db")
const { DocumentTypes, SEPARATOR, ViewNames } = require("../db/utils")
const SCREEN_PREFIX = DocumentTypes.SCREEN + SEPARATOR

exports.createRoutingView = async appId => {
  const db = new CouchDB(appId)
  const designDoc = await db.get("_design/database")
  const view = {
    map: function(doc) {
      if (doc._id.startsWith(SCREEN_PREFIX)) {
        emit(doc._id, {
          routing: doc.routing,
        })
      }
    }.toString(),
  }
  designDoc.views = {
    ...designDoc.views,
    [ViewNames.ROUTING]: view,
  }
  await db.put(designDoc)
}
