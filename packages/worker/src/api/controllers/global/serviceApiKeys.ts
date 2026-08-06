import { db, events, serviceApiKeys } from "@budibase/backend-core"
import {
  CreateServiceApiKeyRequest,
  CreateServiceApiKeyResponse,
  FetchServiceApiKeysResponse,
  ServiceApiKeyWorkspaceAccess,
  UserCtx,
} from "@budibase/types"

const normalizeWorkspaceAccess = async (
  workspaceAccess: ServiceApiKeyWorkspaceAccess
): Promise<ServiceApiKeyWorkspaceAccess> => {
  if (workspaceAccess.type === "all") {
    return workspaceAccess
  }
  const workspaceIds = [
    ...new Set(workspaceAccess.workspaceIds.map(db.getProdWorkspaceID)),
  ]
  const existingWorkspaceIds = new Set(
    (await db.getAllWorkspaces({ idsOnly: true })).map(db.getProdWorkspaceID)
  )
  if (
    workspaceIds.some(workspaceId => !existingWorkspaceIds.has(workspaceId))
  ) {
    throw new Error("One or more selected workspaces do not exist")
  }
  return { type: "selected", workspaceIds }
}

export const fetch = async (
  ctx: UserCtx<void, FetchServiceApiKeysResponse>
) => {
  ctx.body = { serviceApiKeys: await serviceApiKeys.list() }
}

export const create = async (
  ctx: UserCtx<CreateServiceApiKeyRequest, CreateServiceApiKeyResponse>
) => {
  if (
    ctx.request.body.tenantAdmin &&
    ctx.request.body.workspaceAccess.type !== "all"
  ) {
    ctx.throw(400, "Tenant administration requires access to all workspaces")
  }
  try {
    const workspaceAccess = await normalizeWorkspaceAccess(
      ctx.request.body.workspaceAccess
    )
    ctx.body = await serviceApiKeys.create({
      ...ctx.request.body,
      name: ctx.request.body.name.trim(),
      workspaceAccess,
      createdBy: ctx.user._id!,
    })
    await events.serviceApiKey.created(ctx.body.serviceApiKey)
    ctx.status = 201
  } catch (err: any) {
    ctx.throw(err.status || 400, err.message)
  }
}

export const revoke = async (ctx: UserCtx) => {
  const result = await serviceApiKeys.revoke({
    id: ctx.params.id,
    revokedBy: ctx.user._id!,
  })
  if (!result) {
    ctx.throw(404, "Service API key not found")
  }
  if (result.revoked) {
    await events.serviceApiKey.revoked(result.serviceApiKey)
  }
  ctx.status = 204
}
