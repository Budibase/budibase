import { context } from "@budibase/backend-core"
import {
  BudibaseInternalDB,
  getMultiIDParams,
  getTableParams,
} from "../../../db/utils"
import {
  breakExternalTableId,
  isExternalTable,
  isSQL,
} from "../../../integrations/utils"
import {
  AllDocsResponse,
  Database,
  Table,
  TableResponse,
  TableViewsResponse,
} from "@budibase/types"
import datasources from "../datasources"
import { populateExternalTableSchemas } from "./validation"
import sdk from "../../../sdk"

function processInternalTables(docs: AllDocsResponse<Table[]>): Table[] {
  return docs.rows.map((tableDoc: any) => ({
    ...tableDoc.doc,
    type: "internal",
    sourceId: tableDoc.doc.sourceId || BudibaseInternalDB._id,
  }))
}

async function getAllInternalTables(db?: Database): Promise<Table[]> {
  if (!db) {
    db = context.getAppDB()
  }
  const internalTables = await db.allDocs(
    getTableParams(null, {
      include_docs: true,
    })
  )
  return processInternalTables(internalTables)
}

async function getAllExternalTables(): Promise<Table[]> {
  const datasources = await sdk.datasources.fetch({ enriched: true })
  const allEntities = datasources.map(datasource => datasource.entities)
  let final = []
  for (let entities of allEntities) {
    final = final.concat(Object.values(entities))
  }
  return final
}

async function getAllTables() {
  const [internal, external] = await Promise.all([
    getAllInternalTables(),
    getAllExternalTables(),
  ])
  return [...internal, external]
}

async function getTables(tableIds: string[]): Promise<Table[]> {
  const externalTableIds = tableIds.filter(tableId => isExternalTable(tableId)),
    internalTableIds = tableIds.filter(tableId => !isExternalTable(tableId))
  let tables = []
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
    const internalTables = await db.allDocs(getMultiIDParams(internalTableIds))
    tables = tables.concat(processInternalTables(internalTables))
  }
  return tables
}

async function getExternalTablesInDatasource(
  datasourceId: string
): Promise<Record<string, Table>> {
  const datasource = await datasources.get(datasourceId, { enriched: true })
  if (!datasource || !datasource.entities) {
    throw "Datasource is not configured fully."
  }
  return datasource.entities
}

async function getExternalTable(
  datasourceId: string,
  tableName: string
): Promise<Table> {
  const entities = await getExternalTablesInDatasource(datasourceId)
  return entities[tableName]
}

async function getTable(tableId: string): Promise<Table> {
  const db = context.getAppDB()
  if (isExternalTable(tableId)) {
    let { datasourceId, tableName } = breakExternalTableId(tableId)
    const datasource = await datasources.get(datasourceId!)
    const table = await getExternalTable(datasourceId, tableName)
    return { ...table, sql: isSQL(datasource) }
  } else {
    return db.get<Table>(tableId)
  }
}

function enrichViewSchemas(table: Table): TableResponse {
  return {
    ...table,
    views: Object.values(table.views ?? [])
      .map(v => sdk.views.enrichSchema(v, table.schema))
      .reduce((p, v) => {
        p[v.name] = v
        return p
      }, {} as TableViewsResponse),
  }
}

async function saveTable(table: Table) {
  const db = context.getAppDB()
  if (isExternalTable(table._id!)) {
    const datasource = await sdk.datasources.get(table.sourceId!)
    datasource.entities![table.name] = table
    await db.put(datasource)
  } else {
    await db.put(table)
  }
}

export default {
  getAllInternalTables,
  getExternalTablesInDatasource,
  getExternalTable,
  getTable,
  getAllTables,
  getTables,
  populateExternalTableSchemas,
  enrichViewSchemas,
  saveTable,
}
