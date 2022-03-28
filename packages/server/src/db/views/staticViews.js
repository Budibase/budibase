const { getAppDB } = require("@budibase/backend-core/context")
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
 * @returns {Promise<void>} The view now exists, please note that the next view of this query will actually build it,
 * so it may be slow.
 */
exports.createLinkView = async () => {
  const db = getAppDB()
  const designDoc = await db.get("_design/database")
  const view = {
    map: function (doc) {
      // everything in this must remain constant as its going to Pouch, no external variables
      if (doc.type === "link") {
        let doc1 = doc.doc1
        let doc2 = doc.doc2
        // eslint-disable-next-line no-undef
        emit([doc1.tableId, doc1.rowId], {
          id: doc2.rowId,
          thisId: doc1.rowId,
          fieldName: doc1.fieldName,
        })
        // if linking to same table can't emit twice
        if (doc1.tableId !== doc2.tableId) {
          // eslint-disable-next-line no-undef
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

exports.createRoutingView = async () => {
  const db = getAppDB()
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

async function searchIndex(indexName, fnString) {
  const db = getAppDB()
  const designDoc = await db.get("_design/database")
  designDoc.indexes = {
    [indexName]: {
      index: fnString,
      analyzer: "keyword",
    },
  }
  await db.put(designDoc)
}

exports.createAllSearchIndex = async () => {
  await searchIndex(
    SearchIndexes.ROWS,
    function (doc) {
      function idx(input, prev) {
        for (let key of Object.keys(input)) {
          let idxKey = prev != null ? `${prev}.${key}` : key
          idxKey = idxKey.replace(/ /g, "_")
          if (Array.isArray(input[key])) {
            for (let val of input[key]) {
              if (typeof val !== "object") {
                // eslint-disable-next-line no-undef
                index(idxKey, val, { store: true })
              }
            }
          } else if (key === "_id" || key === "_rev" || input[key] == null) {
            continue
          }
          if (typeof input[key] === "string") {
            // eslint-disable-next-line no-undef
            index(idxKey, input[key].toLowerCase(), { store: true })
          } else if (typeof input[key] !== "object") {
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
