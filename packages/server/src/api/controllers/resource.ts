import {
  DuplicateResourceToWorkspaceRequest,
  ResourceDependenciesResponse,
  UserCtx,
} from "@budibase/types"
import sdk from "../../sdk"

export async function getResourceDependencies(
  ctx: UserCtx<void, ResourceDependenciesResponse>
) {
  ctx.body = {
    resources: await sdk.resources.getResourcesInfo(),
  }
}

export async function duplicateResourceToWorkspace(
  ctx: UserCtx<DuplicateResourceToWorkspaceRequest, void>
) {
  const { toWorkspace, resources } = ctx.request.body
  await sdk.resources.duplicateResourcesToWorkspace(resources, toWorkspace)
  ctx.status = 204
}
