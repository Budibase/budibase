import { context } from "@budibase/backend-core"
import { BudibaseInternalDB, getTableParams } from "../../../db/utils"
import {
  breakExternalTableId,
  isExternalTable,
  isSQL,
} from "../../../integrations/utils"
import {
  Table,
  Database,
  TableResponse,
  TableViewsResponse,
  TableSchema,
  UIFieldMetadata,
} from "@budibase/types"
import datasources from "../datasources"
import { populateExternalTableSchemas, isEditableColumn } from "./validation"
import sdk from "../../../sdk"
import _ from "lodash"

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

function enrichSchema(
  tableSchema: TableSchema,
  viewOverrides: Record<string, UIFieldMetadata>
) {
  const result: TableSchema = {}
  for (const [columnName, columnUIMetadata] of Object.entries(viewOverrides)) {
    if (!columnUIMetadata.visible) {
      continue
    }

    if (!tableSchema[columnName]) {
      continue
    }

    result[columnName] = _.merge(tableSchema[columnName], columnUIMetadata)
  }
  return result
}

function enrichViewSchemas(table: Table): TableResponse {
  const result: TableResponse = {
    ...table,
    views: Object.values(table.views ?? []).reduce((p, v) => {
      if (!sdk.views.isV2(v)) {
        p[v.name] = v
      } else {
        p[v.name] = {
          ...v,
          schema:
            !v?.columns || !Object.entries(v?.columns).length
              ? table.schema
              : enrichSchema(table.schema, v.columns),
        }
      }
      return p
    }, {} as TableViewsResponse),
  }

  return result
}

export default {
  getAllInternalTables,
  getAllExternalTables,
  getExternalTable,
  getTable,
  populateExternalTableSchemas,
  isEditableColumn,
  enrichViewSchemas,
}
