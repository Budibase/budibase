import {
  ResourceAnalysisRequest,
  ResourceAnalysisResponse,
  ResourceType,
  Screen,
  UsedByType,
  UsedResource,
  UserCtx,
} from "@budibase/types"
import sdk from "../../sdk"

export async function analyzeResources(
  ctx: UserCtx<ResourceAnalysisRequest, ResourceAnalysisResponse>
) {
  const { workspaceAppIds, automationIds } = ctx.request.body

  if (!workspaceAppIds?.length && !automationIds?.length) {
    ctx.throw(401, "No workspace apps or automations specified.")
  }

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
    const resources: UsedResource[] = []
    for (let search of toSearchFor) {
      if (
        json.includes(search.id) &&
        resources.find(resource => resource.id !== search.id)
      ) {
        resources.push({
          ...search,
          usedBy: usedById,
          usedByType: usedByType,
        })
        break
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
      for (let screen of workspaceAppScreens[workspaceAppId]) {
        const json = JSON.stringify(screen)
        searchForResource(json, screen.workspaceAppId!, UsedByType.WORKSPACE)
      }
    }
  }
  if (automationIds?.length) {
    const automations = await sdk.automations.find(automationIds)
    for (let automation of automations) {
      const json = JSON.stringify(automation)
      searchForResource(json, automation._id!, UsedByType.AUTOMATION)
    }
  }

  ctx.body = {
    resources,
  }
}
