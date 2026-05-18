import { context } from "@budibase/backend-core"
import { DBView, DocumentType, SearchIndex } from "@budibase/types"
import { SEPARATOR, ViewName } from "../utils"

const SCREEN_PREFIX = DocumentType.SCREEN + SEPARATOR

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
 * @returns The view now exists, please note that the next view of this query will actually build it,
 * so it may be slow.
 */
export async function createLinkView() {
  const db = context.getWorkspaceDB()
  const designDoc = await db.get<any>("_design/database")
  // Stored as a raw template literal — see comment on createAllSearchIndex.
  const view: DBView = {
    map: `function(doc) {
      if (doc.type === "link") {
        let doc1 = doc.doc1
        let doc2 = doc.doc2
        emit([doc1.tableId, doc1.rowId], {
          id: doc2.rowId,
          thisId: doc1.rowId,
          fieldName: doc1.fieldName,
        })
        if (doc1.tableId !== doc2.tableId) {
          emit([doc2.tableId, doc2.rowId], {
            id: doc1.rowId,
            thisId: doc2.rowId,
            fieldName: doc2.fieldName,
          })
        }
      }
    }`,
  }
  const existing = designDoc.views?.[ViewName.LINK]
  if (existing?.map === view.map) {
    return
  }
  designDoc.views = {
    ...designDoc.views,
    [ViewName.LINK]: view,
  }
  await db.put(designDoc)
}

export async function createRoutingView() {
  const db = context.getWorkspaceDB()
  const designDoc = await db.get<any>("_design/database")
  const view: DBView = {
    // if using variables in a map function need to inject them before use
    map: `function(doc) {
      if (doc._id.startsWith("${SCREEN_PREFIX}")) {
        emit([doc.workspaceAppId, doc._id], {
          id: doc._id,
          routing: doc.routing,
        })
      }
    }`,
    version: 2,
  }

  designDoc.views = {
    ...designDoc.views,
    [ViewName.ROUTING]: view,
  }
  await db.put(designDoc)
}

async function searchIndex(indexName: string, fnString: string) {
  const db = context.getWorkspaceDB()
  const designDoc = await db.get<any>("_design/database")
  const desired = { index: fnString, analyzer: "keyword" }
  const existing = designDoc.indexes?.[indexName]
  if (
    existing?.index === desired.index &&
    existing?.analyzer === desired.analyzer
  ) {
    return
  }
  designDoc.indexes = {
    ...designDoc.indexes,
    [indexName]: desired,
  }
  await db.put(designDoc)
}

export async function createAllSearchIndex() {
  // Stored as a raw template literal rather than `.toString()` on a real function:
  // esbuild's --minify --keep-names wraps inner named functions with a call to a
  // module-scope helper (`r(fn, "name")`), and that helper does not exist in
  // CouchDB/Clouseau's JS sandbox — every doc would throw `ReferenceError`.
  const fnString = `function(doc) {
    function idx(input, prev) {
      for (let key of Object.keys(input)) {
        let idxKey = prev != null ? \`\${prev}.\${key}\` : key
        idxKey = idxKey.replace(/ /g, "_")
        if (Array.isArray(input[key])) {
          for (let val of input[key]) {
            if (typeof val !== "object") {
              index(idxKey, val, { store: true })
            }
          }
        } else if (key === "_id" || key === "_rev" || input[key] == null) {
          continue
        }
        if (typeof input[key] === "string") {
          index(idxKey, input[key].toLowerCase(), { store: true })
        } else if (typeof input[key] !== "object") {
          index(idxKey, input[key], { store: true })
        } else {
          idx(input[key], idxKey)
        }
      }
    }
    if (doc._id.startsWith("ro_")) {
      index("default", doc._id)
      idx(doc)
    }
  }`
  await searchIndex(SearchIndex.ROWS, fnString)
}
