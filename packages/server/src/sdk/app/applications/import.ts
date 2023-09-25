import { db as dbCore } from "@budibase/backend-core"
import {
  DocumentTypesToImport,
  Document,
  Database,
  RowValue,
} from "@budibase/types"
import backups from "../backups"

export type FileAttributes = {
  type: string
  path: string
}

function mergeUpdateAndDeleteDocuments(
  updateDocs: Document[],
  deleteDocs: Document[]
) {
  // compress the documents to create and to delete (if same ID, then just update the rev)
  const finalToDelete = []
  for (let deleteDoc of deleteDocs) {
    const found = updateDocs.find(doc => doc._id === deleteDoc._id)
    if (found) {
      found._rev = deleteDoc._rev
    } else {
      finalToDelete.push(deleteDoc)
    }
  }
  return [...updateDocs, ...finalToDelete]
}

async function removeImportableDocuments(db: Database) {
  // get the references to the documents, not the whole document
  const docPromises = []
  for (let docType of DocumentTypesToImport) {
    docPromises.push(db.allDocs(dbCore.getDocParams(docType)))
  }
  let documentRefs: { _id: string; _rev: string }[] = []
  for (let response of await Promise.all(docPromises)) {
    documentRefs = documentRefs.concat(
      response.rows.map(row => ({
        _id: row.id,
        _rev: (row.value as RowValue).rev,
      }))
    )
  }
  // add deletion key
  return documentRefs.map(ref => ({ _deleted: true, ...ref }))
}

async function getImportableDocuments(db: Database) {
  // get the whole document
  const docPromises = []
  for (let docType of DocumentTypesToImport) {
    docPromises.push(
      db.allDocs(dbCore.getDocParams(docType, null, { include_docs: true }))
    )
  }
  // map the responses to the document itself
  let documents: Document[] = []
  for (let response of await Promise.all(docPromises)) {
    documents = documents.concat(response.rows.map(row => row.doc))
  }
  // remove the _rev, stops it being written
  documents.forEach(doc => {
    delete doc._rev
  })
  return documents
}

export async function updateWithExport(
  appId: string,
  file: FileAttributes,
  password?: string
) {
  const devId = dbCore.getDevAppID(appId)
  const tempAppName = `temp_${devId}`
  const tempDb = dbCore.getDB(tempAppName)
  const appDb = dbCore.getDB(devId)
  try {
    const template = {
      file: {
        type: file.type!,
        path: file.path!,
        password,
      },
    }
    // get a temporary version of the import
    // don't need obj store, the existing app already has everything we need
    await backups.importApp(devId, tempDb, template, {
      importObjStoreContents: false,
    })
    // get the documents to copy
    const toUpdate = await getImportableDocuments(tempDb)
    // clear out the old documents
    const toDelete = await removeImportableDocuments(appDb)
    // now bulk update documents - add new ones, delete old ones and update common ones
    await appDb.bulkDocs(mergeUpdateAndDeleteDocuments(toUpdate, toDelete))
  } finally {
    await tempDb.destroy()
  }
}
