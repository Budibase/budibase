import { FieldTypes, ObjectStoreBuckets } from "../../constants"
import { context, db as dbCore, objectStore } from "@budibase/backend-core"
import { RenameColumn, Row, RowAttachment, Table } from "@budibase/types"

export class AttachmentCleanup {
  static async coreCleanup(fileListFn: () => string[]): Promise<void> {
    const appId = context.getAppId()
    if (!dbCore.isProdAppID(appId)) {
      const prodAppId = dbCore.getProdAppID(appId!)
      // if prod exists, then don't allow deleting
      const exists = await dbCore.dbExists(prodAppId)
      if (exists) {
        return
      }
    }
    const files = fileListFn()
    if (files.length > 0) {
      await objectStore.deleteFiles(ObjectStoreBuckets.APPS, files)
    }
  }

  private static async tableChange(
    table: Table,
    rows: Row[],
    opts: { oldTable?: Table; rename?: RenameColumn; deleting?: boolean }
  ) {
    return AttachmentCleanup.coreCleanup(() => {
      let files: string[] = []
      const tableSchema = opts.oldTable?.schema || table.schema
      for (let [key, schema] of Object.entries(tableSchema)) {
        if (schema.type !== FieldTypes.ATTACHMENT) {
          continue
        }
        const columnRemoved = opts.oldTable && !table.schema[key]
        const renaming = opts.rename?.old === key
        // old table had this column, new table doesn't - delete it
        if ((columnRemoved && !renaming) || opts.deleting) {
          rows.forEach(row => {
            files = files.concat(
              row[key].map((attachment: any) => attachment.key)
            )
          })
        }
      }
      return files
    })
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
    return AttachmentCleanup.coreCleanup(() => {
      let files: string[] = []
      for (let [key, schema] of Object.entries(table.schema)) {
        if (schema.type !== FieldTypes.ATTACHMENT) {
          continue
        }
        rows.forEach(row => {
          files = files.concat(
            row[key].map((attachment: any) => attachment.key)
          )
        })
      }
      return files
    })
  }

  static rowUpdate(table: Table, opts: { row: Row; oldRow: Row }) {
    return AttachmentCleanup.coreCleanup(() => {
      let files: string[] = []
      for (let [key, schema] of Object.entries(table.schema)) {
        if (schema.type !== FieldTypes.ATTACHMENT) {
          continue
        }
        const oldKeys =
          opts.oldRow[key]?.map(
            (attachment: RowAttachment) => attachment.key
          ) || []
        const newKeys =
          opts.row[key]?.map((attachment: RowAttachment) => attachment.key) ||
          []
        files = files.concat(
          oldKeys.filter((key: string) => newKeys.indexOf(key) === -1)
        )
      }
      return files
    })
  }
}
