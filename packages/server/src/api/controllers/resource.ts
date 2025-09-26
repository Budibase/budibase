import { getDocumentType } from "@budibase/shared-core"
import {
  DocumentType,
  DuplicateResourceToWorkspaceRequest,
  DuplicateResourceToWorkspaceResponse,
  DuplicateResourcePreviewResponse,
  ResourceType,
  ResourceUsageRequest,
  ResourceUsageResponse,
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
    resources: await sdk.resources.searchForUsages({
      automationIds,
      workspaceAppIds,
    }),
  }
}

export async function duplicateResourceToWorkspace(
  ctx: UserCtx<
    DuplicateResourceToWorkspaceRequest,
    DuplicateResourceToWorkspaceResponse,
    { id: string }
  >
) {
  const { toWorkspace } = ctx.request.body
  const { id } = ctx.params
  const documentType = getDocumentType(id)
  if (!documentType) {
    ctx.throw("Document type could not be inferred from the id", 400)
  }
  if (documentType !== DocumentType.WORKSPACE_APP) {
    ctx.throw(`"${documentType}" cannot be duplicated`, 400)
  }

  ctx.body = {
    resources: await sdk.resources.duplicateResourceToWorkspace(
      id,
      ResourceType.WORKSPACE_APP,
      toWorkspace
    ),
  }
}

export async function previewDuplicateResourceToWorkspace(
  ctx: UserCtx<
    DuplicateResourceToWorkspaceRequest,
    DuplicateResourcePreviewResponse,
    { id: string }
  >
) {
  const { toWorkspace } = ctx.request.body
  const { id } = ctx.params
  const documentType = getDocumentType(id)
  if (!documentType) {
    ctx.throw("Document type could not be inferred from the id", 400)
  }
  if (documentType !== DocumentType.WORKSPACE_APP) {
    ctx.throw(`"${documentType}" cannot be duplicated`, 400)
  }

  ctx.body = await sdk.resources.previewDuplicateResourceToWorkspace(
    id,
    ResourceType.WORKSPACE_APP,
    toWorkspace
  )
}
