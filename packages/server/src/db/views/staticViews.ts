import { context } from "@budibase/backend-core"
import {
  DBView,
  DesignDocument,
  DocumentType,
  LinkDocument,
  Row,
  SearchIndex,
} from "@budibase/types"
import { SEPARATOR, ViewName } from "../utils"

const getPrefix = (type: DocumentType) => type + SEPARATOR

const WORKSPACE_APP_PREFIX = getPrefix(DocumentType.WORKSPACE_APP)
const AUTOMATION_PREFIX = getPrefix(DocumentType.AUTOMATION)
const AGENT_PREFIX = getPrefix(DocumentType.AGENT)
const TABLE_PREFIX = getPrefix(DocumentType.TABLE)
const QUERY_PREFIX = getPrefix(DocumentType.QUERY)
const DATASOURCE_PREFIX = getPrefix(DocumentType.DATASOURCE)
const DATASOURCE_PLUS_PREFIX = getPrefix(DocumentType.DATASOURCE_PLUS)

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
  const designDoc = await db.get<DesignDocument>("_design/database")
  const view = {
    map: function (doc: LinkDocument) {
      // everything in this must remain constant as its going to Pouch, no external variables
      if (doc.type === "link") {
        let doc1 = doc.doc1
        let doc2 = doc.doc2
        // @ts-expect-error emit is available in a CouchDB map function
        // eslint-disable-next-line no-undef
        emit([doc1.tableId, doc1.rowId], {
          id: doc2.rowId,
          thisId: doc1.rowId,
          fieldName: doc1.fieldName,
        })
        // if linking to same table can't emit twice
        if (doc1.tableId !== doc2.tableId) {
          // @ts-expect-error emit is available in a CouchDB map function
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
    [ViewName.LINK]: view,
  }
  await db.put(designDoc)
}

export async function createRoutingView() {
  const db = context.getWorkspaceDB()
  const designDoc = await db.get<DesignDocument>("_design/database")
  const view: DBView = {
    // if using variables in a map function need to inject them before use
    map: `function(doc) {
      if (doc._id.startsWith("${getPrefix(DocumentType.SCREEN)}")) {
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

export async function createProjectMembersView() {
  const db = context.getWorkspaceDB()
  const designDoc = await db.get<DesignDocument>("_design/database")
  const view: DBView = {
    map: `function(doc) {
      function emitProjectIds(projectIds) {
        if (!Array.isArray(projectIds)) {
          return
        }

        for (var i = 0; i < projectIds.length; i++) {
          emit(projectIds[i], null)
        }
      }

      if (!doc || !doc._id) {
        return
      }

      if (
        doc._id.startsWith("${WORKSPACE_APP_PREFIX}") ||
        doc._id.startsWith("${AUTOMATION_PREFIX}") ||
        doc._id.startsWith("${AGENT_PREFIX}") ||
        doc._id.startsWith("${TABLE_PREFIX}") ||
        doc._id.startsWith("${QUERY_PREFIX}")
      ) {
        emitProjectIds(doc.projectIds)
        return
      }

      if (
        doc._id.startsWith("${DATASOURCE_PREFIX}") ||
        doc._id.startsWith("${DATASOURCE_PLUS_PREFIX}")
      ) {
        emitProjectIds(doc.projectIds)

        if (!doc.entities) {
          return
        }

        for (var key in doc.entities) {
          emitProjectIds(doc.entities[key].projectIds)
        }
      }
    }`,
  }

  designDoc.views = {
    ...designDoc.views,
    [ViewName.PROJECT_MEMBERS]: view,
  }
  await db.put(designDoc)
}

async function searchIndex(indexName: string, fnString: string) {
  const db = context.getWorkspaceDB()
  const designDoc = await db.get<DesignDocument>("_design/database")
  designDoc.indexes = {
    [indexName]: {
      index: fnString,
      analyzer: "keyword",
    },
  }
  await db.put(designDoc)
}

export async function createAllSearchIndex() {
  await searchIndex(
    SearchIndex.ROWS,
    function (doc: Row) {
      function idx(input: Row, prev?: string) {
        for (let key of Object.keys(input)) {
          let idxKey = prev != null ? `${prev}.${key}` : key
          idxKey = idxKey.replace(/ /g, "_")
          if (Array.isArray(input[key])) {
            for (let val of input[key]) {
              if (typeof val !== "object") {
                // @ts-expect-error index is available in a CouchDB map function
                // eslint-disable-next-line no-undef
                index(idxKey, val, { store: true })
              }
            }
          } else if (key === "_id" || key === "_rev" || input[key] == null) {
            continue
          }
          if (typeof input[key] === "string") {
            // @ts-expect-error index is available in a CouchDB map function
            // eslint-disable-next-line no-undef
            index(idxKey, input[key].toLowerCase(), { store: true })
          } else if (typeof input[key] !== "object") {
            // @ts-expect-error index is available in a CouchDB map function
            // eslint-disable-next-line no-undef
            index(idxKey, input[key], { store: true })
          } else {
            idx(input[key], idxKey)
          }
        }
      }
      if (doc._id!.startsWith("ro_")) {
        // @ts-expect-error index is available in a CouchDB map function
        // eslint-disable-next-line no-undef
        index("default", doc._id)
        idx(doc)
      }
    }.toString()
  )
}
