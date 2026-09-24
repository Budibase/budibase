import {
  context,
  db,
  HTTPError,
  objectStore,
  utils,
} from "@budibase/backend-core"
import {
  AutoFieldSubType,
  BBReferenceFieldSubType,
  DocumentType,
  FieldType,
  INTERNAL_TABLE_SOURCE_ID,
  InternalTable,
  type LinkDocument,
  type LinkInfo,
  type ProjectDataImportSummary,
  type ProjectPackageAttachment,
  type ProjectPackageData,
  type ProjectPackageRelationship,
  type ProjectPackageUnsupportedContent,
  type Row,
  type RowAttachment,
  SEPARATOR,
  type Table,
} from "@budibase/types"
import fs from "fs"
import fsp from "fs/promises"
import { extname, join } from "path"
import { Transform } from "stream"
import { pipeline } from "stream/promises"
import { ObjectStoreBuckets } from "../../../../constants"
import LinkDocumentImpl from "../../../../db/linkedRows/LinkDocument"
import { getLinkDocuments } from "../../../../db/linkedRows/linkUtils"
import { generateRowID, getRowParams } from "../../../../db/utils"
import {
  MAX_PROJECT_EXTRACTED_SIZE_BYTES,
  MAX_PROJECT_PACKAGE_FILES,
  PROJECT_ATTACHMENTS_DIRECTORY,
} from "./constants"

const ROW_PAGE_SIZE = 1000
const invalidData = (message: string) =>
  new HTTPError(`Project package data ${message}.`, 400)

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value)

const internalTables = (tables: Table[]) =>
  new Map(
    tables
      .filter(
        table =>
          table._id &&
          table._id !== InternalTable.USER_METADATA &&
          table.sourceId === INTERNAL_TABLE_SOURCE_ID
      )
      .map(table => [table._id!, table])
  )

const isSourceAttachmentKey = ({
  key,
  workspaceId,
}: {
  key: string
  workspaceId: string
}) =>
  key.startsWith(`${db.getProdWorkspaceID(workspaceId)}/attachments/`) &&
  !key.includes("\\") &&
  key.split("/").every(part => part && part !== "." && part !== "..")

const mapRowAttachments = ({
  row,
  table,
  map,
}: {
  row: Row
  table: Table
  map: (attachment: RowAttachment) => RowAttachment
}) => {
  const mapAttachment = (value: unknown): RowAttachment => {
    if (
      !isRecord(value) ||
      typeof value.key !== "string" ||
      !value.key ||
      typeof value.name !== "string" ||
      typeof value.extension !== "string" ||
      typeof value.size !== "number" ||
      !Number.isFinite(value.size) ||
      value.size < 0
    ) {
      throw invalidData("contains an invalid attachment")
    }
    return map({
      key: value.key,
      name: value.name,
      extension: value.extension,
      size: value.size,
    })
  }

  for (const [name, field] of Object.entries(table.schema)) {
    const value: unknown = row[name]
    if (value == null || value === "") {
      continue
    }
    if (field.type === FieldType.ATTACHMENTS) {
      if (!Array.isArray(value)) {
        throw invalidData("contains an invalid attachment list")
      }
      row[name] = value.map(mapAttachment)
    } else if (
      field.type === FieldType.ATTACHMENT_SINGLE ||
      field.type === FieldType.SIGNATURE_SINGLE
    ) {
      row[name] = mapAttachment(value)
    }
  }
}

const copyRow = (row: Row): Row => {
  const copy = structuredClone(row)
  delete copy._rev
  delete copy._deleted
  delete copy._attachments
  delete copy._viewId
  delete copy.fromWorkspace
  return copy
}

const isLinkInfo = (value: unknown): value is LinkInfo =>
  isRecord(value) &&
  typeof value.tableId === "string" &&
  typeof value.rowId === "string" &&
  typeof value.fieldName === "string"

const relationshipDocument = ({ doc1, doc2 }: ProjectPackageRelationship) =>
  new LinkDocumentImpl(
    doc1.tableId,
    doc1.fieldName,
    doc1.rowId,
    doc2.tableId,
    doc2.fieldName,
    doc2.rowId
  )

export const exportProjectData = async ({
  workspaceId,
  tables,
  dirPath,
}: {
  workspaceId: string
  tables: Table[]
  dirPath: string
}): Promise<{
  data: ProjectPackageData
  unsupportedContent: ProjectPackageUnsupportedContent[]
}> => {
  const selectedTables = internalTables(tables)
  const data: ProjectPackageData = {
    rows: [],
    relationships: [],
    attachments: [],
  }
  const attachments = new Map<string, ProjectPackageAttachment>()
  const rowIds = new Set<string>()
  let bytes = 0
  const accountBytes = (size: number) => {
    bytes += size
    if (bytes > MAX_PROJECT_EXTRACTED_SIZE_BYTES) {
      throw invalidData("exceeds the package size limit")
    }
  }

  for (const [tableId, table] of selectedTables) {
    let startAfter: string | undefined
    while (true) {
      const result = await context.getWorkspaceDB().allDocs<Row>(
        getRowParams(tableId, null, {
          include_docs: true,
          limit: ROW_PAGE_SIZE,
          ...(startAfter ? { startkey: startAfter, skip: 1 } : {}),
        })
      )
      for (const entry of result.rows) {
        const row = copyRow(entry.doc!)
        mapRowAttachments({
          row,
          table,
          map: attachment => {
            const key = attachment.key!
            if (!isSourceAttachmentKey({ key, workspaceId })) {
              throw invalidData(
                "references an attachment outside its workspace"
              )
            }
            if (!attachments.has(key)) {
              if (attachments.size >= MAX_PROJECT_PACKAGE_FILES) {
                throw invalidData("contains too many attachments")
              }
              attachments.set(key, {
                key,
                path: `${PROJECT_ATTACHMENTS_DIRECTORY}/${utils.newid()}`,
              })
            }
            return attachment
          },
        })
        accountBytes(Buffer.byteLength(JSON.stringify(row)))
        data.rows.push(row)
        rowIds.add(row._id!)
      }
      if (result.rows.length < ROW_PAGE_SIZE) {
        break
      }
      startAfter = result.rows[result.rows.length - 1].id
    }
  }

  const seenLinks = new Set<string>()
  let excludedRelationships = 0
  for (const tableId of selectedTables.keys()) {
    const links = await getLinkDocuments({ tableId, includeDocs: true })
    for (const link of links) {
      if (seenLinks.has(link._id!)) {
        continue
      }
      seenLinks.add(link._id!)
      if (
        !selectedTables.has(link.doc1.tableId) ||
        !selectedTables.has(link.doc2.tableId) ||
        !rowIds.has(link.doc1.rowId) ||
        !rowIds.has(link.doc2.rowId)
      ) {
        excludedRelationships++
        continue
      }
      const relationship = { doc1: link.doc1, doc2: link.doc2 }
      accountBytes(Buffer.byteLength(JSON.stringify(relationship)))
      data.relationships.push(relationship)
    }
  }

  if (attachments.size) {
    await fsp.mkdir(join(dirPath, PROJECT_ATTACHMENTS_DIRECTORY))
  }
  for (const attachment of attachments.values()) {
    const { stream, contentType } = await objectStore.getReadStream(
      ObjectStoreBuckets.APPS,
      attachment.key
    )
    attachment.contentType = contentType
    await pipeline(
      stream,
      new Transform({
        transform(chunk: Buffer, _encoding, callback) {
          try {
            accountBytes(chunk.length)
            callback(null, chunk)
          } catch (error) {
            callback(error as Error)
          }
        },
      }),
      fs.createWriteStream(join(dirPath, attachment.path))
    )
    data.attachments.push(attachment)
  }
  return {
    data,
    unsupportedContent: excludedRelationships
      ? [
          {
            type: "excluded_row_relationship",
            count: excludedRelationships,
            reason:
              "Row relationships to data outside this Project were omitted.",
          },
        ]
      : [],
  }
}

export const validateProjectData = ({
  data,
  tables,
  sourceWorkspaceId,
  attachmentPaths,
}: {
  data: unknown
  tables: Table[]
  sourceWorkspaceId: string
  attachmentPaths: string[]
}): ProjectPackageData => {
  if (
    !isRecord(data) ||
    !Array.isArray(data.rows) ||
    !Array.isArray(data.relationships) ||
    !Array.isArray(data.attachments)
  ) {
    throw invalidData("is invalid")
  }
  const selectedTables = internalTables(tables)
  const rows: Row[] = []
  const rowTableIds = new Map<string, string>()
  const referencedKeys = new Set<string>()
  for (const row of data.rows) {
    if (
      !isRecord(row) ||
      typeof row._id !== "string" ||
      typeof row.tableId !== "string" ||
      !selectedTables.has(row.tableId) ||
      !row._id.startsWith(
        `${DocumentType.ROW}${SEPARATOR}${row.tableId}${SEPARATOR}`
      ) ||
      rowTableIds.has(row._id)
    ) {
      throw invalidData("contains an invalid or duplicate row")
    }
    rowTableIds.set(row._id, row.tableId)
    const copied = copyRow(row)
    mapRowAttachments({
      row: copied,
      table: selectedTables.get(row.tableId)!,
      map: attachment => {
        referencedKeys.add(attachment.key!)
        return attachment
      },
    })
    rows.push(copied)
  }

  const relationships: ProjectPackageRelationship[] = []
  const linkIds = new Set<string>()
  for (const relationship of data.relationships) {
    if (
      !isRecord(relationship) ||
      !isLinkInfo(relationship.doc1) ||
      !isLinkInfo(relationship.doc2)
    ) {
      throw invalidData("contains an invalid relationship")
    }
    const { doc1, doc2 } = relationship
    for (const [endpoint, other] of [
      [doc1, doc2],
      [doc2, doc1],
    ]) {
      const field = selectedTables.get(endpoint.tableId)?.schema[
        endpoint.fieldName
      ]
      if (
        rowTableIds.get(endpoint.rowId) !== endpoint.tableId ||
        field?.type !== FieldType.LINK ||
        field.tableId !== other.tableId ||
        field.fieldName !== other.fieldName
      ) {
        throw invalidData(
          "contains a relationship outside its rows or table schema"
        )
      }
    }
    const linkId = [doc1, doc2]
      .map(endpoint =>
        JSON.stringify([endpoint.tableId, endpoint.fieldName, endpoint.rowId])
      )
      .sort()
      .join()
    if (linkIds.has(linkId)) {
      throw invalidData("contains a duplicate relationship")
    }
    linkIds.add(linkId)
    relationships.push({ doc1, doc2 })
  }

  const attachments: ProjectPackageAttachment[] = []
  const indexedPaths = new Set<string>()
  for (const attachment of data.attachments) {
    if (
      !isRecord(attachment) ||
      typeof attachment.key !== "string" ||
      !isSourceAttachmentKey({
        key: attachment.key,
        workspaceId: sourceWorkspaceId,
      }) ||
      typeof attachment.path !== "string" ||
      !/^attachments\/[A-Za-z0-9_-]+$/.test(attachment.path) ||
      (attachment.contentType !== undefined &&
        typeof attachment.contentType !== "string") ||
      !referencedKeys.delete(attachment.key) ||
      indexedPaths.has(attachment.path)
    ) {
      throw invalidData("contains an invalid or unreferenced attachment")
    }
    indexedPaths.add(attachment.path)
    attachments.push({
      key: attachment.key,
      path: attachment.path,
      contentType: attachment.contentType,
    })
  }
  if (
    referencedKeys.size ||
    indexedPaths.size !== attachmentPaths.length ||
    attachmentPaths.some(path => !indexedPaths.has(path))
  ) {
    throw invalidData("attachments do not match the included files")
  }
  return { rows, relationships, attachments }
}

interface ProjectDataAttachmentUpload {
  path: string
  key: string
  contentType?: string
}

export const prepareProjectData = ({
  data,
  tables,
  idMap,
  workspaceId,
  userId,
}: {
  data: ProjectPackageData
  tables: Table[]
  idMap: Map<string, string>
  workspaceId: string
  userId?: string
}): {
  rows: Row[]
  relationships: LinkDocument[]
  attachments: ProjectDataAttachmentUpload[]
  summary: ProjectDataImportSummary
} => {
  const selectedTables = internalTables(tables)
  const importingUserId = userId && db.getGlobalIDFromUserMetadataID(userId)
  for (const row of data.rows) {
    const tableId = idMap.get(row.tableId!)
    if (!tableId) {
      throw invalidData("could not map an imported table")
    }
    const destinationRowId = generateRowID(tableId)
    idMap.set(row._id!, destinationRowId)
  }
  const attachmentKeyMap = new Map<string, string>()
  const attachments = data.attachments.map(attachment => {
    const sourceExtension = extname(attachment.key)
    const extension = /^\.[A-Za-z0-9]{1,16}$/.test(sourceExtension)
      ? sourceExtension
      : ""
    const key = `${db.getProdWorkspaceID(workspaceId)}/attachments/${utils.newid()}${extension}`
    attachmentKeyMap.set(attachment.key, key)
    return { path: attachment.path, contentType: attachment.contentType, key }
  })
  const rows = data.rows.map(source => {
    const table = selectedTables.get(source.tableId!)!
    const row = copyRow(source)
    row._id = idMap.get(source._id!)!
    row.tableId = idMap.get(source.tableId!)!
    mapRowAttachments({
      row,
      table,
      map: attachment => ({
        ...attachment,
        key: attachmentKeyMap.get(attachment.key!)!,
      }),
    })
    for (const [name, field] of Object.entries(table.schema)) {
      const userReference =
        ((field.type === FieldType.BB_REFERENCE ||
          field.type === FieldType.BB_REFERENCE_SINGLE) &&
          (field.subtype === BBReferenceFieldSubType.USER ||
            field.subtype === BBReferenceFieldSubType.USERS)) ||
        (field.autocolumn &&
          (field.subtype === AutoFieldSubType.CREATED_BY ||
            field.subtype === AutoFieldSubType.UPDATED_BY))
      const value: unknown = row[name]
      if (
        !userReference ||
        value == null ||
        value === "" ||
        (Array.isArray(value) && !value.length)
      ) {
        continue
      }
      if (!importingUserId) {
        throw invalidData("requires an importing user for its user references")
      }
      row[name] =
        field.type === FieldType.BB_REFERENCE_SINGLE
          ? importingUserId
          : [importingUserId]
    }
    return row
  })
  const remapEndpoint = (endpoint: LinkInfo): LinkInfo => ({
    ...endpoint,
    tableId: idMap.get(endpoint.tableId)!,
    rowId: idMap.get(endpoint.rowId)!,
  })
  const relationships = data.relationships.map(({ doc1, doc2 }) =>
    relationshipDocument({
      doc1: remapEndpoint(doc1),
      doc2: remapEndpoint(doc2),
    })
  )
  return {
    rows,
    relationships,
    attachments,
    summary: {
      tables: new Set(rows.map(row => row.tableId)).size,
      rows: rows.length,
      relationships: relationships.length,
      attachments: attachments.length,
    },
  }
}
