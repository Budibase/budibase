import { context, db as dbCore, objectStore } from "@budibase/backend-core"
import {
  FieldType,
  RenameColumn,
  Row,
  RowAttachment,
  Table,
} from "@budibase/types"
import { ObjectStoreBuckets } from "../../constants"

export class AttachmentCleanup {
  static async coreCleanup(
    fileListFn: () => string[] | Promise<string[]>,
    opts: { tableId?: string; schema?: Table["schema"]; rowId?: string } = {}
  ): Promise<void> {
    let files = await Promise.resolve(fileListFn())
    if (files.length === 0) {
      return
    }

    const appId = context.getWorkspaceId()
    if (!dbCore.isProdWorkspaceID(appId)) {
      const prodAppId = dbCore.getProdWorkspaceID(appId!)
      const exists = await dbCore.dbExists(prodAppId)
      if (exists) {
        if (!opts.rowId) {
          return
        }
        files = await AttachmentCleanup.excludeFilesUsedInProd(
          opts.rowId,
          files,
          prodAppId,
          opts
        )
        if (files.length === 0) {
          return
        }
      }
    }

    await objectStore.deleteFiles(ObjectStoreBuckets.APPS, files)
  }

  private static async excludeFilesUsedInProd(
    rowId: string,
    files: string[],
    prodAppId: string,
    opts: { tableId?: string; schema?: Table["schema"] }
  ): Promise<string[]> {
    const { tableId, schema } = opts
    if (!tableId || !schema) {
      return files
    }

    const prodDb = dbCore.getDB(prodAppId)
    const response = await prodDb.tryGet(rowId)
    const usedKeys = new Set<string>()
    if (!response) {
      return files
    }

    const row = response as Row
    for (const [key, column] of Object.entries(schema)) {
      const columnKeys = AttachmentCleanup.extractAttachmentKeys(
        column.type,
        row[key]
      )
      columnKeys.forEach(value => usedKeys.add(value))
    }

    return files.filter(file => !usedKeys.has(file))
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

  private static async tableChange(
    table: Table,
    rows: Row[],
    opts: { oldTable?: Table; rename?: RenameColumn; deleting?: boolean }
  ) {
    const tableSchema = opts.oldTable?.schema || table.schema
    return AttachmentCleanup.coreCleanup(
      () =>
        Object.entries(tableSchema).reduce<string[]>((files, [key, schema]) => {
          if (
            schema.type !== FieldType.ATTACHMENTS &&
            schema.type !== FieldType.ATTACHMENT_SINGLE &&
            schema.type !== FieldType.SIGNATURE_SINGLE
          ) {
            return files
          }

          const columnRemoved = opts.oldTable && !table.schema[key]
          const renaming = opts.rename?.old === key
          if ((columnRemoved && !renaming) || opts.deleting) {
            rows.forEach(row => {
              const keys = AttachmentCleanup.extractAttachmentKeys(
                schema.type,
                row[key]
              )
              files.push(...keys)
            })
          }

          return files
        }, []),
      {
        tableId: table._id,
        schema: tableSchema,
      }
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
    for (const row of rows) {
      await AttachmentCleanup.coreCleanup(
        () =>
          Object.entries(table.schema).reduce<string[]>(
            (files, [key, schema]) => {
              if (
                schema.type !== FieldType.ATTACHMENTS &&
                schema.type !== FieldType.ATTACHMENT_SINGLE &&
                schema.type !== FieldType.SIGNATURE_SINGLE
              ) {
                return files
              }
              const columnFiles = AttachmentCleanup.extractAttachmentKeys(
                schema.type,
                row[key]
              )
              return files.concat(columnFiles)
            },
            []
          ),
        {
          tableId: table._id,
          schema: table.schema,
          rowId: row._id,
        }
      )
    }
  }

  static async rowUpdate(table: Table, opts: { row: Row; oldRow: Row }) {
    await AttachmentCleanup.coreCleanup(
      () =>
        Object.entries(table.schema).reduce<string[]>(
          (files, [key, schema]) => {
            if (
              schema.type !== FieldType.ATTACHMENTS &&
              schema.type !== FieldType.ATTACHMENT_SINGLE &&
              schema.type !== FieldType.SIGNATURE_SINGLE
            ) {
              return files
            }

            const oldKeys = AttachmentCleanup.extractAttachmentKeys(
              schema.type,
              opts.oldRow[key]
            )
            const newKeys = AttachmentCleanup.extractAttachmentKeys(
              schema.type,
              opts.row[key]
            )
            const columnFiles = oldKeys.filter(
              (key: string) => newKeys.indexOf(key) === -1
            )
            return files.concat(columnFiles)
          },
          []
        ),
      {
        tableId: table._id,
        schema: table.schema,
        rowId: opts.row._id,
      }
    )
  }
}
