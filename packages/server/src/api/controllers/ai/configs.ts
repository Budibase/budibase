import { HTTPError } from "@budibase/backend-core"
import {
  CustomAIProviderConfig,
  AIConfigListResponse,
  CreateAIConfigRequest,
  UpdateAIConfigRequest,
  PASSWORD_REPLACEMENT,
  UserCtx,
} from "@budibase/types"
import sdk from "../../../sdk"

const sanitizeConfig = (
  config: CustomAIProviderConfig
): CustomAIProviderConfig => {
  const sanitized: CustomAIProviderConfig = {
    ...config,
    ...(config.apiKey ? { apiKey: PASSWORD_REPLACEMENT } : {}),
  }

  if (sanitized.webSearchConfig?.apiKey) {
    sanitized.webSearchConfig = {
      ...sanitized.webSearchConfig,
      apiKey: PASSWORD_REPLACEMENT,
    }
  }

  return sanitized
}

export const fetchAIConfigs = async (
  ctx: UserCtx<void, AIConfigListResponse>
) => {
  const configs = await sdk.aiConfigs.fetch()
  ctx.body = configs.map(sanitizeConfig)
}

export const createAIConfig = async (
  ctx: UserCtx<CreateAIConfigRequest, CustomAIProviderConfig>
) => {
  const body = ctx.request.body

  if (!body.name) {
    throw new HTTPError("Config name is required", 400)
  }

  const newConfig = await sdk.aiConfigs.create(body)

  ctx.body = sanitizeConfig(newConfig)
}

export const updateAIConfig = async (
  ctx: UserCtx<UpdateAIConfigRequest, CustomAIProviderConfig>
) => {
  const body = ctx.request.body

  if (!body._id) {
    throw new HTTPError("Config ID is required for updates", 400)
  }

  if (!body.name) {
    throw new HTTPError("Config name is required", 400)
  }

  const updatedConfig = await sdk.aiConfigs.update(body)

  ctx.body = sanitizeConfig(updatedConfig)
}

export const deleteAIConfig = async (
  ctx: UserCtx<{ id: string }, { deleted: true }>
) => {
  const { id } = ctx.params
  if (!id) {
    throw new HTTPError("Config ID is required", 400)
  }

  await sdk.aiConfigs.remove(id)

  ctx.body = { deleted: true }
}
