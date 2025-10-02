import { context, db, HTTPError } from "@budibase/backend-core"
import {
  AnyDocument,
  DuplicateResourcePreviewResponse,
  ResourceType,
  Screen,
  UsedResource,
} from "@budibase/types"
import sdk from "../.."

export async function searchForUsages({
  automationIds,
  workspaceAppIds,
}: {
  automationIds?: string[]
  workspaceAppIds?: string[]
}): Promise<UsedResource[]> {
  const resources: UsedResource[] = []
  const baseSearchTargets: {
    id: string
    idToSearch: string
    name: string
    type: ResourceType
  }[] = []

  // keep tables as may be used later
  const tables = await sdk.tables.getAllInternalTables()
  baseSearchTargets.push(
    ...tables.map(table => ({
      id: table._id!,
      idToSearch: table._id!,
      name: table.name!,
      type: ResourceType.TABLE,
    }))
  )

  const datasources = await sdk.datasources.getExternalDatasources()
  baseSearchTargets.push(
    ...datasources.map(datasource => ({
      id: datasource._id!,
      idToSearch: datasource._id!,
      name: datasource.name!,
      type: ResourceType.DATASOURCE,
    }))
  )

  const automations = await sdk.automations.fetch()
  baseSearchTargets.push(
    ...automations.map(automation => ({
      id: automation._id!,
      idToSearch: automation._id!,
      name: automation.name!,
      type: ResourceType.AUTOMATION,
    }))
  )

  const rowActions = await sdk.rowActions.getAll()
  if (rowActions.length) {
    const rowActionNames = await sdk.rowActions.getNames(
      Object.values(rowActions).flatMap(ra => Object.values(ra.actions))
    )

    baseSearchTargets.push(
      ...Object.values(rowActions).flatMap(ra =>
        Object.entries(ra.actions).map(([id, action]) => ({
          id: ra._id,
          idToSearch: id,
          name: rowActionNames[action.automationId],
          type: ResourceType.ROW_ACTION,
        }))
      )
    )
  }

  const searchForResource = (json: string) => {
    for (const search of baseSearchTargets) {
      if (
        json.includes(search.idToSearch) &&
        !resources.find(resource => resource.id === search.id)
      ) {
        resources.push({
          id: search.id,
          name: search.name,
          type: search.type,
        })
      }
    }
  }

  // Search in workspace app screens
  if (workspaceAppIds?.length) {
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

    for (const workspaceAppId of workspaceAppIds) {
      const screens = workspaceAppScreens[workspaceAppId] || []
      for (const screen of screens) {
        const json = JSON.stringify(screen)
        searchForResource(json)
      }
    }
  }

  // Search in automations
  if (automationIds?.length) {
    const automations = await sdk.automations.find(automationIds, {
      allowMissing: true,
    })
    for (const automation of automations) {
      const json = JSON.stringify(automation)
      searchForResource(json)
    }
  }

  for (const rowActionResource of resources.filter(
    r => r.type === ResourceType.ROW_ACTION
  )) {
    const rowAction = rowActions.find(ra => ra._id === rowActionResource.id)
    if (!rowAction) {
      continue
    }

    for (const action of Object.values(rowAction.actions)) {
      if (resources.some(r => r.id === action.automationId)) {
        continue
      }
      const automation = automations.find(a => a._id === action.automationId)
      if (!automation) {
        continue
      }
      resources.push({
        id: automation._id,
        name: automation.name,
        type: ResourceType.AUTOMATION,
      })
    }
  }

  function checkForNestedResources(
    resources: UsedResource[],
    resourceType: ResourceType,
    docs: AnyDocument[]
  ) {
    const filteredResources = resources.filter(r => r.type === resourceType)
    const preResourceCount = resources.length
    for (const resource of filteredResources) {
      const doc = docs.find(a => a._id === resource.id)
      const json = JSON.stringify(doc)
      searchForResource(json)
    }
    if (preResourceCount !== resources.length) {
      checkForNestedResources(resources, resourceType, docs)
    }
  }

  checkForNestedResources(resources, ResourceType.AUTOMATION, automations)
  checkForNestedResources(resources, ResourceType.TABLE, tables)

  return resources
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
  const { toCopy, existing } = await previewDuplicateResourceToWorkspace(
    resources,
    toWorkspace
  )
  if (existing.length) {
    throw new HTTPError(
      `Resources already exist in destination workspace: ${existing.join(", ")}`,
      400
    )
  }
  if (!toCopy.length) {
    throw new HTTPError(`No resources to copy`, 400)
  }

  const documentToCopy = await context
    .getWorkspaceDB()
    .getMultiple<AnyDocument>(resources, {
      allowMissing: false,
    })

  const destinationDb = await getDestinationDb(toWorkspace)

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

export async function previewDuplicateResourceToWorkspace(
  resources: string[],
  toWorkspace: string
): Promise<DuplicateResourcePreviewResponse> {
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

  return {
    toCopy: toCopy,
    existing: existingIds.values().toArray(),
  }
}
