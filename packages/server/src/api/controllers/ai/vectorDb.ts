import { HTTPError } from "@budibase/backend-core"
import {
  CreateVectorDbRequest,
  PASSWORD_REPLACEMENT,
  UpdateVectorDbRequest,
  UserCtx,
  VectorDb,
  VectorDbListResponse,
  VectorDbProvider,
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
  if (!body.name) {
    throw new HTTPError("Config name is required", 400)
  }
  if (!body.provider) {
    throw new HTTPError("Provider is required", 400)
  }
  if (!Object.values(VectorDbProvider).includes(body.provider)) {
    throw new HTTPError(`${body.provider} is not supported`, 400)
  }

  const created = await sdk.ai.vectorDb.create(body)
  ctx.body = sanitize(created)
  ctx.status = 201
}

export const updateVectorDbConfig = async (
  ctx: UserCtx<UpdateVectorDbRequest, VectorDb>
) => {
  const body = ctx.request.body
  if (!body._id) {
    throw new HTTPError("Config ID is required", 400)
  }
  if (!body._rev) {
    throw new HTTPError("Revision is required", 400)
  }
  if (!Object.values(VectorDbProvider).includes(body.provider)) {
    throw new HTTPError(`${body.provider} is not supported`, 400)
  }
  const updated = await sdk.ai.vectorDb.update(body)
  ctx.body = sanitize(updated)
}

export const deleteVectorDbConfig = async (
  ctx: UserCtx<void, { deleted: true }, { id: string }>
) => {
  const { id } = ctx.params
  if (!id) {
    throw new HTTPError("Config ID is required", 400)
  }
  await sdk.ai.vectorDb.remove(id)
  ctx.body = { deleted: true }
}
