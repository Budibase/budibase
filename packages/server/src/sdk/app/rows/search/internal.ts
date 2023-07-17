import { context } from "@budibase/backend-core"
import env from "../../../../environment"
import { fullSearch, paginatedSearch } from "./internalSearch"
import {
  InternalTables,
  getRowParams,
  DocumentType,
} from "../../../../db/utils"
import { getGlobalUsersFromMetadata } from "../../../../utilities/global"
import { outputProcessing } from "../../../../utilities/rowProcessor"
import { Ctx, Database, Row } from "@budibase/types"
import { cleanExportRows } from "../utils"
import {
  Format,
  csv,
  json,
  jsonWithSchema,
} from "../../../../api/controllers/view/exporters"
import { apiFileReturn } from "../../../../utilities/fileSystem"
import * as inMemoryViews from "../../../../db/inMemoryView"
import {
  migrateToInMemoryView,
  migrateToDesignView,
  getFromDesignDoc,
  getFromMemoryDoc,
} from "../../../../api/controllers/view/utils"
import sdk from "../../../../sdk"

export async function search(ctx: Ctx) {
  // Fetch the whole table when running in cypress, as search doesn't work
  if (!env.COUCH_DB_URL && env.isCypress()) {
    return { rows: await fetch(ctx) }
  }

  const { tableId } = ctx.params
  const db = context.getAppDB()
  const { paginate, query, ...params } = ctx.request.body
  params.version = ctx.version
  params.tableId = tableId

  let table
  if (params.sort && !params.sortType) {
    table = await db.get(tableId)
    const schema = table.schema
    const sortField = schema[params.sort]
    params.sortType = sortField.type == "number" ? "number" : "string"
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
    table = table || (await db.get(tableId))
    response.rows = await outputProcessing(table, response.rows)
  }

  return response
}

export async function exportRows(ctx: Ctx) {
  const db = context.getAppDB()
  const table = await db.get(ctx.params.tableId)
  const rowIds = ctx.request.body.rows
  let format = ctx.query.format
  if (typeof format !== "string") {
    ctx.throw(400, "Format parameter is not valid")
  }
  const { columns, query } = ctx.request.body

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
    let searchResponse = await search(ctx)
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
    ctx.attachment("export.csv")
    return apiFileReturn(csv(Object.keys(rows[0]), exportRows))
  } else if (format === Format.JSON) {
    ctx.attachment("export.json")
    return apiFileReturn(json(exportRows))
  } else if (format === Format.JSON_WITH_SCHEMA) {
    ctx.attachment("export.json")
    return apiFileReturn(jsonWithSchema(schema, exportRows))
  } else {
    throw "Format not recognised"
  }
}

export async function fetch(ctx: Ctx) {
  const db = context.getAppDB()

  const tableId = ctx.params.tableId
  let table = await db.get(tableId)
  let rows = await getRawTableData(db, tableId)
  return outputProcessing(table, rows)
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

export async function fetchView(ctx: Ctx) {
  const viewName = decodeURIComponent(ctx.params.viewName)

  // if this is a table view being looked for just transfer to that
  if (viewName.startsWith(DocumentType.TABLE)) {
    ctx.params.tableId = viewName
    return fetch(ctx)
  }

  const db = context.getAppDB()
  const { calculation, group, field } = ctx.query
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

  let rows
  if (!calculation) {
    response.rows = response.rows.map(row => row.doc)
    let table
    try {
      table = await db.get(viewInfo.meta.tableId)
    } catch (err) {
      /* istanbul ignore next */
      table = {
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
