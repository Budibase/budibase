import {
  FieldType,
  RenameColumn,
  Table,
  ViewStatisticsSchema,
  ViewV2,
  Row,
  TableSourceType,
} from "@budibase/types"
import {
  hasTypeChanged,
  TableSaveFunctions,
  internalTableCleanup,
} from "../../../../api/controllers/table/utils"
import { EventType, updateLinks } from "../../../../db/linkedRows"
import { cloneDeep } from "lodash/fp"
import isEqual from "lodash/isEqual"
import { runStaticFormulaChecks } from "../../../../api/controllers/table/bulkFormula"
import { context, HTTPError } from "@budibase/backend-core"
import { findDuplicateInternalColumns } from "@budibase/shared-core"
import { getTable } from "../getters"
import { checkAutoColumns } from "./utils"
import * as viewsSdk from "../../views"
import { generateTableID, getRowParams } from "../../../../db/utils"
import { quotas } from "@budibase/pro"

export async function create(
  table: Omit<Table, "_id" | "_rev">,
  rows?: Row[],
  userId?: string
) {
  const tableId = generateTableID()

  let tableToSave: Table = {
    _id: tableId,
    ...table,
    // Ensure these fields are populated, even if not sent in the request
    type: table.type || "table",
    sourceType: TableSourceType.INTERNAL,
  }

  const isImport = !!rows

  if (!tableToSave.views) {
    tableToSave.views = {}
  }

  try {
    const { table } = await save(tableToSave, {
      userId,
      rowsToImport: rows,
      isImport,
    })

    return table
  } catch (err: any) {
    if (err instanceof Error) {
      throw new HTTPError(err.message, 400)
    } else {
      throw new HTTPError(err.message || err, err.status || 500)
    }
  }
}

export async function save(
  table: Table,
  opts?: {
    userId?: string
    tableId?: string
    rowsToImport?: Row[]
    renaming?: RenameColumn
    isImport?: boolean
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

  // check for case sensitivity - we don't want to allow duplicated columns
  const duplicateColumn = findDuplicateInternalColumns(table)
  if (duplicateColumn.length) {
    throw new Error(
      `Column(s) "${duplicateColumn.join(
        ", "
      )}" are duplicated - check for other columns with these name (case in-sensitive)`
    )
  }

  // check that subtypes have been maintained
  table = checkAutoColumns(table, oldTable)

  // saving a table is a complex operation, involving many different steps, this
  // has been broken out into a utility to make it more obvious/easier to manipulate
  const tableSaveFunctions = new TableSaveFunctions({
    userId: opts?.userId,
    oldTable,
    importRows: opts?.rowsToImport,
  })
  table = await tableSaveFunctions.before(table)

  let renaming = opts?.renaming
  if (renaming && renaming.old === renaming.updated) {
    renaming = undefined
  }

  // rename row fields when table column is renamed
  if (renaming && table.schema[renaming.updated].type === FieldType.LINK) {
    throw new Error("Cannot rename a linked column.")
  }

  table = await tableSaveFunctions.mid(table, renaming)

  // update schema of non-statistics views when new columns are added
  for (let view in table.views) {
    const tableView = table.views[view]
    if (!tableView) continue

    if (viewsSdk.isV2(tableView)) {
      if (oldTable?.views && oldTable.views[view]) {
        table.views[view] = viewsSdk.syncSchema(
          oldTable.views[view] as ViewV2,
          table.schema,
          renaming
        )
      }
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
  return { table, oldTable }
}

export async function destroy(table: Table) {
  const db = context.getAppDB()
  const tableId = table._id!

  // Delete all rows for that table - we have to retrieve the full rows for
  // attachment cleanup, this may be worth investigating if there is a better
  // way - we could delete all rows without the `include_docs` which would be faster
  const rows = (
    await db.allDocs<Row>(
      getRowParams(tableId, null, {
        include_docs: true,
      })
    )
  ).rows.map(data => data.doc!)
  await db.bulkDocs(rows.map((row: Row) => ({ ...row, _deleted: true })))

  // remove rows from quota
  await quotas.removeRows(rows.length, {
    tableId,
  })

  // update linked rows
  await updateLinks({
    eventType: EventType.TABLE_DELETE,
    table: table,
  })

  // don't remove the table itself until very end
  await db.remove(tableId, table._rev)

  // final cleanup, attachments, indexes, SQS
  await internalTableCleanup(table, rows)

  return { table }
}
