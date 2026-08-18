import type {
  SaveSlackAppConfigRequest,
  SlackAppConfigResponse,
  UserCtx,
} from "@budibase/types"
import sdk from "../../../sdk"

const toResponse = (config?: {
  configToken?: string
  refreshToken?: string
  expiresAt?: string
  updatedAt?: string
}): SlackAppConfigResponse => ({
  configured: !!config?.configToken,
  needsReconfiguration:
    !!config?.configToken && (!config?.refreshToken || !config?.expiresAt),
  ...(config?.updatedAt ? { updatedAt: config.updatedAt } : {}),
  ...(config?.expiresAt ? { expiresAt: config.expiresAt } : {}),
})

export const fetchSlackAppConfig = async (
  ctx: UserCtx<void, SlackAppConfigResponse>
) => {
  const config = await sdk.ai.slackAppConfig.fetch()
  ctx.body = toResponse(config)
}

export const saveSlackAppConfig = async (
  ctx: UserCtx<SaveSlackAppConfigRequest, SlackAppConfigResponse>
) => {
  const config = await sdk.ai.slackAppConfig.save(
    ctx.request.body.configToken,
    ctx.request.body.refreshToken
  )
  ctx.body = toResponse(config)
}

export const deleteSlackAppConfig = async (
  ctx: UserCtx<void, SlackAppConfigResponse>
) => {
  await sdk.ai.slackAppConfig.remove()
  ctx.body = toResponse()
}
