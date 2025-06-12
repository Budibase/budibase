import sdk from "../.."
import {
  ResourceType,
  Screen,
  Table,
  TableRowActions,
  UsedResource,
} from "@budibase/types"

export async function searchForUsages(
  toSearchFor: Exclude<ResourceType, ResourceType.AUTOMATION>[],
  {
    automationIds,
    workspaceAppIds,
  }: {
    automationIds?: string[]
    workspaceAppIds?: string[]
  }
) {
  const shouldSearchTables = toSearchFor.includes(ResourceType.TABLE)
  const shouldSearchDatasources = toSearchFor.includes(ResourceType.DATASOURCE)
  const shouldSearchQueries = toSearchFor.includes(ResourceType.QUERY)
  const shouldSearchRowActions = toSearchFor.includes(ResourceType.ROW_ACTION)

  const resources: UsedResource[] = []
  const baseSearchTargets: { id: string; name: string; type: ResourceType }[] =
    []

  // keep tables as may be used later
  let tables: Table[] = []
  if (shouldSearchTables) {
    tables = await sdk.tables.getAllInternalTables()
    baseSearchTargets.push(
      ...tables.map(table => ({
        id: table._id!,
        name: table.name!,
        type: ResourceType.TABLE,
      }))
    )
  }

  if (shouldSearchDatasources) {
    const datasources = await sdk.datasources.fetch()
    baseSearchTargets.push(
      ...datasources.map(datasource => ({
        id: datasource._id!,
        name: datasource.name!,
        type: ResourceType.DATASOURCE,
      }))
    )
  }

  let internalTableFound = false
  const searchForResource = (json: string) => {
    for (const search of baseSearchTargets) {
      if (
        json.includes(search.id) &&
        !resources.find(resource => resource.id === search.id)
      ) {
        if (search.type === ResourceType.TABLE) {
          internalTableFound = true
        }
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

  // If internal table found and we're searching for tables, add all internal tables
  if (internalTableFound && tables.length) {
    for (const table of tables) {
      if (!resources.find(resource => resource.id === table._id)) {
        resources.push({
          id: table._id!,
          name: table.name,
          type: ResourceType.TABLE,
        })
      }
    }
  }

  if (shouldSearchQueries) {
    const queries = await sdk.queries.fetch()
    for (const resource of resources) {
      if (resource.type !== ResourceType.DATASOURCE) {
        continue
      }
      const datasourceQueries = queries.filter(
        query => query.datasourceId === resource.id
      )
      resources.push(
        ...datasourceQueries.map(query => ({
          id: query._id!,
          name: query.name,
          type: ResourceType.QUERY,
        }))
      )
    }
  }

  if (shouldSearchRowActions) {
    let usedActions: TableRowActions[] = []
    const rowActions = await sdk.rowActions.getAll()
    for (const resource of resources) {
      if (
        resource.type !== ResourceType.TABLE &&
        resource.type !== ResourceType.DATASOURCE
      ) {
        continue
      }
      const tableActions = rowActions.filter(action =>
        action._id!.includes(resource.id)
      )
      usedActions = usedActions.concat(tableActions)
      resources.push(
        ...tableActions.map(action => ({
          id: action._id!,
          name: undefined,
          type: ResourceType.ROW_ACTION,
        }))
      )
    }

    // Add row action automations if searching for automations
    if (usedActions.length > 0) {
      const actionAutomationIds = usedActions.flatMap(actionDoc =>
        Object.values(actionDoc.actions).map(action => action.automationId)
      )
      const missingAutomationIds = actionAutomationIds.filter(
        id => !resources.find(resource => resource.id === id)
      )
      const automations = await sdk.automations.find(missingAutomationIds)
      resources.push(
        ...automations.map(automation => ({
          id: automation._id!,
          name: automation.name,
          type: ResourceType.AUTOMATION,
        }))
      )
    }
  }

  return resources
}
