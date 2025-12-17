import {
  GetWebSearchConfigResponse,
  SaveWebSearchConfigRequest,
  SaveWebSearchConfigResponse,
  UserCtx,
} from "@budibase/types"
import sdk from "../../../sdk"

export const getWebSearchConfig = async (
  ctx: UserCtx<void, GetWebSearchConfigResponse>
) => {
  const config = await sdk.webSearchConfig.get()
  ctx.body = { config: sdk.webSearchConfig.sanitize(config) }
}

export const saveWebSearchConfig = async (
  ctx: UserCtx<SaveWebSearchConfigRequest, SaveWebSearchConfigResponse>
) => {
  const { provider, apiKey, enabled } = ctx.request.body

  const config = await sdk.webSearchConfig.save({ provider, apiKey, enabled })
  ctx.body = { config: sdk.webSearchConfig.sanitize(config)! }
}

export const deleteWebSearchConfig = async (ctx: UserCtx<void, void>) => {
  await sdk.webSearchConfig.remove()
  ctx.status = 204
}
