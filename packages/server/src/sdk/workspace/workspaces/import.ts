import {
  cache,
  db as dbCore,
  DesignDocuments,
  HTTPError,
} from "@budibase/backend-core"
import {
  Database,
  Document,
  DocumentType,
  DocumentTypesToImport,
  RowValue,
  Workspace,
} from "@budibase/types"
import { getAppMigrationCacheKey } from "../../../workspaceMigrations"
import { processMigrations } from "../../../workspaceMigrations/migrationsProcessor"
import backups from "../backups"

export type FileAttributes = {
  type: string
  path: string
}

const DESIGN_DOCUMENTS_TO_IMPORT = [
  DesignDocuments.SQLITE,
  DesignDocuments.MIGRATIONS,
]

async function getNewAppMetadata(
  tempDb: Database,
  appDb: Database
): Promise<Workspace> {
  // static doc denoting app information
  const docId = DocumentType.WORKSPACE_METADATA
  try {
    const [tempMetadata, appMetadata] = await Promise.all([
      tempDb.get<Workspace>(docId),
      appDb.get<Workspace>(docId),
    ])
    return {
      ...appMetadata,
      automationErrors: undefined,
      theme: tempMetadata.theme,
      customTheme: tempMetadata.customTheme,
      features: tempMetadata.features,
      icon: tempMetadata.icon,
      navigation: tempMetadata.navigation,
      type: tempMetadata.type,
      version: tempMetadata.version,
    }
  } catch (err: any) {
    throw new Error(
      `Unable to retrieve app metadata for import - ${err.message}`
    )
  }
}

function mergeUpdateAndDeleteDocuments(
  updateDocs: Document[],
  deleteDocs: Document[],
  metadata: Workspace
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

  const finalDocs = [...updateDocs, ...finalToDelete, metadata]
  return finalDocs
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

  const designDocs = await db.getMultiple(DESIGN_DOCUMENTS_TO_IMPORT, {
    allowMissing: true,
  })
  documentRefs.push(
    ...designDocs.map(doc => ({
      _id: doc._id!,
      _rev: doc._rev!,
    }))
  )

  // add deletion key
  return documentRefs.map(ref => ({ _deleted: true, ...ref }))
}

async function getImportableDocuments(db: Database) {
  // get the whole document
  const docPromises = []
  for (let docType of DocumentTypesToImport) {
    docPromises.push(
      db.allDocs<Document>(
        dbCore.getDocParams(docType, null, { include_docs: true })
      )
    )
  }

  // map the responses to the document itself
  let documents: Document[] = []
  for (let response of await Promise.all(docPromises)) {
    documents = documents.concat(response.rows.map(row => row.doc!))
  }

  const designDocs = await db.getMultiple(DESIGN_DOCUMENTS_TO_IMPORT, {
    allowMissing: true,
  })
  documents.push(...designDocs)

  // remove the _rev, stops it being written
  const uniqueMap = new Map<string, Document>()
  documents.forEach(doc => {
    delete doc._rev
    uniqueMap.set(doc._id!, doc)
  })
  return Array.from(uniqueMap.values())
}

export async function updateWithExport(
  appId: string,
  file: FileAttributes,
  password?: string
) {
  const devId = dbCore.getDevWorkspaceID(appId)
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
      updateAttachmentColumns: true,
    })
    const newMetadata = await getNewAppMetadata(tempDb, appDb)
    // get the documents to copy
    const toUpdate = await getImportableDocuments(tempDb)
    // clear out the old documents
    const toDelete = await removeImportableDocuments(appDb)
    // now bulk update documents - add new ones, delete old ones and update common ones
    const updateDocsResult = await appDb.bulkDocs(
      mergeUpdateAndDeleteDocuments(toUpdate, toDelete, newMetadata)
    )
    if (updateDocsResult.some(r => r.error)) {
      throw new HTTPError("Error importing documents", 500)
    }

    await cache.destroy(getAppMigrationCacheKey(devId))
    await processMigrations(devId)
  } finally {
    await tempDb.destroy()
  }
}
