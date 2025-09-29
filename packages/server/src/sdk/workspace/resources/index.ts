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
}) {
  const resources: UsedResource[] = []
  const baseSearchTargets: { id: string; name: string; type: ResourceType }[] =
    []

  // keep tables as may be used later
  const tables = await sdk.tables.getAllInternalTables()
  baseSearchTargets.push(
    ...tables.map(table => ({
      id: table._id!,
      name: table.name!,
      type: ResourceType.TABLE,
    }))
  )

  const datasources = await sdk.datasources.fetch()
  baseSearchTargets.push(
    ...datasources.map(datasource => ({
      id: datasource._id!,
      name: datasource.name!,
      type: ResourceType.DATASOURCE,
    }))
  )

  const automations = await sdk.automations.fetch()
  baseSearchTargets.push(
    ...automations.map(automation => ({
      id: automation._id!,
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
      ...Object.entries(rowActionNames).map(([id, name]) => ({
        id: id,
        name: name,
        type: ResourceType.ROW_ACTION,
      }))
    )
  }

  const searchForResource = (json: string) => {
    for (const search of baseSearchTargets) {
      if (
        json.includes(search.id) &&
        !resources.find(resource => resource.id === search.id)
      ) {
        resources.push({
          ...search,
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

  function checkForNestedAutomations(resources: UsedResource[]) {
    const automationResources = resources.filter(
      r => r.type === ResourceType.AUTOMATION
    )
    const preResourceCount = resources.length
    for (const resource of automationResources) {
      const automation = automations.find(a => a._id === resource.id)
      const json = JSON.stringify(automation)
      searchForResource(json)
    }
    if (preResourceCount !== resources.length) {
      checkForNestedAutomations(resources)
    }
  }

  checkForNestedAutomations(resources)

  return resources
}

interface WorkspaceAppDuplicationPreparation {
  requiredResources: UsedResource[]
  docsToCopyMap: Map<string, AnyDocument>
  existingIds: Set<string>
  destinationDb: ReturnType<typeof db.getDB>
}

async function prepareWorkspaceAppDuplication(
  resourceId: string,
  toWorkspace: string
): Promise<WorkspaceAppDuplicationPreparation> {
  const requiredResources = await searchForUsages({
    workspaceAppIds: [resourceId],
  })

  const sourceDb = context.getWorkspaceDB()

  const destinationDb = db.getDB(db.getDevWorkspaceID(toWorkspace), {
    skip_setup: true,
  })
  if (!(await destinationDb.exists())) {
    throw new HTTPError("Destination workspace does not exist", 400)
  }

  const docsToCopy = await sourceDb.getMultiple([
    resourceId,
    ...requiredResources.map(r => r.id),
  ])

  const screens = await sdk.screens.fetch()
  const appScreens = screens.filter(
    screen => screen.workspaceAppId === resourceId
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

  const resources: UsedResource[] = [
    {
      id: resourceId,
      type: resourceType,
      name: undefined,
    },
    ...requiredResources,
  ]

  const toCopy: Partial<Record<ResourceType, UsedResource[]>> = {}
  const existing: Partial<Record<ResourceType, UsedResource[]>> = {}

  for (const resource of resources.filter(r => r.id !== resourceId)) {
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
