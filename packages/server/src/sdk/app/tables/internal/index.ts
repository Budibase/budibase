import {
  RenameColumn,
  Table,
  ViewStatisticsSchema,
  ViewV2,
  Row,
  ContextUser,
} from "@budibase/types"
import {
  hasTypeChanged,
  TableSaveFunctions,
} from "../../../../api/controllers/table/utils"
import { FieldTypes } from "../../../../constants"
import { EventType, updateLinks } from "../../../../db/linkedRows"
import { cloneDeep } from "lodash/fp"
import isEqual from "lodash/isEqual"
import { runStaticFormulaChecks } from "../../../../api/controllers/table/bulkFormula"
import { context } from "@budibase/backend-core"
import { getTable } from "../getters"
import { checkAutoColumns } from "./utils"
import * as viewsSdk from "../../views"
import { getRowParams } from "../../../../db/utils"
import { quotas } from "@budibase/pro"
import env from "../../../../environment"
import { AttachmentCleanup } from "../../../../utilities/rowProcessor"

export async function save(
  table: Table,
  opts?: {
    user?: ContextUser
    tableId?: string
    rowsToImport?: Row[]
    renaming?: RenameColumn
  }
) {
  const db = context.getAppDB()

  // if the table obj had an _id then it will have been retrieved
  let oldTable: Table | undefined
  if (opts?.tableId) {
    oldTable = await getTable(opts.tableId)
  }

  // check all types are correct
  if (hasTypeChanged(table, oldTable)) {
    throw new Error("A column type has changed.")
  }
  // check that subtypes have been maintained
  table = checkAutoColumns(table, oldTable)

  // saving a table is a complex operation, involving many different steps, this
  // has been broken out into a utility to make it more obvious/easier to manipulate
  const tableSaveFunctions = new TableSaveFunctions({
    user: opts?.user,
    oldTable,
    importRows: opts?.rowsToImport,
  })
  table = await tableSaveFunctions.before(table)

  let renaming = opts?.renaming
  if (renaming && renaming.old === renaming.updated) {
    renaming = undefined
  }

  // rename row fields when table column is renamed
  if (renaming && table.schema[renaming.updated].type === FieldTypes.LINK) {
    throw new Error("Cannot rename a linked column.")
  }

  table = await tableSaveFunctions.mid(table, renaming)

  // update schema of non-statistics views when new columns are added
  for (let view in table.views) {
    const tableView = table.views[view]
    if (!tableView) continue

    if (viewsSdk.isV2(tableView)) {
      table.views[view] = viewsSdk.syncSchema(
        oldTable!.views![view] as ViewV2,
        table.schema,
        renaming
      )
      continue
    }

    if (
      (tableView.schema as ViewStatisticsSchema).group ||
      tableView.schema.field
    )
      continue
    tableView.schema = table.schema
  }

  // update linked rows
  const linkResp: any = await updateLinks({
    eventType: oldTable ? EventType.TABLE_UPDATED : EventType.TABLE_SAVE,
    table: table,
    oldTable: oldTable,
  })
  if (linkResp != null && linkResp._rev) {
    table._rev = linkResp._rev
  }

  // don't perform any updates until relationships have been
  // checked by the updateLinks function
  const updatedRows = tableSaveFunctions.getUpdatedRows()
  if (updatedRows && updatedRows.length !== 0) {
    await db.bulkDocs(updatedRows)
  }
  let result = await db.put(table)
  table._rev = result.rev
  const savedTable = cloneDeep(table)

  table = await tableSaveFunctions.after(table)
  // the table may be updated as part of the table save after functionality - need to write it
  if (!isEqual(savedTable, table)) {
    result = await db.put(table)
    table._rev = result.rev
  }
  // has to run after, make sure it has _id
  await runStaticFormulaChecks(table, { oldTable, deletion: false })
  return { table }
}

export async function destroy(table: Table) {
  const db = context.getAppDB()
  const tableId = table._id!

  // Delete all rows for that table
  const rowsData = await db.allDocs(
    getRowParams(tableId, null, {
      include_docs: true,
    })
  )
  await db.bulkDocs(
    rowsData.rows.map((row: any) => ({ ...row.doc, _deleted: true }))
  )
  await quotas.removeRows(rowsData.rows.length, {
    tableId,
  })

  // update linked rows
  await updateLinks({
    eventType: EventType.TABLE_DELETE,
    table: table,
  })

  // don't remove the table itself until very end
  await db.remove(tableId, table._rev)

  // remove table search index
  if (!env.isTest() || env.COUCH_DB_URL) {
    const currentIndexes = await db.getIndexes()
    const existingIndex = currentIndexes.indexes.find(
      (existing: any) => existing.name === `search:${tableId}`
    )
    if (existingIndex) {
      await db.deleteIndex(existingIndex)
    }
  }

  // has to run after, make sure it has _id
  await runStaticFormulaChecks(table, {
    deletion: true,
  })
  await AttachmentCleanup.tableDelete(
    table,
    rowsData.rows.map((row: any) => row.doc)
  )

  return { table }
}
