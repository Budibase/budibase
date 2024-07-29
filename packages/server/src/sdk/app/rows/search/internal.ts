import { context, HTTPError } from "@budibase/backend-core"
import { PROTECTED_INTERNAL_COLUMNS } from "@budibase/shared-core"
import env from "../../../../environment"
import { fullSearch, paginatedSearch } from "./utils"
import { getRowParams, InternalTables } from "../../../../db/utils"
import {
  Database,
  DocumentType,
  Row,
  RowSearchParams,
  SearchResponse,
  SortType,
  Table,
  User,
} from "@budibase/types"
import { getGlobalUsersFromMetadata } from "../../../../utilities/global"
import { outputProcessing } from "../../../../utilities/rowProcessor"
import {
  csv,
  Format,
  json,
  jsonWithSchema,
} from "../../../../api/controllers/view/exporters"
import * as inMemoryViews from "../../../../db/inMemoryView"
import {
  getFromDesignDoc,
  getFromMemoryDoc,
  migrateToDesignView,
  migrateToInMemoryView,
} from "../../../../api/controllers/view/utils"
import sdk from "../../../../sdk"
import { ExportRowsParams, ExportRowsResult } from "./types"
import pick from "lodash/pick"
import { breakRowIdField } from "../../../../integrations/utils"

export async function search(
  options: RowSearchParams,
  table: Table
): Promise<SearchResponse<Row>> {
  const { tableId } = options

  const { paginate, query } = options

  const params: RowSearchParams = {
    tableId: options.tableId,
    sort: options.sort,
    sortOrder: options.sortOrder,
    sortType: options.sortType,
    limit: options.limit,
    bookmark: options.bookmark,
    version: options.version,
    disableEscaping: options.disableEscaping,
    query: {},
  }

  if (params.sort && !params.sortType) {
    const schema = table.schema
    const sortField = schema[params.sort]
    params.sortType =
      sortField.type === "number" ? SortType.NUMBER : SortType.STRING
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
      response.rows = await getGlobalUsersFromMetadata(response.rows as User[])
    }

    if (options.fields) {
      const fields = [...options.fields, ...PROTECTED_INTERNAL_COLUMNS]
      response.rows = response.rows.map((r: any) => pick(r, fields))
    }

    response.rows = await outputProcessing(table, response.rows)
  }

  return response
}

export async function exportRows(
  options: ExportRowsParams
): Promise<ExportRowsResult> {
  const {
    tableId,
    format,
    rowIds,
    columns,
    query,
    sort,
    sortOrder,
    delimiter,
    customHeaders,
  } = options
  const db = context.getAppDB()
  const table = await sdk.tables.getTable(tableId)

  let result: Row[] = []
  if (rowIds) {
    let response = (
      await db.allDocs<Row>({
        include_docs: true,
        keys: rowIds.map((row: string) => {
          const ids = breakRowIdField(row)
          if (ids.length > 1) {
            throw new HTTPError(
              "Export data does not support composite keys.",
              400
            )
          }
          return ids[0]
        }),
      })
    ).rows.map(row => row.doc!)

    result = await outputProcessing<Row[]>(table, response)
  } else if (query) {
    let searchResponse = await search(
      {
        tableId,
        query,
        sort,
        sortOrder,
      },
      table
    )
    result = searchResponse.rows
  }

  let rows: Row[] = []
  let schema = table.schema
  let headers
  // Filter data to only specified columns if required
  if (columns && columns.length) {
    for (let i = 0; i < result.length; i++) {
      rows[i] = {}
      for (let column of columns) {
        rows[i][column] = result[i][column]
      }
    }
    headers = columns
  } else {
    rows = result
  }

  let exportRows = sdk.rows.utils.cleanExportRows(
    rows,
    schema,
    format,
    columns,
    customHeaders
  )
  if (format === Format.CSV) {
    return {
      fileName: "export.csv",
      content: csv(
        headers ?? Object.keys(rows[0]),
        exportRows,
        delimiter,
        customHeaders
      ),
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

export async function fetch(tableId: string): Promise<Row[]> {
  const table = await sdk.tables.getTable(tableId)
  const rows = await fetchRaw(tableId)
  return await outputProcessing(table, rows)
}

export async function fetchRaw(tableId: string): Promise<Row[]> {
  const db = context.getAppDB()
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
    const tableId = viewInfo.meta!.tableId
    const data = await fetchRaw(tableId!)
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
      table = await sdk.tables.getTable(viewInfo.meta!.tableId)
    } catch (err) {
      throw new Error("Unable to retrieve view table.")
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
