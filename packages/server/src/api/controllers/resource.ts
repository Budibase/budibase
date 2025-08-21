import {
  ResourceUsageRequest,
  ResourceUsageResponse,
  ResourceType,
  UserCtx,
} from "@budibase/types"
import sdk from "../../sdk"

export async function searchForResourceUsage(
  ctx: UserCtx<ResourceUsageRequest, ResourceUsageResponse>
) {
  const { workspaceAppIds, automationIds } = ctx.request.body

  if (!workspaceAppIds?.length && !automationIds?.length) {
    ctx.throw(400, "No workspace apps or automations specified.")
  }

  ctx.body = {
    resources: await sdk.resources.searchForUsages(
      [ResourceType.TABLE, ResourceType.DATASOURCE],
      {
        automationIds,
        workspaceAppIds,
      }
    ),
  }
}
