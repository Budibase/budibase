import {
  DuplicateResourcePreviewResponse,
  DuplicateResourceToWorkspaceRequest,
  ResourceUsageRequest,
  ResourceUsageResponse,
  UserCtx,
} from "@budibase/types"
import sdk from "../../sdk"

export async function searchForResourceUsage(
  ctx: UserCtx<ResourceUsageRequest, ResourceUsageResponse>
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

export async function previewDuplicateResourceToWorkspace(
  ctx: UserCtx<
    DuplicateResourceToWorkspaceRequest,
    DuplicateResourcePreviewResponse
  >
) {
  const { toWorkspace, resources } = ctx.request.body

  ctx.body = await sdk.resources.previewDuplicateResourceToWorkspace(
    resources,
    toWorkspace
  )
}
