import { context, db, events, HTTPError } from "@budibase/backend-core"
import { utils } from "@budibase/shared-core"
import {
  AnyDocument,
  Automation,
  Datasource,
  DocumentType,
  INTERNAL_TABLE_SOURCE_ID,
  prefixed,
  Query,
  ResourceType,
  Screen,
  Table,
  UsedResource,
  WorkspaceApp,
} from "@budibase/types"
import sdk from "../.."
import { extractTableIdFromRowActionsID } from "../../../db/utils"

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

export async function duplicateResourcesToWorkspace(
  resources: string[],
  toWorkspace: string
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

  if (!toCopy.length) {
    return
  }

  const documentToCopy = await context
    .getWorkspaceDB()
    .getMultiple<AnyDocument>(resources, {
      allowMissing: false,
    })

  const fromWorkspace = context.getWorkspaceId()
  if (!fromWorkspace) {
    throw new Error("Could not get workspaceId")
  }
  await destinationDb.bulkDocs(
    documentToCopy.map<AnyDocument>(doc => {
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

  const fromWorkspaceName =
    (await sdk.workspaces.metadata.tryGet())?.name || fromWorkspace
  const toWorkspaceName = await context.doInContext(
    toWorkspace,
    async () => (await sdk.workspaces.metadata.tryGet())?.name || toWorkspace
  )

  for (const doc of documentToCopy) {
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
        throw utils.unreachable(type)
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
