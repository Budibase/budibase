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
import { getWorkspaceMigrationCacheKey } from "../../../workspaceMigrations"
import { processMigrations } from "../../../workspaceMigrations/migrationsProcessor"
import backups from "../backups"
import {
  USER_METDATA_PREFIX,
  LINK_USER_METADATA_PREFIX,
} from "../../../db/utils"

export type FileAttributes = {
  type: string
  path: string
}

const DESIGN_DOCUMENTS_TO_IMPORT = [
  DesignDocuments.SQLITE,
  DesignDocuments.MIGRATIONS,
]

async function getNewWorkspaceMetadata(
  tempDb: Database,
  workspaceDb: Database
): Promise<Workspace> {
  // static doc denoting workspace information
  const docId = DocumentType.WORKSPACE_METADATA
  try {
    const [tempMetadata, workspaceMetadata] = await Promise.all([
      tempDb.get<Workspace>(docId),
      workspaceDb.get<Workspace>(docId),
    ])
    return {
      ...workspaceMetadata,
      automationErrors: undefined,
      theme: tempMetadata.theme,
      customTheme: tempMetadata.customTheme,
      snippets: tempMetadata.snippets,
      features: tempMetadata.features,
      icon: tempMetadata.icon,
      navigation: tempMetadata.navigation,
      scripts: tempMetadata.scripts,
      type: tempMetadata.type,
      version: tempMetadata.version,
    }
  } catch (err: any) {
    throw new Error(
      `Unable to retrieve workspace metadata for import - ${err.message}`
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
      response.rows
        // never delete/replace user-metadata rows or their relationship links
        .filter(
          row =>
            !row.id.startsWith(USER_METDATA_PREFIX) &&
            !row.id.startsWith(LINK_USER_METADATA_PREFIX)
        )
        .map(row => ({
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
  const uniqueMap = new Map<string, Document>()
  documentRefs.forEach(doc => {
    uniqueMap.set(doc._id!, doc)
  })
  return Array.from(uniqueMap.values()).map(ref => ({ _deleted: true, ...ref }))
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
    documents = documents.concat(
      response.rows
        // never import user-metadata rows or their relationship links
        .filter(
          row =>
            !row.id.startsWith(USER_METDATA_PREFIX) &&
            !row.id.startsWith(LINK_USER_METADATA_PREFIX)
        )
        .map(row => row.doc!)
    )
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
  workspaceId: string,
  file: FileAttributes,
  password?: string
) {
  const devId = dbCore.getDevWorkspaceID(workspaceId)
  const tempName = `temp_${devId}`
  const tempDb = dbCore.getDB(tempName)
  const workspaceDb = dbCore.getDB(devId)

  try {
    const template = {
      file: {
        type: file.type!,
        path: file.path!,
        password,
      },
    }

    await backups.importApp(devId, tempDb, template, {
      updateAttachmentColumns: false,
    })
    const newMetadata = await getNewWorkspaceMetadata(tempDb, workspaceDb)
    // get the documents to copy
    const toUpdate = await getImportableDocuments(tempDb)
    // clear out the old documents
    const toDelete = await removeImportableDocuments(workspaceDb)

    // get existing tables to ensure we only import rows for newly created tables
    const existingTablesRes = await workspaceDb.allDocs(
      dbCore.getDocParams(DocumentType.TABLE)
    )
    const existingTableIds = new Set(
      existingTablesRes.rows.map(row => row.id)
    )

    const getTableIdFromRowId = (rowId: string) => {
      // rowId format: ro_<tableId>_<uuid> where tableId is like ta_123
      const parts = rowId.split("_")
      if (parts.length >= 3) {
        return `${parts[1]}_${parts[2]}`
      }
      return null
    }

    const isRowOfExistingTable = (docId?: string) => {
      if (!docId || !docId.startsWith("ro_")) {
        return false
      }
      const tableId = getTableIdFromRowId(docId)
      return tableId ? existingTableIds.has(tableId) : false
    }

    const filteredUpdate = toUpdate.filter(
      doc => !isRowOfExistingTable(doc._id)
    )
    const filteredDelete = toDelete.filter(
      doc => !isRowOfExistingTable(doc._id)
    )

    // now bulk update documents - add new ones, delete old ones and update common ones
    const updateDocsResult = await workspaceDb.bulkDocs(
      mergeUpdateAndDeleteDocuments(filteredUpdate, filteredDelete, newMetadata)
    )
    if (updateDocsResult.some(r => r.error)) {
      throw new HTTPError("Error importing documents", 500)
    }

    await cache.destroy(getWorkspaceMigrationCacheKey(devId))
    await processMigrations(devId)
  } finally {
    await tempDb.destroy()
  }
}
