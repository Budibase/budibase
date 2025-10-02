import {
  DuplicateResourceToWorkspaceRequest,
  ResourceUsageResponse,
  UserCtx,
} from "@budibase/types"
import sdk from "../../sdk"

export async function searchForResourceUsage(
  ctx: UserCtx<void, ResourceUsageResponse>
) {
  ctx.body = {
    resources: await sdk.resources.searchForUsages(),
  }
}

export async function duplicateResourceToWorkspace(
  ctx: UserCtx<DuplicateResourceToWorkspaceRequest, void>
) {
  const { toWorkspace, resources } = ctx.request.body
  await sdk.resources.duplicateResourcesToWorkspace(resources, toWorkspace)
  ctx.status = 204
}
