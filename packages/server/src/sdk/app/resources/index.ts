import sdk from "../.."
import { ResourceType, Screen, UsedByType, UsedResource } from "@budibase/types"

export async function analyseMinimal({
  automationIds,
  workspaceAppIds,
}: {
  automationIds?: string[]
  workspaceAppIds?: string[]
}) {
  const [tables, datasources] = await Promise.all([
    sdk.tables.getAllInternalTables(),
    sdk.datasources.fetch(),
  ])
  const toSearchFor: { id: string; name: string; type: ResourceType }[] = tables
    .map(table => ({
      id: table._id!,
      name: table.name!,
      type: ResourceType.TABLE,
    }))
    .concat(
      datasources.map(datasource => ({
        id: datasource._id!,
        name: datasource.name!,
        type: ResourceType.DATASOURCE,
      }))
    )

  let internalTableFound = false
  const resources: UsedResource[] = []
  const searchForResource = (
    json: string,
    usedById: string,
    usedByType: UsedByType
  ) => {
    for (let search of toSearchFor) {
      if (
        json.includes(search.id) &&
        !resources.find(
          resource => resource.id === search.id && resource.usedBy === usedById
        )
      ) {
        if (search.type === ResourceType.TABLE) {
          internalTableFound = true
        }
        resources.push({
          ...search,
          usedBy: usedById,
          usedByType: usedByType,
        })
      }
    }
  }

  if (workspaceAppIds?.length) {
    const screens = await sdk.screens.fetch()
    const workspaceAppScreens: Record<string, Screen[]> = {}

    for (let screen of screens) {
      if (!screen.workspaceAppId) {
        continue
      }
      if (!workspaceAppScreens[screen.workspaceAppId]) {
        workspaceAppScreens[screen.workspaceAppId] = []
      }
      workspaceAppScreens[screen.workspaceAppId].push(screen)
    }

    for (let workspaceAppId of workspaceAppIds) {
      const screens = workspaceAppScreens[workspaceAppId] || []
      for (let screen of screens) {
        const json = JSON.stringify(screen)
        searchForResource(json, screen.workspaceAppId!, UsedByType.WORKSPACE)
      }
    }
  }
  if (automationIds?.length) {
    const automations = await sdk.automations.find(automationIds, {
      allowMissing: true,
    })
    for (let automation of automations) {
      const json = JSON.stringify(automation)
      searchForResource(json, automation._id!, UsedByType.AUTOMATION)
    }
  }

  // internal table found, need to make sure all internal tables have been added
  if (internalTableFound) {
    for (let table of tables) {
      if (!resources.find(resource => resource.id === table._id)) {
        resources.push({
          id: table._id!,
          name: table.name,
          type: ResourceType.TABLE,
        })
      }
    }
  }
  return resources
}

export async function analyseAll(toCheck: {
  automationIds?: string[]
  workspaceAppIds?: string[]
}) {
  const minimalResources = await analyseMinimal(toCheck)
  // copy list, will expand it with queries and row actions
  const [rowActions, queries] = await Promise.all([
    sdk.rowActions.getAll(),
    sdk.queries.fetch(),
  ])

  let resources: UsedResource[] = [...minimalResources]
  for (let resource of minimalResources) {
    // datasources and tables will have their ID in the row action ID
    const tableActions = rowActions.filter(action =>
      action._id!.includes(resource.id)
    )
    resources.concat(
      tableActions.map(action => ({
        ...resource,
        id: action._id!,
        name: undefined,
        type: ResourceType.ROW_ACTION,
      }))
    )
    // queries only apply to datasources
    if (resource.type === ResourceType.DATASOURCE) {
      const datasourceQueries = queries.filter(
        query => query.datasourceId === resource.id
      )
      resources.concat(
        datasourceQueries.map(query => ({
          ...resource,
          id: query._id!,
          name: query.name,
          type: ResourceType.QUERY,
        }))
      )
    }
  }
  return resources
}
