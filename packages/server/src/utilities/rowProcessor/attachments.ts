import { context, db as dbCore, objectStore } from "@budibase/backend-core"
import {
  FieldType,
  RenameColumn,
  Row,
  RowAttachment,
  Table,
} from "@budibase/types"
import { ObjectStoreBuckets } from "../../constants"

interface CoreCleanupOpts {
  table?: Table
  oldTable?: Table
  rows?: Row[]
}

interface FilterDevWorkspaceOpts extends CoreCleanupOpts {
  prodAppId: string
}

export class AttachmentCleanup {
  static async coreCleanup(
    fileListFn: () => string[],
    opts?: CoreCleanupOpts
  ): Promise<void> {
    const files = Array.from(new Set(fileListFn().filter(Boolean)))
    if (files.length === 0) {
      return
    }

    const appId = context.getWorkspaceId()
    let filesToDelete = files

    if (!dbCore.isProdWorkspaceID(appId)) {
      const prodAppId = dbCore.getProdWorkspaceID(appId!)
      const prodExists = await dbCore.dbExists(prodAppId)
      if (prodExists) {
        filesToDelete = await AttachmentCleanup.filterDevWorkspaceFiles(files, {
          prodAppId,
          table: opts?.table,
          oldTable: opts?.oldTable,
          rows: opts?.rows,
        })
        if (filesToDelete.length === 0) {
          return
        }
      }
    }

    await objectStore.deleteFiles(ObjectStoreBuckets.APPS, filesToDelete)
  }

  private static extractAttachmentKeys(
    type: FieldType,
    rowData: RowAttachment[] | RowAttachment
  ): string[] {
    if (
      type !== FieldType.ATTACHMENTS &&
      type !== FieldType.ATTACHMENT_SINGLE &&
      type !== FieldType.SIGNATURE_SINGLE
    ) {
      return []
    }

    if (!rowData) {
      return []
    }

    if (type === FieldType.ATTACHMENTS && Array.isArray(rowData)) {
      return rowData
        .filter(attachment => attachment.key)
        .map(attachment => attachment.key!)
    } else if ("key" in rowData && rowData.key) {
      return [rowData.key]
    }

    return []
  }

  private static isAttachmentType(type: FieldType) {
    return (
      type === FieldType.ATTACHMENTS ||
      type === FieldType.ATTACHMENT_SINGLE ||
      type === FieldType.SIGNATURE_SINGLE
    )
  }

  private static collectAttachmentColumns(
    ...tables: (Table | undefined)[]
  ): Map<string, FieldType> {
    const attachmentColumns = new Map<string, FieldType>()
    for (const table of tables) {
      if (!table?.schema) {
        continue
      }
      for (const [column, schema] of Object.entries(table.schema)) {
        if (AttachmentCleanup.isAttachmentType(schema.type)) {
          attachmentColumns.set(column, schema.type)
        }
      }
    }
    return attachmentColumns
  }

  private static async filterDevWorkspaceFiles(
    files: string[],
    opts: FilterDevWorkspaceOpts
  ): Promise<string[]> {
    const uniqueKeys = new Set(files)
    if (uniqueKeys.size === 0) {
      return []
    }

    const rowsWithIds = (opts.rows || []).filter(
      (row): row is Row => typeof row?._id === "string"
    )

    if (rowsWithIds.length === 0) {
      return Array.from(uniqueKeys)
    }

    const attachmentColumns = AttachmentCleanup.collectAttachmentColumns(
      opts.table,
      opts.oldTable
    )

    if (attachmentColumns.size === 0) {
      return Array.from(uniqueKeys)
    }

    const prodDb = dbCore.getDB(opts.prodAppId)

    for (const row of rowsWithIds) {
      if (uniqueKeys.size === 0) {
        break
      }
      try {
        const prodRow = await prodDb.get<Row>(row._id)
        for (const [column, type] of attachmentColumns.entries()) {
          const value = (prodRow as any)[column]
          const keys = AttachmentCleanup.extractAttachmentKeys(type, value)
          for (const key of keys) {
            if (uniqueKeys.has(key)) {
              uniqueKeys.delete(key)
            }
          }
        }
      } catch (err: any) {
        if (err?.status === 404 || err?.code === "not_found") {
          continue
        }
        throw err
      }
    }

    return Array.from(uniqueKeys)
  }

  private static async tableChange(
    table: Table,
    rows: Row[],
    opts: { oldTable?: Table; rename?: RenameColumn; deleting?: boolean }
  ) {
    return AttachmentCleanup.coreCleanup(
      () => {
        let files: string[] = []
        const tableSchema = opts.oldTable?.schema || table.schema
        for (let [key, schema] of Object.entries(tableSchema)) {
          if (
            schema.type !== FieldType.ATTACHMENTS &&
            schema.type !== FieldType.ATTACHMENT_SINGLE &&
            schema.type !== FieldType.SIGNATURE_SINGLE
          ) {
            continue
          }

          const columnRemoved = opts.oldTable && !table.schema[key]
          const renaming = opts.rename?.old === key
          // old table had this column, new table doesn't - delete it
          if ((columnRemoved && !renaming) || opts.deleting) {
            rows.forEach(row => {
              files = files.concat(
                AttachmentCleanup.extractAttachmentKeys(schema.type, row[key])
              )
            })
          }
        }
        return files
      },
      { table, oldTable: opts.oldTable, rows }
    )
  }

  static async tableDelete(table: Table, rows: Row[]) {
    return AttachmentCleanup.tableChange(table, rows, { deleting: true })
  }

  static async tableUpdate(
    table: Table,
    rows: Row[],
    opts: { oldTable?: Table; rename?: RenameColumn }
  ) {
    return AttachmentCleanup.tableChange(table, rows, opts)
  }

  static async rowDelete(table: Table, rows: Row[]) {
    return AttachmentCleanup.coreCleanup(
      () => {
        let files: string[] = []
        for (let [key, schema] of Object.entries(table.schema)) {
          if (
            schema.type !== FieldType.ATTACHMENTS &&
            schema.type !== FieldType.ATTACHMENT_SINGLE &&
            schema.type !== FieldType.SIGNATURE_SINGLE
          ) {
            continue
          }

          rows.forEach(row => {
            files = files.concat(
              AttachmentCleanup.extractAttachmentKeys(schema.type, row[key])
            )
          })
        }
        return files
      },
      { table, rows }
    )
  }

  static rowUpdate(table: Table, opts: { row: Row; oldRow: Row }) {
    return AttachmentCleanup.coreCleanup(
      () => {
        let files: string[] = []
        for (let [key, schema] of Object.entries(table.schema)) {
          if (
            schema.type !== FieldType.ATTACHMENTS &&
            schema.type !== FieldType.ATTACHMENT_SINGLE &&
            schema.type !== FieldType.SIGNATURE_SINGLE
          ) {
            continue
          }

          const oldKeys = AttachmentCleanup.extractAttachmentKeys(
            schema.type,
            opts.oldRow[key]
          )
          const newKeys = AttachmentCleanup.extractAttachmentKeys(
            schema.type,
            opts.row[key]
          )
          files = files.concat(
            oldKeys.filter((key: string) => newKeys.indexOf(key) === -1)
          )
        }
        return files
      },
      { table, rows: [opts.oldRow] }
    )
  }
}
