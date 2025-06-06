import sdk from "../.."
import { ResourceType, Screen, UsedByType, UsedResource } from "@budibase/types"

export async function analyse({
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
  return resources
}

export async function fullList() {}
