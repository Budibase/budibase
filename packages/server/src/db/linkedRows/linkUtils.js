const CouchDB = require("../index")
const Sentry = require("@sentry/node")

/**
 * Only needed so that boolean parameters are being used for includeDocs
 * @type {{EXCLUDE: boolean, INCLUDE: boolean}}
 */
exports.IncludeDocs = {
  INCLUDE: true,
  EXCLUDE: false,
}

/**
 * Creates the link view for the instance, this will overwrite the existing one, but this should only
 * be called if it is found that the view does not exist.
 * @param {string} appId The instance to which the view should be added.
 * @returns {Promise<void>} The view now exists, please note that the next view of this query will actually build it,
 * so it may be slow.
 */
exports.createLinkView = async appId => {
  const db = new CouchDB(appId)
  const designDoc = await db.get("_design/database")
  const view = {
    map: function(doc) {
      if (doc.type === "link") {
        let doc1 = doc.doc1
        let doc2 = doc.doc2
        emit([doc1.tableId, doc1.rowId], {
          id: doc2.rowId,
          thisId: doc1.rowId,
          fieldName: doc1.fieldName,
        })
        emit([doc2.tableId, doc2.rowId], {
          id: doc1.rowId,
          thisId: doc2.rowId,
          fieldName: doc2.fieldName,
        })
      }
    }.toString(),
  }
  designDoc.views = {
    ...designDoc.views,
    by_link: view,
  }
  await db.put(designDoc)
}

/**
 * Gets the linking documents, not the linked documents themselves.
 * @param {string} appId The instance in which we are searching for linked rows.
 * @param {string} tableId The table which we are searching for linked rows against.
 * @param {string|null} fieldName The name of column/field which is being altered, only looking for
 * linking documents that are related to it. If this is not specified then the table level will be assumed.
 * @param {string|null} rowId The ID of the row which we want to find linking documents for -
 * if this is not specified then it will assume table or field level depending on whether the
 * field name has been specified.
 * @param {boolean|null} includeDocs whether to include docs in the response call, this is considerably slower so only
 * use this if actually interested in the docs themselves.
 * @returns {Promise<object[]>} This will return an array of the linking documents that were found
 * (if any).
 */
exports.getLinkDocuments = async function({
  appId,
  tableId,
  rowId,
  includeDocs,
}) {
  const db = new CouchDB(appId)
  let params
  if (rowId != null) {
    params = { key: [tableId, rowId] }
  }
  // only table is known
  else {
    params = { startKey: [tableId], endKey: [tableId, {}] }
  }
  params.include_docs = !!includeDocs
  try {
    const response = await db.query("database/by_link", params)
    if (includeDocs) {
      return response.rows.map(row => row.doc)
    } else {
      return response.rows.map(row => row.value)
    }
  } catch (err) {
    // check if the view doesn't exist, it should for all new instances
    if (err != null && err.name === "not_found") {
      await exports.createLinkView(appId)
      return exports.getLinkDocuments(arguments[0])
    } else {
      Sentry.captureException(err)
    }
  }
}

exports.getUniqueByProp = (array, prop) => {
  return array.filter((obj, pos, arr) => {
    return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos
  })
}
