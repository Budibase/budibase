import {
  cache,
  context,
  db as dbCore,
  csv,
  events,
  HTTPError,
} from "@budibase/backend-core"
import {
  canBeDisplayColumn,
  helpers,
  PROTECTED_EXTERNAL_COLUMNS,
  PROTECTED_INTERNAL_COLUMNS,
} from "@budibase/shared-core"
import {
  BulkImportRequest,
  BulkImportResponse,
  CsvToJsonRequest,
  CsvToJsonResponse,
  DeleteTableResponse,
  EventType,
  FetchTablesResponse,
  FieldType,
  FindTableResponse,
  MigrateTableRequest,
  MigrateTableResponse,
  PublishTableRequest,
  PublishTableResponse,
  DocumentType,
  SEPARATOR,
  SaveTableRequest,
  SaveTableResponse,
  Table,
  TableSourceType,
  UserCtx,
  ValidateNewTableImportRequest,
  ValidateTableImportRequest,
  ValidateTableImportResponse,
  Row,
} from "@budibase/types"
import { cloneDeep } from "lodash"
import {
  breakExternalTableId,
  isExternalTable,
  isExternalTableID,
  isSQL,
} from "../../../integrations/utils"
import sdk from "../../../sdk"
import { processTable } from "../../../sdk/workspace/tables/getters"
import { publishWorkspaceInternal, withPublishLock } from "../deploy"
import {
  isRows,
  isSchema,
  validate as validateSchema,
} from "../../../utilities/schema"
import { handleDataImport } from "./utils"
import { withProjectPropagationWarning } from "../../../utilities/projects"
import { builderSocket } from "../../../websockets"
import * as external from "./external"
import * as internal from "./internal"
import { getRowParams } from "../../../db/utils"
import { getLinkedTableIDs } from "../../../db/linkedRows/linkUtils"

function pickApi({ tableId, table }: { tableId?: string; table?: Table }) {
  if (table && isExternalTable(table)) {
    return external
  }
  if (tableId && isExternalTableID(tableId)) {
    return external
  }
  return internal
}

const getNewLinkedTableIds = ({
  previousTable,
  savedTable,
}: {
  previousTable?: Table
  savedTable: Table
}) => {
  const previousIds = new Set(
    previousTable ? getLinkedTableIDs(previousTable.schema) : []
  )
  return Array.from(new Set(getLinkedTableIDs(savedTable.schema))).filter(
    tableId => tableId !== savedTable._id && !previousIds.has(tableId)
  )
}

function checkDefaultFields(table: Table) {
  for (const [key, field] of Object.entries(table.schema)) {
    if (!("default" in field) || field.default == null) {
      continue
    }
    if (helpers.schema.isRequired(field.constraints)) {
      throw new HTTPError(
        `Cannot make field "${key}" required, it has a default value.`,
        400
      )
    }
  }
}

function stripIgnoreTimezoneSuffix(rows: Row[], table: Table): Row[] {
  const columns = Object.entries(table.schema)
    .filter(
      ([_, schema]) =>
        schema.type === FieldType.DATETIME &&
        schema.ignoreTimezones &&
        !schema.timeOnly
    )
    .map(([name]) => name)
  if (!columns.length) {
    return rows
  }
  return rows.map(row => {
    const updates = columns.reduce<Row>((acc, column) => {
      const value = row[column]
      if (typeof value === "string" && value.endsWith("Z")) {
        acc[column] = value.slice(0, -1)
      }
      return acc
    }, {})
    return Object.keys(updates).length ? { ...row, ...updates } : row
  })
}

async function guardTable(table: Table, isCreate: boolean) {
  checkDefaultFields(table)

  if (
    table.primaryDisplay &&
    !canBeDisplayColumn(table.schema[table.primaryDisplay]?.type)
  ) {
    // Prevent throwing errors from existing badly configured tables. Only throw for new tables or if this setting is being updated
    if (
      isCreate ||
      (await sdk.tables.getTable(table._id!)).primaryDisplay !==
        table.primaryDisplay
    ) {
      throw new HTTPError(
        `Column "${table.primaryDisplay}" cannot be used as a display type.`,
        400
      )
    }
  }
}

// covers both internal and external
export async function fetch(ctx: UserCtx<void, FetchTablesResponse>) {
  const internal = await sdk.tables.getAllInternalTables()

  const datasources = await sdk.datasources.getExternalDatasources()

  const external: Table[] = []
  for (const datasource of datasources) {
    let entities = datasource.entities
    if (entities) {
      for (const entity of Object.values(entities)) {
        external.push({
          ...(await processTable(entity)),
          sourceType: TableSourceType.EXTERNAL,
          sourceId: datasource._id!,
          sql: isSQL(datasource),
        })
      }
    }
  }

  const result: FetchTablesResponse = []
  for (const table of [...internal, ...external]) {
    result.push(await sdk.tables.enrichViewSchemas(table))
  }
  ctx.body = result
}

export async function find(ctx: UserCtx<void, FindTableResponse>) {
  const tableId = ctx.params.tableId
  const table = await sdk.tables.getTable(tableId)

  const result = await sdk.tables.enrichViewSchemas(table)
  ctx.body = result
}

async function saveUnlocked(ctx: UserCtx<SaveTableRequest, SaveTableResponse>) {
  const table = ctx.request.body
  const renaming = ctx.request.body._rename

  const isCreate = !table._id
  let previousTable: Table | undefined

  if (!isExternalTable(table)) {
    if (isCreate) {
      table.projectIds = await sdk.projects.resolveProjectIds(table.projectIds)
    } else {
      previousTable = await sdk.tables.getTable(table._id!)
      table.projectIds = await sdk.projects.resolveUpdatedProjectIds({
        projectIds: table.projectIds,
        currentProjectIds: previousTable.projectIds,
      })
      ctx.request.body.projectIds = table.projectIds
    }
  }

  await guardTable(table, isCreate)

  let savedTable: Table
  let eventPreviousTable: Table | undefined
  if (isCreate) {
    savedTable = await sdk.tables.create(table, undefined, ctx.user._id)
    savedTable = await sdk.tables.enrichViewSchemas(savedTable)
    savedTable = await processTable(savedTable)
  } else {
    const api = pickApi({ table })
    const { table: updatedTable, oldTable } = await api.updateTable(
      ctx,
      renaming
    )
    savedTable = updatedTable
    savedTable = await processTable(savedTable)

    eventPreviousTable = oldTable
  }
  if (renaming) {
    await sdk.views.renameLinkedViews(savedTable, renaming)
  }
  const newLinkedTableIds = !isExternalTable(savedTable)
    ? getNewLinkedTableIds({ previousTable, savedTable })
    : []
  const existingProjectIds = new Set(savedTable.projectIds || [])
  const newLinkedTables = await sdk.tables.getTables(newLinkedTableIds)
  for (const linkedTable of newLinkedTables) {
    const assignmentOwner = isExternalTableID(linkedTable._id!)
      ? await sdk.datasources.get(
          breakExternalTableId(linkedTable._id!).datasourceId
        )
      : linkedTable
    const reciprocalProjectIds = (assignmentOwner.projectIds || []).filter(
      projectId => !existingProjectIds.has(projectId)
    )
    await withProjectPropagationWarning({
      ctx,
      propagation: sdk.projects.propagateProjectIdsToDependencySubtrees({
        blockedResourceIds: [assignmentOwner._id!],
        dependencyIds: [savedTable._id!],
        projectIds: reciprocalProjectIds,
      }),
    })
  }

  if (!isExternalTable(savedTable)) {
    await withProjectPropagationWarning({
      ctx,
      propagation: sdk.projects.propagateProjectDependencyChanges({
        rootResourceId: savedTable._id!,
        currentProjectIds: savedTable.projectIds,
        previousProjectIds: previousTable?.projectIds || [],
        previousResource: previousTable,
        savedResource: savedTable,
      }),
    })
  }

  if (newLinkedTableIds.length) {
    const persistedTable = await sdk.tables.getTable(savedTable._id!)
    savedTable._rev = persistedTable._rev
    savedTable.projectIds = persistedTable.projectIds
  }

  return { savedTable, eventPreviousTable }
}

const importTableRows = async ({
  tableId,
  rows,
  userId,
}: {
  tableId: string
  rows: Row[]
  userId?: string
}) => {
  const db = context.getWorkspaceDB()
  const table = await db.get<Table>(tableId)
  const importedTable = await handleDataImport(table, {
    importRows: rows,
    userId,
  })
  return await sdk.projects.doWithProjectAssignmentsLockIfEnabled(async () => {
    const currentTable = await db.get<Table>(tableId)
    let schemaChanged = false
    // Imports can add options while other saves change the table or its projects.
    for (const [name, importedColumn] of Object.entries(importedTable.schema)) {
      const currentColumn = currentTable.schema[name]
      if (
        (importedColumn.type !== FieldType.OPTIONS &&
          importedColumn.type !== FieldType.ARRAY) ||
        currentColumn?.type !== importedColumn.type
      ) {
        continue
      }
      const existingValues = currentColumn.constraints?.inclusion || []
      const addedValues = (importedColumn.constraints?.inclusion || []).filter(
        value => !existingValues.includes(value)
      )
      if (addedValues.length) {
        currentColumn.constraints = {
          ...currentColumn.constraints,
          inclusion: [...new Set([...existingValues, ...addedValues])].sort(),
        }
        schemaChanged = true
      }
    }
    if (schemaChanged) {
      const { table: updatedTable } = await sdk.tables.internal.save(
        currentTable,
        {
          tableId: currentTable._id,
          userId,
        }
      )
      return await processTable(
        await sdk.tables.enrichViewSchemas(updatedTable)
      )
    }
    return await processTable(await sdk.tables.enrichViewSchemas(currentTable))
  })
}

export async function save(ctx: UserCtx<SaveTableRequest, SaveTableResponse>) {
  const { rows, ...table } = ctx.request.body
  ctx.request.body = table
  const result = await sdk.projects.doWithProjectAssignmentsLockIfEnabled(() =>
    saveUnlocked(ctx)
  )
  let { savedTable } = result
  if (rows && !isExternalTable(savedTable)) {
    savedTable = await importTableRows({
      tableId: savedTable._id!,
      rows,
      userId: ctx.user._id,
    })
  }
  if (!table._id) {
    await events.table.created(savedTable)
  } else if (result.eventPreviousTable) {
    await events.table.updated(result.eventPreviousTable, savedTable)
  }
  if (rows) {
    await events.table.imported(savedTable)
  }
  ctx.message = `Table ${table.name} saved successfully.`
  ctx.eventEmitter?.emitTable(EventType.TABLE_SAVE, ctx.appId, {
    ...savedTable,
  })
  ctx.body = savedTable
  builderSocket?.emitTableUpdate(ctx, cloneDeep(savedTable))
}

export async function destroy(ctx: UserCtx<void, DeleteTableResponse>) {
  const appId = ctx.appId
  const tableId = ctx.params.tableId
  await sdk.rowActions.deleteAll(tableId)
  const deletedTable = await pickApi({ tableId }).destroy(ctx)
  await events.table.deleted(deletedTable, appId)

  ctx.eventEmitter?.emitTable(EventType.TABLE_DELETE, appId, deletedTable)
  ctx.table = deletedTable
  ctx.body = { message: `Table ${tableId} deleted.` }
  builderSocket?.emitTableDeletion(ctx, deletedTable)
}

export async function bulkImport(
  ctx: UserCtx<BulkImportRequest, BulkImportResponse>
) {
  const tableId = ctx.params.tableId
  await pickApi({ tableId }).bulkImport(ctx)

  // right now we don't trigger anything for bulk import because it
  // can only be done in the builder, but in the future we may need to
  // think about events for bulk items

  ctx.body = { message: `Bulk rows created.` }
}

export async function csvToJson(
  ctx: UserCtx<CsvToJsonRequest, CsvToJsonResponse>
) {
  const { csvString } = ctx.request.body

  const result = await csv.jsonFromCsvString(csvString)

  ctx.body = result
}

export async function validateNewTableImport(
  ctx: UserCtx<ValidateNewTableImportRequest, ValidateTableImportResponse>
) {
  const { rows, schema } = ctx.request.body

  if (isRows(rows) && isSchema(schema)) {
    ctx.body = validateSchema(rows, schema, PROTECTED_INTERNAL_COLUMNS)
  } else {
    ctx.status = 422
  }
}

export async function validateExistingTableImport(
  ctx: UserCtx<ValidateTableImportRequest, ValidateTableImportResponse>
) {
  const { rows, tableId } = ctx.request.body

  let schema = null

  let protectedColumnNames
  if (tableId) {
    const table = await sdk.tables.getTable(tableId)
    schema = table.schema

    if (!isExternalTable(table)) {
      schema._id = {
        name: "_id",
        type: FieldType.STRING,
      }
      protectedColumnNames = PROTECTED_INTERNAL_COLUMNS.filter(x => x !== "_id")
    } else {
      protectedColumnNames = PROTECTED_EXTERNAL_COLUMNS
    }
  } else {
    ctx.status = 422
    return
  }

  if (tableId && isRows(rows) && isSchema(schema)) {
    ctx.body = validateSchema(rows, schema, protectedColumnNames)
  } else {
    ctx.status = 422
  }
}

export async function migrate(
  ctx: UserCtx<MigrateTableRequest, MigrateTableResponse>
) {
  const { oldColumn, newColumn } = ctx.request.body
  let tableId = ctx.params.tableId as string
  const table = await sdk.tables.getTable(tableId)
  let result = await sdk.tables.migrate(table, oldColumn, newColumn)

  for (let table of result.tablesUpdated) {
    builderSocket?.emitTableUpdate(ctx, table, {
      includeOriginator: true,
    })
  }

  ctx.body = { message: `Column ${oldColumn} migrated.` }
}

async function duplicateUnlocked(ctx: UserCtx<void, SaveTableResponse>) {
  const tableId = ctx.params.tableId as string
  const table = await sdk.tables.getTable(tableId)

  if (isExternalTable(table)) {
    throw new HTTPError("Cannot duplicate external tables", 422)
  }

  const duplicatedTable = await sdk.tables.duplicate(table, ctx.user._id)

  ctx.message = `Table ${table.name} duplicated successfully.`
  ctx.body = duplicatedTable

  const processedTable = await processTable(duplicatedTable)
  builderSocket?.emitTableUpdate(ctx, cloneDeep(processedTable))
}

export async function duplicate(ctx: UserCtx<void, SaveTableResponse>) {
  await sdk.projects.doWithProjectAssignmentsLockIfEnabled(() =>
    duplicateUnlocked(ctx)
  )
}

export async function publish(
  ctx: UserCtx<PublishTableRequest, PublishTableResponse>
) {
  await withPublishLock(() => publishTableInternal(ctx))
}

async function publishTableInternal(
  ctx: UserCtx<PublishTableRequest, PublishTableResponse>
) {
  const tableId = ctx.params.tableId as string
  const table = await sdk.tables.getTable(tableId)

  if (!table) {
    ctx.throw(404, "Table not found")
  }

  if (isExternalTable(table)) {
    ctx.throw(
      400,
      "Publishing production data is only supported for internal tables"
    )
  }

  const appId = context.getWorkspaceId()!
  const prodWorkspaceId = dbCore.getProdWorkspaceID(appId)
  const prodPublished =
    await sdk.workspaces.isWorkspacePublished(prodWorkspaceId)

  const seedProductionTables = !!ctx.request.body?.seedProductionTables
  if (!prodPublished) {
    await publishWorkspaceInternal(ctx, seedProductionTables, [tableId])
  }

  if (seedProductionTables) {
    try {
      const devDb = context.getWorkspaceDB()
      const devRows = await devDb.allDocs(
        getRowParams(tableId, null, {
          include_docs: true,
        })
      )
      const importRows = devRows.rows
        .map(({ doc }: any) => doc)
        .filter(doc => doc && !doc._deleted)
        .map(doc => {
          const { _rev, _attachments, ...rest } = doc
          return rest
        })

      if (importRows.length) {
        await context.doInWorkspaceContext(prodWorkspaceId, async () => {
          const prodDb = context.getWorkspaceDB()
          const existingProdRows = await prodDb.allDocs(
            getRowParams(tableId, null, {
              include_docs: true,
              limit: 1,
            })
          )
          const hasProdRows = existingProdRows.rows.some(
            (row: any) => row.doc && !row.doc._deleted
          )
          if (hasProdRows) {
            return
          }

          const prodTable = await sdk.tables.getTable(tableId)
          const sanitizedRows = stripIgnoreTimezoneSuffix(importRows, prodTable)
          await handleDataImport(prodTable, {
            importRows: sanitizedRows,
            userId: ctx.user._id,
            identifierFields: ["_id"],
          })
        })
      }
    } catch (error) {
      console.warn(
        `Failed to copy dev rows to prod for table ${tableId}`,
        error
      )
    }
  }
  const tableSegment = `${SEPARATOR}${tableId}${SEPARATOR}`
  const matchesTable = (_id: string) =>
    _id === tableId ||
    _id.endsWith(`${SEPARATOR}${tableId}`) ||
    _id.includes(tableSegment)
  const isDataDoc = (_id: string) =>
    _id.startsWith(`${DocumentType.ROW}${SEPARATOR}`) ||
    _id.startsWith(`${DocumentType.LINK}${SEPARATOR}`)

  const replication = new dbCore.Replication({
    source: dbCore.getDevWorkspaceID(appId),
    target: prodWorkspaceId,
  })

  await replication.resolveInconsistencies([tableId])

  await replication.replicateApp({
    tablesToSync: undefined,
    checkpoint: false,
    filter: (doc: any) => {
      const _id = doc?._id as string
      if (!_id || _id.startsWith("_design")) {
        return false
      }
      if (_id.startsWith(DocumentType.AUTOMATION_LOG)) {
        return false
      }
      if (_id.startsWith(DocumentType.WORKSPACE_METADATA)) {
        return false
      }
      if (!matchesTable(_id)) {
        return false
      }
      if (!seedProductionTables && isDataDoc(_id)) {
        return false
      }
      return true
    },
  })

  const metadata = await sdk.workspaces.metadata.tryGet({
    production: true,
  })

  if (!metadata?._id) {
    ctx.throw(
      400,
      "Production workspace metadata missing. Please publish the workspace first."
    )
  }

  const publishedAt = new Date().toISOString()
  metadata.resourcesPublishedAt = {
    ...metadata.resourcesPublishedAt,
    [tableId]: publishedAt,
  }
  metadata.resourcesDeployedAt = {
    ...metadata.resourcesDeployedAt,
    [tableId]: publishedAt,
  }

  const prodDb = context.getProdWorkspaceDB()
  await prodDb.put(metadata)
  await cache.workspace.invalidateWorkspaceMetadata(prodWorkspaceId)

  ctx.body = {
    tableId,
    publishedAt: metadata.resourcesPublishedAt[tableId],
  }
}
