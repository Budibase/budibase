import {
  context,
  db,
  events,
  HTTPError,
  logging,
  objectStore,
} from "@budibase/backend-core"
import chunk from "lodash/chunk"
import {
  AnyDocument,
  Automation,
  Datasource,
  DocumentType,
  INTERNAL_TABLE_SOURCE_ID,
  FieldType,
  DatabaseQueryOpts,
  Row,
  RowAttachment,
  WithDocMetadata,
  prefixed,
  Query,
  ResourceType,
  Screen,
  Table,
  UsedResource,
  WorkspaceApp,
} from "@budibase/types"
import sdk from "../.."
import { ObjectStoreBuckets } from "../../../constants"
import { extractTableIdFromRowActionsID, getRowParams } from "../../../db/utils"

export async function getResourcesInfo(): Promise<
  Record<string, { dependencies: UsedResource[] }>
> {
  const automations = await sdk.automations.fetch()
  const workspaceApps = await sdk.workspaceApps.fetch()

  const dependencies: Record<string, { dependencies: UsedResource[] }> = {}
  interface BaseSearchTarget {
    id: string
    idToSearch: string
    name: string
    type: ResourceType
    extraDependencies?: {
      id: string
      name: string
      type: ResourceType
    }[]
  }
  const baseSearchTargets: BaseSearchTarget[] = []

  const internalTables = await sdk.tables.getAllInternalTables()
  const rowActions = await sdk.rowActions.getAll()

  baseSearchTargets.push(
    ...internalTables.map(table => ({
      id: table._id!,
      idToSearch: table._id!,
      name: table.name!,
      type: ResourceType.TABLE,
    }))
  )

  const datasources = await sdk.datasources.fetch()
  baseSearchTargets.push(
    ...datasources
      .filter(d => d._id !== INTERNAL_TABLE_SOURCE_ID)
      .map<BaseSearchTarget>(datasource => ({
        id: datasource._id!,
        idToSearch: datasource._id!,
        name: datasource.name!,
        type: ResourceType.DATASOURCE,
      }))
  )

  baseSearchTargets.push(
    ...automations.map<BaseSearchTarget>(automation => ({
      id: automation._id!,
      idToSearch: automation._id!,
      name: automation.name!,
      type: ResourceType.AUTOMATION,
    }))
  )

  const queries = await sdk.queries.fetch()
  baseSearchTargets.push(
    ...queries.map<BaseSearchTarget>(query => ({
      id: query._id!,
      idToSearch: query._id!,
      name: query.name!,
      type: ResourceType.QUERY,
    }))
  )

  if (rowActions.length) {
    const rowActionNames = await sdk.rowActions.getNames(
      Object.values(rowActions).flatMap(ra => Object.values(ra.actions))
    )

    for (const ra of rowActions) {
      const rowActionAutomations = Object.entries(ra.actions).flatMap(
        ([_id, action]) =>
          automations
            .filter(a => a._id === action.automationId)
            .map(a => ({
              id: a._id!,
              name: a.name!,
              type: ResourceType.AUTOMATION,
            }))
      )
      for (const [id, action] of Object.entries(ra.actions)) {
        for (const idToSearch of [id, extractTableIdFromRowActionsID(ra._id)]) {
          baseSearchTargets.push({
            id: ra._id,
            idToSearch,
            name: rowActionNames[action.automationId],
            type: ResourceType.ROW_ACTION,
            extraDependencies: rowActionAutomations,
          })
        }
      }
    }
  }

  const searchForUsages = (
    forResource: string,
    possibleUsages: AnyDocument
  ) => {
    const json = JSON.stringify(possibleUsages)
    dependencies[forResource] ??= { dependencies: [] }
    for (const search of baseSearchTargets) {
      if (
        json.includes(search.idToSearch) &&
        !dependencies[forResource].dependencies.find(
          resource => resource.id === search.id
        )
      ) {
        dependencies[forResource].dependencies.push({
          id: search.id,
          name: search.name,
          type: search.type,
        })

        const toAdd = [
          ...(search.extraDependencies || []),
          ...(dependencies[search.id]?.dependencies || []),
        ].filter(
          ({ id }) =>
            !dependencies[forResource].dependencies.some(r => r.id === id)
        )
        dependencies[forResource].dependencies.push(...toAdd)
      }
    }
  }

  // Search in tables
  for (const table of internalTables) {
    searchForUsages(table._id!, table)
  }

  // Search in automations
  for (const automation of automations) {
    searchForUsages(automation._id, automation)
  }

  // Search in queries
  for (const query of queries) {
    searchForUsages(query._id!, query)
  }

  // Search in workspace app screens
  const screens = await sdk.screens.fetch()
  const workspaceAppScreens: Record<string, Screen[]> = {}

  for (const screen of screens) {
    if (!screen.workspaceAppId) {
      continue
    }
    if (!workspaceAppScreens[screen.workspaceAppId]) {
      workspaceAppScreens[screen.workspaceAppId] = []
    }
    workspaceAppScreens[screen.workspaceAppId].push(screen)
  }

  for (const workspaceApp of workspaceApps) {
    const screens = workspaceAppScreens[workspaceApp._id!] || []
    dependencies[workspaceApp._id!] ??= { dependencies: [] }
    dependencies[workspaceApp._id!].dependencies.push(
      ...screens.map(s => ({
        id: s._id!,
        name: s.name!,
        type: ResourceType.SCREEN,
      }))
    )

    for (const screen of screens) {
      searchForUsages(workspaceApp._id!, screen)
    }
  }

  for (const rowActionResource of Object.values(dependencies)
    .flatMap(r => r.dependencies)
    .filter(r => r.type === ResourceType.ROW_ACTION)) {
    const rowAction = rowActions.find(ra => ra._id === rowActionResource.id)
    if (!rowAction) {
      continue
    }

    for (const action of Object.values(rowAction.actions)) {
      if (
        dependencies[rowActionResource.id]?.dependencies.some(
          r => r.id === action.automationId
        )
      ) {
        continue
      }
      const automation = automations.find(a => a._id === action.automationId)
      if (!automation) {
        continue
      }
      dependencies[rowActionResource.id] ??= { dependencies: [] }
      dependencies[rowActionResource.id].dependencies.push({
        id: automation._id,
        name: automation.name,
        type: ResourceType.AUTOMATION,
      })
    }
  }

  return dependencies
}

async function getDestinationDb(toWorkspace: string) {
  const destinationDb = db.getDB(db.getDevWorkspaceID(toWorkspace), {
    skip_setup: true,
  })
  if (!(await destinationDb.exists())) {
    throw new HTTPError("Destination workspace does not exist", 400)
  }

  return destinationDb
}

const resourceTypeIdPrefixes: Record<ResourceType, string> = {
  [ResourceType.DATASOURCE]: prefixed(DocumentType.DATASOURCE),
  [ResourceType.TABLE]: prefixed(DocumentType.TABLE),
  [ResourceType.ROW_ACTION]: prefixed(DocumentType.ROW_ACTIONS),
  [ResourceType.QUERY]: prefixed(DocumentType.QUERY),
  [ResourceType.AUTOMATION]: prefixed(DocumentType.AUTOMATION),
  [ResourceType.WORKSPACE_APP]: prefixed(DocumentType.WORKSPACE_APP),
  [ResourceType.SCREEN]: prefixed(DocumentType.SCREEN),
}

function getResourceType(id: string): ResourceType | undefined {
  const type = Object.entries(resourceTypeIdPrefixes).find(([_, idPrefix]) =>
    id.startsWith(idPrefix)
  )?.[0] as ResourceType | undefined
  return type
}

function isAutomation(doc: AnyDocument): doc is Automation {
  if (!doc._id) {
    return false
  }
  const type = getResourceType(doc._id)
  return type === ResourceType.AUTOMATION
}

function isWorkspaceApp(doc: AnyDocument): doc is WorkspaceApp {
  if (!doc._id) {
    return false
  }
  const type = getResourceType(doc._id)
  return type === ResourceType.WORKSPACE_APP
}

function isTable(doc: AnyDocument): doc is WithDocMetadata<Table> {
  if (!doc._id) {
    return false
  }
  const type = getResourceType(doc._id)
  return type === ResourceType.TABLE
}

const ATTACHMENT_FIELD_TYPES = new Set<FieldType>([
  FieldType.ATTACHMENTS,
  FieldType.ATTACHMENT_SINGLE,
  FieldType.SIGNATURE_SINGLE,
])

type AttachmentColumn = { field: string; type: FieldType }

const isAttachmentColumn = (column: { type?: FieldType } | undefined) =>
  !!column?.type && ATTACHMENT_FIELD_TYPES.has(column.type)

const getAttachmentColumns = (table: Table): AttachmentColumn[] => {
  if (!table.schema) {
    return []
  }
  return Object.entries(table.schema)
    .filter(([, column]) => isAttachmentColumn(column))
    .map(([field, column]) => ({ field, type: column.type as FieldType }))
}

interface AttachmentCopyContext {
  sourceProdWorkspaceId: string
  destinationProdWorkspaceId: string
  cache: Map<string, Promise<string | undefined>>
}

const buildDestinationAttachmentKey = (
  key: string,
  sourceProdWorkspaceId: string,
  destinationProdWorkspaceId: string
) => {
  if (!key?.startsWith(`${sourceProdWorkspaceId}/`)) {
    return key
  }
  if (sourceProdWorkspaceId === destinationProdWorkspaceId) {
    return key
  }
  const suffix = key.slice(sourceProdWorkspaceId.length)
  return `${destinationProdWorkspaceId}${suffix}`
}

async function copyAttachmentToWorkspace(
  key: string,
  destinationKey: string,
  cache: Map<string, Promise<string | undefined>>
): Promise<string | undefined> {
  if (!key || key === destinationKey) {
    return key
  }
  if (!cache.has(key)) {
    cache.set(
      key,
      (async () => {
        try {
          const alreadyExists = await objectStore.objectExists(
            ObjectStoreBuckets.APPS,
            destinationKey
          )
          if (alreadyExists) {
            return destinationKey
          }
        } catch (err) {
          logging.logWarn(
            "Resource duplication: failed to check attachment existence",
            {
              err,
              key,
              destinationKey,
            }
          )
        }
        try {
          const { stream, contentType } = await objectStore.getReadStream(
            ObjectStoreBuckets.APPS,
            key
          )
          await objectStore.streamUpload({
            bucket: ObjectStoreBuckets.APPS,
            stream,
            filename: destinationKey,
            type: contentType,
          })
          return destinationKey
        } catch (err) {
          logging.logWarn("Resource duplication: failed to copy attachment", {
            err,
            key,
            destinationKey,
          })
          return undefined
        }
      })()
    )
  }
  const copiedKey = await cache.get(key)!
  if (copiedKey === undefined) {
    cache.delete(key)
  }
  return copiedKey
}

async function remapAttachmentValue(
  attachment: RowAttachment,
  context: AttachmentCopyContext
): Promise<RowAttachment> {
  if (
    !attachment?.key ||
    !context.sourceProdWorkspaceId ||
    !context.destinationProdWorkspaceId ||
    context.sourceProdWorkspaceId === context.destinationProdWorkspaceId
  ) {
    return attachment
  }

  const destinationKey = buildDestinationAttachmentKey(
    attachment.key,
    context.sourceProdWorkspaceId,
    context.destinationProdWorkspaceId
  )
  if (!destinationKey || destinationKey === attachment.key) {
    return attachment
  }

  const copiedKey = await copyAttachmentToWorkspace(
    attachment.key,
    destinationKey,
    context.cache
  )

  if (!copiedKey) {
    return attachment
  }

  return {
    ...attachment,
    key: copiedKey,
    url: "",
  }
}

async function remapRowAttachments(
  row: Row,
  columns: AttachmentColumn[],
  context: AttachmentCopyContext
) {
  if (!columns.length) {
    return
  }

  const rowData: Record<string, unknown> = row

  for (const column of columns) {
    const value = rowData[column.field]
    if (!value) {
      continue
    }
    if (column.type === FieldType.ATTACHMENTS && Array.isArray(value)) {
      const updated: RowAttachment[] = []
      for (const attachment of value as RowAttachment[]) {
        const remapped = await remapAttachmentValue(attachment, context)
        updated.push(remapped)
      }
      rowData[column.field] = updated
    } else if (
      (column.type === FieldType.ATTACHMENT_SINGLE ||
        column.type === FieldType.SIGNATURE_SINGLE) &&
      value
    ) {
      rowData[column.field] = await remapAttachmentValue(
        value as RowAttachment,
        context
      )
    }
  }
}

const ROW_PAGE_SIZE = 1000
const ROW_CHUNK_SIZE = 250
const ROW_WRITE_RETRIES = 3
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

async function fetchTableRowsPage(
  tableId: string,
  startAfter?: string
): Promise<{
  rows: Row[]
  nextStartAfter?: string
}> {
  const sourceDb = context.getWorkspaceDB()
  const params: Partial<DatabaseQueryOpts> = {
    include_docs: true,
    limit: ROW_PAGE_SIZE + (startAfter ? 1 : 0),
  }
  if (startAfter) {
    params.startkey = startAfter
    params.skip = 1
  }
  const response = await sourceDb.allDocs<Row>(
    getRowParams(tableId, null, params)
  )

  const docs = response.rows
    .map(row => row.doc)
    .filter((doc): doc is Row => !!doc)
  const rows = docs.length > ROW_PAGE_SIZE ? docs.slice(0, ROW_PAGE_SIZE) : docs
  const nextStartAfter =
    rows.length === ROW_PAGE_SIZE ? rows[rows.length - 1]._id : undefined
  return { rows, nextStartAfter }
}

async function bulkInsertRows(
  destinationDb: ReturnType<typeof db.getDB>,
  docs: AnyDocument[]
) {
  const chunks = chunk(docs, ROW_CHUNK_SIZE)
  for (const chunk of chunks) {
    let pending = chunk
    let attempts = 0
    while (pending.length && attempts < ROW_WRITE_RETRIES) {
      attempts++
      const response = (await destinationDb.bulkDocs(pending)) as Array<{
        error?: unknown
      }>
      const failed: AnyDocument[] = []
      response.forEach((result, idx) => {
        if (result.error) {
          failed.push(pending[idx])
        }
      })

      if (!failed.length) {
        break
      }

      if (attempts >= ROW_WRITE_RETRIES) {
        throw new Error(
          `Failed to copy ${failed.length} row(s) after ${ROW_WRITE_RETRIES} attempts.`
        )
      }

      await delay(attempts * 250)
      pending = failed
    }
  }
}

async function duplicateInternalTableRows(
  tables: WithDocMetadata<Table>[],
  destinationDb: ReturnType<typeof db.getDB>,
  fromWorkspace: string,
  toWorkspace: string
) {
  if (!tables.length) {
    return
  }

  const sourceProdWorkspaceId = db.getProdWorkspaceID(fromWorkspace)
  const destinationProdWorkspaceId = db.getProdWorkspaceID(toWorkspace)
  const attachmentCopyCache = new Map<string, Promise<string | undefined>>()

  for (const table of tables) {
    if (table.sourceId !== INTERNAL_TABLE_SOURCE_ID) {
      continue
    }

    const destinationHasRows = !!(
      await destinationDb.allDocs(
        getRowParams(table._id!, null, {
          include_docs: false,
          limit: 1,
        })
      )
    ).rows.length
    if (destinationHasRows) {
      logging.logWarn(
        "Resource duplication: destination table already contains rows, skipping copy",
        { tableId: table._id, tableName: table.name }
      )
      continue
    }

    const attachmentColumns = getAttachmentColumns(table)
    let startAfter: string | undefined = undefined

    do {
      const { rows, nextStartAfter } = await fetchTableRowsPage(
        table._id!,
        startAfter
      )
      startAfter = nextStartAfter

      if (!rows.length) {
        break
      }

      const sanitizedRows: AnyDocument[] = []
      for (const row of rows) {
        await remapRowAttachments(row, attachmentColumns, {
          sourceProdWorkspaceId,
          destinationProdWorkspaceId,
          cache: attachmentCopyCache,
        })
        const sanitizedRow: AnyDocument = {
          ...row,
          fromWorkspace,
        }
        delete sanitizedRow._rev
        delete sanitizedRow.createdAt
        delete sanitizedRow.updatedAt
        sanitizedRows.push(sanitizedRow)
      }

      await bulkInsertRows(destinationDb, sanitizedRows)
    } while (startAfter)
  }
}

export async function duplicateResourcesToWorkspace(
  resources: string[],
  toWorkspace: string,
  options?: {
    copyRows?: boolean
  }
) {
  resources = Array.from(new Set(resources).keys())

  const destinationDb = await getDestinationDb(toWorkspace)

  const existingDocuments = await destinationDb.getMultiple<AnyDocument>(
    resources,
    {
      allowMissing: true,
    }
  )
  const existingIds = new Set(existingDocuments.map(doc => doc._id))
  const toCopy = resources.filter(id => !existingIds.has(id))

  const documentToCopy = await context
    .getWorkspaceDB()
    .getMultiple<AnyDocument>(resources, {
      allowMissing: false,
    })
  const docsToInsert = documentToCopy.filter(
    doc => doc._id && toCopy.includes(doc._id)
  )

  const fromWorkspace = context.getWorkspaceId()
  if (!fromWorkspace) {
    throw new Error("Could not get workspaceId")
  }
  if (docsToInsert.length) {
    await destinationDb.bulkDocs(
      docsToInsert.map<AnyDocument>(doc => {
        const sanitizedDoc: AnyDocument = { ...doc, fromWorkspace }
        delete sanitizedDoc._rev
        delete sanitizedDoc.createdAt
        delete sanitizedDoc.updatedAt
        if (isAutomation(sanitizedDoc) || isWorkspaceApp(sanitizedDoc)) {
          sanitizedDoc.disabled = true
        }
        if (isAutomation(sanitizedDoc)) {
          sanitizedDoc.appId = toWorkspace
        }
        return sanitizedDoc
      })
    )
  }

  if (options?.copyRows ?? true) {
    await duplicateInternalTableRows(
      documentToCopy.filter(isTable),
      destinationDb,
      fromWorkspace,
      toWorkspace
    )
  }

  if (!docsToInsert.length) {
    return
  }

  const fromWorkspaceName =
    (await sdk.workspaces.metadata.tryGet())?.name || fromWorkspace
  const toWorkspaceName = await context.doInContext(
    toWorkspace,
    async () => (await sdk.workspaces.metadata.tryGet())?.name || toWorkspace
  )

  for (const doc of docsToInsert) {
    let name: string, displayType: string
    const type = getResourceType(doc._id)

    switch (type) {
      case ResourceType.AUTOMATION:
        name = (doc as Automation).name
        displayType = "Automation"
        break
      case ResourceType.DATASOURCE:
        name = (doc as Datasource).name || "Unknown"
        displayType = "Datasource"
        break
      case ResourceType.QUERY:
        name = (doc as Query).name
        displayType = "Query"
        break
      case ResourceType.ROW_ACTION:
        name = doc._id // We don't really have a row action name
        displayType = "Row action"
        break
      case ResourceType.TABLE:
        name = (doc as Table).name
        displayType = "Table"
        break
      case ResourceType.SCREEN:
        name = (doc as Screen).name || "Unkown"
        displayType = "Screen"
        break
      case ResourceType.WORKSPACE_APP:
        name = (doc as WorkspaceApp).name
        displayType = "App"
        break
      case undefined:
        throw new Error("Resource type could not be infered")
      default:
        throw new Error("Unreachable")
    }

    const resource = {
      id: doc._id,
      name,
      type: displayType,
    }

    await events.resource.duplicatedToWorkspace({
      resource,
      fromWorkspace: fromWorkspaceName,
      toWorkspace: toWorkspaceName,
    })
  }
}
