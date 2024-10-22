import { context, features } from "@budibase/backend-core"
import { getTableParams } from "../../../db/utils"
import {
  breakExternalTableId,
  isExternalTableID,
  isSQL,
} from "../../../integrations/utils"
import {
  Database,
  INTERNAL_TABLE_SOURCE_ID,
  Table,
  TableResponse,
  TableSourceType,
  TableViewsResponse,
  FeatureFlag,
} from "@budibase/types"
import datasources from "../datasources"
import sdk from "../../../sdk"

export async function processTable(table: Table): Promise<Table> {
  if (!table) {
    return table
  }

  table = { ...table }
  if (table._id && isExternalTableID(table._id)) {
    // Old created external tables via Budibase might have a missing field name breaking some UI such as filters
    if (table.schema["id"] && !table.schema["id"].name) {
      table.schema["id"].name = "id"
    }
    return {
      ...table,
      type: "table",
      sourceType: TableSourceType.EXTERNAL,
    }
  } else {
    const processed: Table = {
      ...table,
      type: "table",
      sourceId: table.sourceId || INTERNAL_TABLE_SOURCE_ID,
      sourceType: TableSourceType.INTERNAL,
    }
    const sqsEnabled = await features.flags.isEnabled(FeatureFlag.SQS)
    if (sqsEnabled) {
      processed.sql = true
    }
    return processed
  }
}

export async function processTables(tables: Table[]): Promise<Table[]> {
  return await Promise.all(tables.map(table => processTable(table)))
}

async function processEntities(tables: Record<string, Table>) {
  for (let key of Object.keys(tables)) {
    tables[key] = await processTable(tables[key])
  }
  return tables
}

export async function getAllInternalTables(db?: Database): Promise<Table[]> {
  if (!db) {
    db = context.getAppDB()
  }
  const internalTables = await db.allDocs<Table>(
    getTableParams(null, {
      include_docs: true,
    })
  )
  return await processTables(internalTables.rows.map(row => row.doc!))
}

async function getAllExternalTables(): Promise<Table[]> {
  const datasources = await sdk.datasources.fetch({ enriched: true })
  const allEntities = datasources.map(datasource => datasource.entities)
  let final: Table[] = []
  for (let entities of allEntities) {
    if (entities) {
      final = final.concat(Object.values(entities))
    }
  }
  return await processTables(final)
}

export async function getExternalTable(
  datasourceId: string,
  tableName: string
): Promise<Table> {
  const entities = await getExternalTablesInDatasource(datasourceId)
  if (!entities[tableName]) {
    throw new Error(`Unable to find table named "${tableName}"`)
  }
  const table = await processTable(entities[tableName])
  if (!table.sourceId) {
    table.sourceId = datasourceId
  }
  return table
}

export async function getTable(tableId: string): Promise<Table> {
  const db = context.getAppDB()
  let output: Table
  if (tableId && isExternalTableID(tableId)) {
    let { datasourceId, tableName } = breakExternalTableId(tableId)
    const datasource = await datasources.get(datasourceId)
    const table = await getExternalTable(datasourceId, tableName)
    output = { ...table, sql: isSQL(datasource) }
  } else {
    output = await db.get<Table>(tableId)
  }
  return await processTable(output)
}

export async function doesTableExist(tableId: string): Promise<boolean> {
  try {
    const table = await getTable(tableId)
    return !!table
  } catch (err) {
    return false
  }
}

export async function getAllTables() {
  const [internal, external] = await Promise.all([
    getAllInternalTables(),
    getAllExternalTables(),
  ])
  return await processTables([...internal, ...external])
}

export async function getExternalTablesInDatasource(
  datasourceId: string
): Promise<Record<string, Table>> {
  const datasource = await datasources.get(datasourceId, { enriched: true })
  if (!datasource || !datasource.entities) {
    throw new Error("Datasource is not configured fully.")
  }
  return await processEntities(datasource.entities)
}

export async function getTables(tableIds: string[]): Promise<Table[]> {
  const externalTableIds = tableIds.filter(tableId =>
      isExternalTableID(tableId)
    ),
    internalTableIds = tableIds.filter(tableId => !isExternalTableID(tableId))
  let tables: Table[] = []
  if (externalTableIds.length) {
    const externalTables = await getAllExternalTables()
    tables = tables.concat(
      externalTables.filter(
        table => externalTableIds.indexOf(table._id!) !== -1
      )
    )
  }
  if (internalTableIds.length) {
    const db = context.getAppDB()
    const internalTables = await db.getMultiple<Table>(internalTableIds, {
      allowMissing: true,
    })
    tables = tables.concat(internalTables)
  }
  return await processTables(tables)
}

export async function enrichViewSchemas(table: Table): Promise<TableResponse> {
  const views = []
  for (const view of Object.values(table.views ?? [])) {
    if (sdk.views.isV2(view)) {
      views.push(await sdk.views.enrichSchema(view, table.schema))
    } else views.push(view)
  }

  return {
    ...table,
    views: views.reduce((p, v) => {
      p[v.name!] = v
      return p
    }, {} as TableViewsResponse),
  }
}
