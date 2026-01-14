import {
  CreateRagConfigRequest,
  RagConfig,
  RagConfigListResponse,
  UpdateRagConfigRequest,
  UserCtx,
} from "@budibase/types"
import sdk from "../../../sdk"
import { HTTPError } from "@budibase/backend-core"

export const fetchRagConfigs = async (
  ctx: UserCtx<void, RagConfigListResponse>
) => {
  const configs = await sdk.ragConfigs.fetch()
  ctx.body = configs
}

export const createRagConfig = async (
  ctx: UserCtx<CreateRagConfigRequest, RagConfig>
) => {
  const body = ctx.request.body

  const created = await sdk.ragConfigs.create(body)
  ctx.body = created
  ctx.status = 201
}

export const updateRagConfig = async (
  ctx: UserCtx<UpdateRagConfigRequest, RagConfig>
) => {
  const body = ctx.request.body

  const updated = await sdk.ragConfigs.update(body)
  ctx.body = updated
}

export const deleteRagConfig = async (
  ctx: UserCtx<void, { deleted: true }, { id: string }>
) => {
  const { id } = ctx.params
  if (!id) {
    throw new HTTPError("Config ID is required", 400)
  }
  await sdk.ragConfigs.remove(id)
  ctx.body = { deleted: true }
}
