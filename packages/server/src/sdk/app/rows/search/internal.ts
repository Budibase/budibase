import {
  context,
  db,
  SearchParams as InternalSearchParams,
} from "@budibase/backend-core"
import env from "../../../../environment"
import { fullSearch, paginatedSearch } from "./internalSearch"
import {
  InternalTables,
  getRowParams,
  DocumentType,
} from "../../../../db/utils"
import { getGlobalUsersFromMetadata } from "../../../../utilities/global"
import { outputProcessing } from "../../../../utilities/rowProcessor"
import { Database, Row, Table, SearchParams } from "@budibase/types"
import { cleanExportRows } from "../utils"
import {
  Format,
  csv,
  json,
  jsonWithSchema,
} from "../../../../api/controllers/view/exporters"
import * as inMemoryViews from "../../../../db/inMemoryView"
import {
  migrateToInMemoryView,
  migrateToDesignView,
  getFromDesignDoc,
  getFromMemoryDoc,
} from "../../../../api/controllers/view/utils"
import sdk from "../../../../sdk"
import { ExportRowsParams, ExportRowsResult } from "../search"
import { searchInputMapping } from "./utils"
import pick from "lodash/pick"

export async function search(options: SearchParams) {
  const { tableId } = options

  const { paginate, query } = options

  const params: InternalSearchParams<any> = {
    tableId: options.tableId,
    sort: options.sort,
    sortOrder: options.sortOrder,
    sortType: options.sortType,
    limit: options.limit,
    bookmark: options.bookmark,
    version: options.version,
    disableEscaping: options.disableEscaping,
  }

  let table = await sdk.tables.getTable(tableId)
  options = searchInputMapping(table, options)
  if (params.sort && !params.sortType) {
    const schema = table.schema
    const sortField = schema[params.sort]
    params.sortType = sortField.type === "number" ? "number" : "string"
  }

  let response
  if (paginate) {
    response = await paginatedSearch(query, params)
  } else {
    response = await fullSearch(query, params)
  }

  // Enrich search results with relationships
  if (response.rows && response.rows.length) {
    // enrich with global users if from users table
    if (tableId === InternalTables.USER_METADATA) {
      response.rows = await getGlobalUsersFromMetadata(response.rows)
    }

    if (options.fields) {
      const fields = [...options.fields, ...db.CONSTANT_INTERNAL_ROW_COLS]
      response.rows = response.rows.map((r: any) => pick(r, fields))
    }

    response.rows = await outputProcessing(table, response.rows)
  }

  return response
}

export async function exportRows(
  options: ExportRowsParams
): Promise<ExportRowsResult> {
  const { tableId, format, rowIds, columns, query } = options
  const db = context.getAppDB()
  const table = await sdk.tables.getTable(tableId)

  let result
  if (rowIds) {
    let response = (
      await db.allDocs({
        include_docs: true,
        keys: rowIds,
      })
    ).rows.map(row => row.doc)

    result = await outputProcessing(table, response)
  } else if (query) {
    let searchResponse = await search({ tableId, query })
    result = searchResponse.rows
  }

  let rows: Row[] = []
  let schema = table.schema

  // Filter data to only specified columns if required
  if (columns && columns.length) {
    for (let i = 0; i < result.length; i++) {
      rows[i] = {}
      for (let column of columns) {
        rows[i][column] = result[i][column]
      }
    }
  } else {
    rows = result
  }

  let exportRows = cleanExportRows(rows, schema, format, columns)
  if (format === Format.CSV) {
    return {
      fileName: "export.csv",
      content: csv(Object.keys(rows[0]), exportRows),
    }
  } else if (format === Format.JSON) {
    return {
      fileName: "export.json",
      content: json(exportRows),
    }
  } else if (format === Format.JSON_WITH_SCHEMA) {
    return {
      fileName: "export.json",
      content: jsonWithSchema(schema, exportRows),
    }
  } else {
    throw "Format not recognised"
  }
}

export async function fetch(tableId: string) {
  const db = context.getAppDB()

  const table = await sdk.tables.getTable(tableId)
  const rows = await getRawTableData(db, tableId)
  const result = await outputProcessing(table, rows)
  return result
}

async function getRawTableData(db: Database, tableId: string) {
  let rows
  if (tableId === InternalTables.USER_METADATA) {
    rows = await sdk.users.fetchMetadata()
  } else {
    const response = await db.allDocs(
      getRowParams(tableId, null, {
        include_docs: true,
      })
    )
    rows = response.rows.map(row => row.doc)
  }
  return rows as Row[]
}

export async function fetchView(
  viewName: string,
  options: { calculation: string; group: string; field: string }
): Promise<Row[]> {
  // if this is a table view being looked for just transfer to that
  if (viewName.startsWith(DocumentType.TABLE)) {
    return fetch(viewName)
  }

  const db = context.getAppDB()
  const { calculation, group, field } = options
  const viewInfo = await getView(db, viewName)
  let response
  if (env.SELF_HOSTED) {
    response = await db.query(`database/${viewName}`, {
      include_docs: !calculation,
      group: !!group,
    })
  } else {
    const tableId = viewInfo.meta.tableId
    const data = await getRawTableData(db, tableId)
    response = await inMemoryViews.runView(
      viewInfo,
      calculation as string,
      !!group,
      data
    )
  }

  let rows: Row[] = []
  if (!calculation) {
    response.rows = response.rows.map(row => row.doc)
    let table: Table
    try {
      table = await sdk.tables.getTable(viewInfo.meta.tableId)
    } catch (err) {
      /* istanbul ignore next */
      table = {
        name: "",
        schema: {},
      }
    }
    rows = await outputProcessing(table, response.rows)
  }

  if (calculation === CALCULATION_TYPES.STATS) {
    response.rows = response.rows.map(row => ({
      group: row.key,
      field,
      ...row.value,
      avg: row.value.sum / row.value.count,
    }))
    rows = response.rows
  }

  if (
    calculation === CALCULATION_TYPES.COUNT ||
    calculation === CALCULATION_TYPES.SUM
  ) {
    rows = response.rows.map(row => ({
      group: row.key,
      field,
      value: row.value,
    }))
  }
  return rows
}

const CALCULATION_TYPES = {
  SUM: "sum",
  COUNT: "count",
  STATS: "stats",
}

async function getView(db: Database, viewName: string) {
  let mainGetter = env.SELF_HOSTED ? getFromDesignDoc : getFromMemoryDoc
  let secondaryGetter = env.SELF_HOSTED ? getFromMemoryDoc : getFromDesignDoc
  let migration = env.SELF_HOSTED ? migrateToDesignView : migrateToInMemoryView
  let viewInfo,
    migrate = false
  try {
    viewInfo = await mainGetter(db, viewName)
  } catch (err: any) {
    // check if it can be retrieved from design doc (needs migrated)
    if (err.status !== 404) {
      viewInfo = null
    } else {
      viewInfo = await secondaryGetter(db, viewName)
      migrate = !!viewInfo
    }
  }
  if (migrate) {
    await migration(db, viewName)
  }
  if (!viewInfo) {
    throw "View does not exist."
  }
  return viewInfo
}
