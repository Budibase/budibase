import { context, db, HTTPError } from "@budibase/backend-core"
import {
  AnyDocument,
  INTERNAL_TABLE_SOURCE_ID,
  ResourceType,
  Screen,
  UsedResource,
} from "@budibase/types"
import sdk from "../.."

export async function getDependencies(): Promise<
  Record<string, UsedResource[]>
> {
  const automations = await sdk.automations.fetch()
  const workspaceApps = await sdk.workspaceApps.fetch()

  const dependencies: Record<string, UsedResource[]> = {}
  const baseSearchTargets: {
    id: string
    idToSearch: string
    name: string
    type: ResourceType
    extraDependencies?: {
      id: string

      name: string
      type: ResourceType
    }[]
  }[] = []

  // keep tables as may be used later
  const internalTables = await sdk.tables.getAllInternalTables()
  baseSearchTargets.push(
    ...internalTables.map(table => ({
      id: table._id!,
      idToSearch: table._id!,
      name: table.name!,
      type: ResourceType.TABLE,
      doc: table,
    }))
  )

  const datasources = await sdk.datasources.fetch()
  baseSearchTargets.push(
    ...datasources
      .filter(d => d._id !== INTERNAL_TABLE_SOURCE_ID)
      .map(datasource => ({
        id: datasource._id!,
        idToSearch: datasource._id!,
        name: datasource.name!,
        type: ResourceType.DATASOURCE,
        doc: datasource,
      }))
  )

  baseSearchTargets.push(
    ...automations.map(automation => ({
      id: automation._id!,
      idToSearch: automation._id!,
      name: automation.name!,
      type: ResourceType.AUTOMATION,
      doc: automation,
    }))
  )

  const queries = await sdk.queries.fetch()
  baseSearchTargets.push(
    ...queries.map(query => ({
      id: query._id!,
      idToSearch: query._id!,
      name: query.name!,
      type: ResourceType.QUERY,
      doc: query,
    }))
  )

  const rowActions = await sdk.rowActions.getAll()
  if (rowActions.length) {
    const rowActionNames = await sdk.rowActions.getNames(
      Object.values(rowActions).flatMap(ra => Object.values(ra.actions))
    )

    for (const ra of rowActions) {
      for (const [id, action] of Object.entries(ra.actions)) {
        baseSearchTargets.push({
          id: ra._id,
          idToSearch: id,
          name: rowActionNames[action.automationId],
          type: ResourceType.ROW_ACTION,
          extraDependencies: automations
            .filter(a => a._id === action.automationId)
            .map(a => ({
              id: a._id!,
              name: a.name!,
              type: ResourceType.AUTOMATION,
            })),
        })
      }
    }
  }

  const searchForUsages = (
    forResource: string,
    possibleUsages: AnyDocument
  ) => {
    const json = JSON.stringify(possibleUsages)
    dependencies[forResource] ??= []
    for (const search of baseSearchTargets) {
      if (
        json.includes(search.idToSearch) &&
        !dependencies[forResource].find(resource => resource.id === search.id)
      ) {
        dependencies[forResource].push({
          id: search.id,
          name: search.name,
          type: search.type,
        })

        const toAdd = [
          ...(search.extraDependencies || []),
          ...(dependencies[search.id] || []),
        ].filter(({ id }) => !dependencies[forResource].some(r => r.id === id))
        dependencies[forResource].push(...toAdd)
      }
    }
  }

  // Search in tables
  if (internalTables.length) {
    for (const table of internalTables) {
      searchForUsages(table._id!, table)
    }
  }

  // Search in automations
  if (automations.length) {
    for (const automation of automations) {
      searchForUsages(automation._id, automation)
    }
  }
  // Search in queries
  if (queries.length) {
    for (const query of queries) {
      searchForUsages(query._id!, query)
    }
  }

  // Search in workspace app screens
  if (workspaceApps.length) {
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
      dependencies[workspaceApp._id!] ??= []
      dependencies[workspaceApp._id!].push(
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
  }

  for (const rowActionResource of Object.values(dependencies)
    .flatMap(r => r)
    .filter(r => r.type === ResourceType.ROW_ACTION)) {
    const rowAction = rowActions.find(ra => ra._id === rowActionResource.id)
    if (!rowAction) {
      continue
    }

    for (const action of Object.values(rowAction.actions)) {
      if (
        dependencies[rowActionResource.id]?.some(
          r => r.id === action.automationId
        )
      ) {
        continue
      }
      const automation = automations.find(a => a._id === action.automationId)
      if (!automation) {
        continue
      }
      dependencies[rowActionResource.id] ??= []
      dependencies[rowActionResource.id].push({
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
    throw new HTTPError(`No resources to copy`, 400)
  }

  const documentToCopy = await context
    .getWorkspaceDB()
    .getMultiple<AnyDocument>(resources, {
      allowMissing: false,
    })

  await destinationDb.bulkDocs(
    documentToCopy.map<AnyDocument>(doc => {
      const sanitizedDoc: AnyDocument = { ...doc }
      delete sanitizedDoc._rev
      delete sanitizedDoc.createdAt
      delete sanitizedDoc.updatedAt
      return sanitizedDoc
    })
  )
}
