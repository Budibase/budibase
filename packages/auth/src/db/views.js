const { DocumentTypes, ViewNames } = require("./utils")

function DesignDoc() {
  return {
    _id: "_design/database",
    // view collation information, read before writing any complex views:
    // https://docs.couchdb.org/en/master/ddocs/views/collation.html#collation-specification
    views: {},
  }
}

exports.createUserEmailView = async db => {
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
