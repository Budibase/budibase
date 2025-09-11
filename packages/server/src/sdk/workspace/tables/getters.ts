import { context } from "@budibase/backend-core"
import {
  Database,
  FindTableResponse,
  INTERNAL_TABLE_SOURCE_ID,
  Table,
  TableSourceType,
  TableViewsResponse,
} from "@budibase/types"
import { tracer } from "dd-trace"
import sdk from "../.."
import { getTableParams, InternalTables } from "../../../db/utils"
import {
  breakExternalTableId,
  isExternalTableID,
  isSQL,
} from "../../../integrations/utils"
import datasources from "../datasources"
import { isV2 } from "../views"
import { ensureQueryUISet } from "../views/utils"

export async function processTable(table: Table): Promise<Table> {
  return await tracer.trace("processTable", async span => {
    if (!table) {
      return table
    }

    span.addTags({ tableId: table._id })

    table = { ...table }
    if (table.views) {
      span.addTags({ numViews: Object.keys(table.views).length })
      for (const [key, view] of Object.entries(table.views)) {
        if (!isV2(view)) {
          continue
        }
        table.views[key] = ensureQueryUISet(view)
      }
    }
    if (table._id && isExternalTableID(table._id)) {
      span.addTags({ isExternal: true })
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
      span.addTags({ isExternal: false })
      const processed: Table = {
        ...table,
        type: "table",
        primary: ["_id"], // internal tables must always use _id as primary key
        sourceId: table.sourceId || INTERNAL_TABLE_SOURCE_ID,
        sourceType: TableSourceType.INTERNAL,
        sql: true,
      }
      return processed
    }
  })
}

export async function processTables(tables: Table[]): Promise<Table[]> {
  return await tracer.trace("processTables", async span => {
    span.addTags({ numTables: tables.length })
    return await Promise.all(tables.map(table => processTable(table)))
  })
}

async function processEntities(tables: Record<string, Table>) {
  return await tracer.trace("processEntities", async span => {
    span.addTags({ numTables: Object.keys(tables).length })
    for (let key of Object.keys(tables)) {
      tables[key] = await processTable(tables[key])
    }
    return tables
  })
}

export async function getAllInternalTables(db?: Database): Promise<Table[]> {
  return await tracer.trace("getAllInternalTables", async span => {
    if (!db) {
      db = context.getWorkspaceDB()
    }
    span.addTags({ db: db.name })
    const internalTables = await db.allDocs<Table>(
      getTableParams(null, {
        include_docs: true,
      })
    )
    span.addTags({ numTables: internalTables.rows.length })
    return await processTables(internalTables.rows.map(row => row.doc!))
  })
}

export async function listEmptyProductionTables(): Promise<string[]> {
  const internalTables = await getAllInternalTables()
  const emptyTableIds: string[] = []
  return context.doInWorkspaceContext(
    context.getProdWorkspaceId(),
    async () => {
      for (let table of internalTables) {
        if (table._id === InternalTables.USER_METADATA || !table._id) {
          continue
        }
        const aRow = await sdk.rows.fetchRaw(table._id, 1)
        if (aRow.length === 0) {
          emptyTableIds.push(table._id)
        }
      }
      return emptyTableIds
    }
  )
}

async function getAllExternalTables(): Promise<Table[]> {
  return await tracer.trace("getAllExternalTables", async span => {
    // this is all datasources, we'll need to filter out internal
    const datasources = await sdk.datasources.fetch({ enriched: true })
    span.addTags({ numDatasources: datasources.length })

    const allEntities = datasources
      .filter(datasource => datasource._id !== INTERNAL_TABLE_SOURCE_ID)
      .map(datasource => datasource.entities)
    span.addTags({ numEntities: allEntities.length })

    let final: Table[] = []
    for (let entities of allEntities) {
      if (entities) {
        final = final.concat(Object.values(entities))
      }
    }
    span.addTags({ numTables: final.length })
    return await processTables(final)
  })
}

export async function getExternalTable(
  datasourceId: string,
  tableName: string
): Promise<Table> {
  return await tracer.trace("getExternalTable", async span => {
    span.addTags({ datasourceId, tableName })
    const entities = await getExternalTablesInDatasource(datasourceId)
    if (!entities[tableName]) {
      throw new Error(`Unable to find table named "${tableName}"`)
    }
    const table = await processTable(entities[tableName])
    if (!table.sourceId) {
      table.sourceId = datasourceId
    }
    return table
  })
}

export async function getTable(tableId: string): Promise<Table> {
  return await tracer.trace("getTable", async span => {
    const db = context.getWorkspaceDB()
    span.addTags({ tableId, db: db.name })
    let output: Table
    if (tableId && isExternalTableID(tableId)) {
      let { datasourceId, tableName } = breakExternalTableId(tableId)
      span.addTags({ isExternal: true, datasourceId, tableName })
      const datasource = await datasources.get(datasourceId)
      const table = await getExternalTable(datasourceId, tableName)
      output = { ...table, sql: isSQL(datasource) }
      span.addTags({ isSQL: isSQL(datasource) })
    } else {
      output = await db.get<Table>(tableId)
    }
    return await processTable(output)
  })
}

export async function doesTableExist(tableId: string): Promise<boolean> {
  return await tracer.trace("doesTableExist", async span => {
    span.addTags({ tableId })
    try {
      const table = await getTable(tableId)
      span.addTags({ tableExists: !!table })
      return !!table
    } catch (err) {
      span.addTags({ tableExists: false })
      return false
    }
  })
}

export async function getAllTables() {
  return await tracer.trace("getAllTables", async span => {
    const [internal, external] = await Promise.all([
      getAllInternalTables(),
      getAllExternalTables(),
    ])
    span.addTags({
      numInternalTables: internal.length,
      numExternalTables: external.length,
    })
    return await processTables([...internal, ...external])
  })
}

export async function getExternalTablesInDatasource(
  datasourceId: string
): Promise<Record<string, Table>> {
  return await tracer.trace("getExternalTablesInDatasource", async span => {
    const datasource = await datasources.get(datasourceId, { enriched: true })
    if (!datasource || !datasource.entities) {
      throw new Error("Datasource is not configured fully.")
    }
    span.addTags({
      datasourceId,
      numEntities: Object.keys(datasource.entities).length,
    })
    return await processEntities(datasource.entities)
  })
}

export async function getTables(tableIds: string[]): Promise<Table[]> {
  return tracer.trace("getTables", async span => {
    span.addTags({ numTableIds: tableIds.length })
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
      const db = context.getWorkspaceDB()
      const internalTables = await db.getMultiple<Table>(internalTableIds, {
        allowMissing: true,
      })
      tables = tables.concat(internalTables)
    }
    span.addTags({ numTables: tables.length })
    return await processTables(tables)
  })
}

export async function enrichViewSchemas(
  table: Table
): Promise<FindTableResponse> {
  return await tracer.trace("enrichViewSchemas", async span => {
    span.addTags({ tableId: table._id })
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
  })
}
