import {
  CreateVectorDbRequest,
  PASSWORD_REPLACEMENT,
  UpdateVectorDbRequest,
  UserCtx,
  VectorDb,
  VectorDbListResponse,
} from "@budibase/types"
import sdk from "../../../sdk"

const sanitize = (config: VectorDb): VectorDb => {
  if (!config.password) {
    return config
  }
  return {
    ...config,
    password: PASSWORD_REPLACEMENT,
  }
}

export const fetchVectorDbConfigs = async (
  ctx: UserCtx<void, VectorDbListResponse>
) => {
  const configs = await sdk.ai.vectorDb.fetch()
  ctx.body = configs.map(sanitize)
}

export const createVectorDbConfig = async (
  ctx: UserCtx<CreateVectorDbRequest, VectorDb>
) => {
  const body = ctx.request.body
  const created = await sdk.ai.vectorDb.create(body)
  ctx.body = sanitize(created)
  ctx.status = 201
}

export const updateVectorDbConfig = async (
  ctx: UserCtx<UpdateVectorDbRequest, VectorDb>
) => {
  const body = ctx.request.body
  const updated = await sdk.ai.vectorDb.update(body)
  ctx.body = sanitize(updated)
}

export const deleteVectorDbConfig = async (
  ctx: UserCtx<void, { deleted: true }, { id: string }>
) => {
  const { id } = ctx.params
  await sdk.ai.vectorDb.remove(id)
  ctx.body = { deleted: true }
}
