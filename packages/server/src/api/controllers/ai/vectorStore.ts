import { HTTPError } from "@budibase/backend-core"
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

export const fetchVectorStoreConfigs = async (
  ctx: UserCtx<void, VectorDbListResponse>
) => {
  const configs = await sdk.vectorStores.fetch()
  ctx.body = configs.map(sanitize)
}

export const createVectorStoreConfig = async (
  ctx: UserCtx<CreateVectorDbRequest, VectorDb>
) => {
  const body = ctx.request.body
  if (!body.name) {
    throw new HTTPError("Config name is required", 400)
  }
  if (!body.provider) {
    throw new HTTPError("Provider is required", 400)
  }
  if (body.provider !== "pgvector") {
    throw new HTTPError("Only pgvector is supported currently", 400)
  }

  const created = await sdk.vectorStores.create(body)
  ctx.body = sanitize(created)
  ctx.status = 201
}

export const updateVectorStoreConfig = async (
  ctx: UserCtx<UpdateVectorDbRequest, VectorDb>
) => {
  const body = ctx.request.body
  if (!body._id) {
    throw new HTTPError("Config ID is required", 400)
  }
  if (body.provider && body.provider !== "pgvector") {
    throw new HTTPError("Only pgvector is supported currently", 400)
  }
  const updated = await sdk.vectorStores.update(body)
  ctx.body = sanitize(updated)
}

export const deleteVectorStoreConfig = async (
  ctx: UserCtx<void, { deleted: true }, { id: string }>
) => {
  const { id } = ctx.params
  if (!id) {
    throw new HTTPError("Config ID is required", 400)
  }
  await sdk.vectorStores.remove(id)
  ctx.body = { deleted: true }
}
