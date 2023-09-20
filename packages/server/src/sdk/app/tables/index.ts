import { context } from "@budibase/backend-core"
import { BudibaseInternalDB, getTableParams } from "../../../db/utils"
import {
  breakExternalTableId,
  isExternalTable,
  isSQL,
} from "../../../integrations/utils"
import {
  Database,
  Table,
  TableResponse,
  TableViewsResponse,
} from "@budibase/types"
import datasources from "../datasources"
import { populateExternalTableSchemas } from "./validation"
import sdk from "../../../sdk"

async function getAllInternalTables(db?: Database): Promise<Table[]> {
  if (!db) {
    db = context.getAppDB()
  }
  const internalTables = await db.allDocs(
    getTableParams(null, {
      include_docs: true,
    })
  )
  return internalTables.rows.map((tableDoc: any) => ({
    ...tableDoc.doc,
    type: "internal",
    sourceId: tableDoc.doc.sourceId || BudibaseInternalDB._id,
  }))
}

async function getAllExternalTables(
  datasourceId: any
): Promise<Record<string, Table>> {
  const datasource = await datasources.get(datasourceId, { enriched: true })
  if (!datasource || !datasource.entities) {
    throw "Datasource is not configured fully."
  }
  return datasource.entities
}

async function getExternalTable(
  datasourceId: any,
  tableName: any
): Promise<Table> {
  const entities = await getAllExternalTables(datasourceId)
  return entities[tableName]
}

async function getTable(tableId: any): Promise<Table> {
  const db = context.getAppDB()
  if (isExternalTable(tableId)) {
    let { datasourceId, tableName } = breakExternalTableId(tableId)
    const datasource = await datasources.get(datasourceId!)
    const table = await getExternalTable(datasourceId, tableName)
    return { ...table, sql: isSQL(datasource) }
  } else {
    return db.get(tableId)
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
  getAllExternalTables,
  getExternalTable,
  getTable,
  populateExternalTableSchemas,
  enrichViewSchemas,
  saveTable,
}
