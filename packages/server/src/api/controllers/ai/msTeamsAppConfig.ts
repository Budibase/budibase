import type {
  MSTeamsAppConfigResponse,
  SaveMSTeamsAppConfigRequest,
  UserCtx,
} from "@budibase/types"
import sdk from "../../../sdk"

const toResponse = (config?: {
  clientSecret?: string
  updatedAt?: string
}): MSTeamsAppConfigResponse => ({
  configured: !!config?.clientSecret,
  ...(config?.updatedAt ? { updatedAt: config.updatedAt } : {}),
})

export const fetchMSTeamsAppConfig = async (
  ctx: UserCtx<void, MSTeamsAppConfigResponse>
) => {
  const config = await sdk.ai.msTeamsAppConfig.fetch()
  ctx.body = toResponse(config)
}

export const saveMSTeamsAppConfig = async (
  ctx: UserCtx<SaveMSTeamsAppConfigRequest, MSTeamsAppConfigResponse>
) => {
  const config = await sdk.ai.msTeamsAppConfig.save(ctx.request.body)
  ctx.body = toResponse(config)
}

export const deleteMSTeamsAppConfig = async (
  ctx: UserCtx<void, MSTeamsAppConfigResponse>
) => {
  await sdk.ai.msTeamsAppConfig.remove()
  ctx.body = toResponse()
}
