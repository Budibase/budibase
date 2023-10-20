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
import sdk from "../../../sdk"

function processInternalTables(docs: AllDocsResponse<Table[]>): Table[] {
  return docs.rows.map((tableDoc: any) => ({
    ...tableDoc.doc,
    type: "internal",
    sourceId: tableDoc.doc.sourceId || BudibaseInternalDB._id,
  }))
}

export async function getAllInternalTables(db?: Database): Promise<Table[]> {
  if (!db) {
    db = context.getAppDB()
  }
  const internalTables = await db.allDocs<Table[]>(
    getTableParams(null, {
      include_docs: true,
    })
  )
  return processInternalTables(internalTables)
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
  return final
}

export async function getExternalTable(
  datasourceId: string,
  tableName: string
): Promise<Table> {
  const entities = await getExternalTablesInDatasource(datasourceId)
  return entities[tableName]
}

export async function getTable(tableId: string): Promise<Table> {
  const db = context.getAppDB()
  if (isExternalTable(tableId)) {
    let { datasourceId, tableName } = breakExternalTableId(tableId)
    const datasource = await datasources.get(datasourceId!)
    const table = await getExternalTable(datasourceId!, tableName!)
    return { ...table, sql: isSQL(datasource) }
  } else {
    return db.get(tableId)
  }
}

export async function getAllTables() {
  const [internal, external] = await Promise.all([
    getAllInternalTables(),
    getAllExternalTables(),
  ])
  return [...internal, ...external]
}

export async function getExternalTablesInDatasource(
  datasourceId: string
): Promise<Record<string, Table>> {
  const datasource = await datasources.get(datasourceId, { enriched: true })
  if (!datasource || !datasource.entities) {
    throw new Error("Datasource is not configured fully.")
  }
  return datasource.entities
}

export async function getTables(tableIds: string[]): Promise<Table[]> {
  const externalTableIds = tableIds.filter(tableId => isExternalTable(tableId)),
    internalTableIds = tableIds.filter(tableId => !isExternalTable(tableId))
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
    const internalTableDocs = await db.allDocs<Table[]>(
      getMultiIDParams(internalTableIds)
    )
    tables = tables.concat(processInternalTables(internalTableDocs))
  }
  return tables
}

export function enrichViewSchemas(table: Table): TableResponse {
  return {
    ...table,
    views: Object.values(table.views ?? [])
      .map(v => sdk.views.enrichSchema(v, table.schema))
      .reduce((p, v) => {
        p[v.name!] = v
        return p
      }, {} as TableViewsResponse),
  }
}
