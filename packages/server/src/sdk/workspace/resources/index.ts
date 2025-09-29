import {
  context,
  db,
  HTTPError,
  NotImplementedError,
} from "@budibase/backend-core"
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

  const datasources = await sdk.datasources.fetch()
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

interface WorkspaceAppDuplicationPreparation {
  requiredResources: UsedResource[]
  docsToCopyMap: Map<string, AnyDocument>
  existingIds: Set<string>
  destinationDb: ReturnType<typeof db.getDB>
}

async function prepareWorkspaceAppDuplication(
  workspaceId: string,
  toWorkspace: string
): Promise<WorkspaceAppDuplicationPreparation> {
  const destinationDb = db.getDB(db.getDevWorkspaceID(toWorkspace), {
    skip_setup: true,
  })
  if (!(await destinationDb.exists())) {
    throw new HTTPError("Destination workspace does not exist", 400)
  }

  if (await destinationDb.exists(workspaceId)) {
    throw new HTTPError("App already migrated in this workspace", 400)
  }

  const requiredResources = await searchForUsages({
    workspaceAppIds: [workspaceId],
  })

  const sourceDb = context.getWorkspaceDB()

  const docsToCopy = await sourceDb.getMultiple([
    workspaceId,
    ...requiredResources.map(r => r.id),
  ])

  const screens = await sdk.screens.fetch()
  const appScreens = screens.filter(
    screen => screen.workspaceAppId === workspaceId
  )
  docsToCopy.push(...appScreens)

  const docsToCopyMap = new Map(
    docsToCopy.filter(doc => !!doc._id).map(doc => [doc._id!, doc])
  )

  const existingDocuments = await destinationDb.getMultiple<AnyDocument>(
    Array.from(docsToCopyMap.keys()),
    {
      allowMissing: true,
    }
  )
  const existingIds = new Set(
    existingDocuments
      .map(doc => doc._id ?? (doc as { id?: string }).id)
      .filter((id): id is string => !!id)
  )

  return {
    requiredResources,
    docsToCopyMap,
    existingIds,
    destinationDb,
  }
}

export async function duplicateResourceToWorkspace(
  resourceId: string,
  resourceType: ResourceType.WORKSPACE_APP,
  toWorkspace: string
): Promise<Partial<Record<ResourceType, string[]>>> {
  if (resourceType !== ResourceType.WORKSPACE_APP) {
    throw new NotImplementedError(
      `Duplicating ${resourceType} is not supported`
    )
  }

  const { requiredResources, docsToCopyMap, existingIds, destinationDb } =
    await prepareWorkspaceAppDuplication(resourceId, toWorkspace)

  const documentsToPersist = Array.from(docsToCopyMap.values()).filter(
    doc => doc._id && !existingIds.has(doc._id)
  )

  if (documentsToPersist.length) {
    await destinationDb.bulkDocs(
      documentsToPersist.map<AnyDocument>(doc => {
        const sanitizedDoc = { ...doc }
        delete sanitizedDoc._rev
        delete sanitizedDoc.createdAt
        delete sanitizedDoc.updatedAt
        return sanitizedDoc
      })
    )
  }

  return {
    [resourceType]: [resourceId],
    ...requiredResources.reduce<Partial<Record<ResourceType, string[]>>>(
      (acc, r) => {
        acc[r.type] ??= []
        acc[r.type]!.push(r.id)
        return acc
      },
      {}
    ),
  }
}

export async function previewDuplicateResourceToWorkspace(
  resourceId: string,
  resourceType: ResourceType.WORKSPACE_APP,
  toWorkspace: string
): Promise<DuplicateResourcePreviewResponse> {
  if (resourceType !== ResourceType.WORKSPACE_APP) {
    throw new NotImplementedError(
      `Duplicating ${resourceType} is not supported`
    )
  }

  const { requiredResources, existingIds } =
    await prepareWorkspaceAppDuplication(resourceId, toWorkspace)

  const resources: UsedResource[] = [...requiredResources]

  const toCopy: Partial<Record<ResourceType, UsedResource[]>> = {}
  const existing: Partial<Record<ResourceType, UsedResource[]>> = {}

  for (const resource of resources) {
    if (existingIds.has(resource.id)) {
      existing[resource.type] = [...(existing[resource.type] || []), resource]
    } else {
      toCopy[resource.type] = [...(toCopy[resource.type] || []), resource]
    }
  }

  return {
    toCopy: toCopy,
    existing: existing,
  }
}
