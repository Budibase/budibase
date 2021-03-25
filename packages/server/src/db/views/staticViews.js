const CouchDB = require("../index")
const {
  DocumentTypes,
  SEPARATOR,
  ViewNames,
  SearchIndexes,
} = require("../utils")
const SCREEN_PREFIX = DocumentTypes.SCREEN + SEPARATOR

/**************************************************
 *                  INFORMATION                   *
 * This file exists purely to keep views separate *
 *    from the rest of the codebase, the reason   *
 *    being that they affect coverage and any     *
 *  functions written in this file cannot import  *
 *  or make use of any constants/variables that   *
 *   aren't defined as part of the map function   *
 *                   itself.                      *
 **************************************************/

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
      // everything in this must remain constant as its going to Pouch, no external variables
      if (doc.type === "link") {
        let doc1 = doc.doc1
        let doc2 = doc.doc2
        emit([doc1.tableId, doc1.rowId], {
          id: doc2.rowId,
          thisId: doc1.rowId,
          fieldName: doc1.fieldName,
        })
        // if linking to same table can't emit twice
        if (doc1.tableId !== doc2.tableId) {
          emit([doc2.tableId, doc2.rowId], {
            id: doc1.rowId,
            thisId: doc2.rowId,
            fieldName: doc2.fieldName,
          })
        }
      }
    }.toString(),
  }
  designDoc.views = {
    ...designDoc.views,
    [ViewNames.LINK]: view,
  }
  await db.put(designDoc)
}

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

async function searchIndex(appId, indexName, fnString) {
  const db = new CouchDB(appId)
  const designDoc = await db.get("_design/database")
  designDoc.indexes = {
    [indexName]: {
      index: fnString,
    },
  }
  await db.put(designDoc)
}

exports.createAllSearchIndex = async appId => {
  await searchIndex(
    appId,
    SearchIndexes.ROWS,
    function(doc) {
      function idx(input, prev) {
        for (let key of Object.keys(input)) {
          const idxKey = prev != null ? `${prev}.${key}` : key
          if (key === "_id" || key === "_rev") {
            continue
          }
          if (typeof input[key] !== "object") {
            // eslint-disable-next-line no-undef
            index(idxKey, input[key], { store: true })
          } else {
            idx(input[key], idxKey)
          }
        }
      }
      if (doc._id.startsWith("ro_")) {
        // eslint-disable-next-line no-undef
        index("default", doc._id)
        idx(doc)
      }
    }.toString()
  )
}
