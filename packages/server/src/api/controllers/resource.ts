import {
  DuplicateResourceToWorkspaceRequest,
  ResourceDependenciesResponse,
  UserCtx,
} from "@budibase/types"
import { users } from "@budibase/backend-core"
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
  const { toWorkspace, resources, copyRows } = ctx.request.body
  if (!users.isAdmin(ctx.user) && !users.isBuilder(ctx.user, toWorkspace)) {
    ctx.throw(403, "Only app builders or admins can duplicate resources.")
  }

  await sdk.resources.duplicateResourcesToWorkspace(resources, toWorkspace, {
    copyRows,
  })
  ctx.status = 204
}
