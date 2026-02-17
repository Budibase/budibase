import { HTTPError } from "@budibase/backend-core"
import {
  CustomAIProviderConfig,
  AIConfigListResponse,
  CreateAIConfigRequest,
  UpdateAIConfigRequest,
  PASSWORD_REPLACEMENT,
  UserCtx,
  AIConfigType,
  RequiredKeys,
  LLMProvidersResponse,
  AIConfigResponse,
  BUDIBASE_AI_PROVIDER_ID,
} from "@budibase/types"
import sdk from "../../../sdk"

const sanitizeConfig = async (
  config: CustomAIProviderConfig
): Promise<AIConfigResponse> => {
  const providers = await sdk.ai.configs.fetchLiteLLMProviders()
  const provider = providers.find(p => p.id === config.provider)

  if (!provider) {
    throw new Error(`Provider ${config.provider} not found`)
  }

  const secretFields = provider.credentialFields
    .filter(f => f.field_type === "password")
    .map(f => f.key)
  const credentialsFields = secretFields.reduce((updatedFields, field) => {
    updatedFields[field] = PASSWORD_REPLACEMENT
    return updatedFields
  }, config.credentialsFields)

  const sanitized: AIConfigResponse = {
    ...config,
    credentialsFields: { ...credentialsFields },
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
  const configs = await sdk.ai.configs.fetch()
  const result: AIConfigListResponse = []
  for (const config of configs) {
    result.push(await sanitizeConfig(config))
  }
  ctx.body = result
}

export const fetchAIProviders = async (
  ctx: UserCtx<void, LLMProvidersResponse>
) => {
  const allProviders = await sdk.ai.configs.fetchLiteLLMProviders()
  const providers = allProviders.filter(p => p.id !== BUDIBASE_AI_PROVIDER_ID)
  ctx.body = providers
}

export const createAIConfig = async (
  ctx: UserCtx<CreateAIConfigRequest, AIConfigResponse>
) => {
  const body = ctx.request.body

  if (!body.name) {
    throw new HTTPError("Config name is required", 400)
  }

  const createRequest: RequiredKeys<
    Parameters<typeof sdk.ai.configs.create>[0]
  > = {
    name: body.name,
    provider: body.provider,
    credentialsFields: body.credentialsFields,
    model: body.model,

    webSearchConfig: body.webSearchConfig,
    configType: body.configType,
    reasoningEffort: body.reasoningEffort,
  }

  const newConfig = await sdk.ai.configs.create(createRequest)

  ctx.body = await sanitizeConfig(newConfig)
}

export const updateAIConfig = async (
  ctx: UserCtx<UpdateAIConfigRequest, AIConfigResponse>
) => {
  const body = ctx.request.body

  if (!body._id) {
    throw new HTTPError("Config ID is required for updates", 400)
  }

  if (!body._rev) {
    throw new HTTPError("Revision is required for updates", 400)
  }

  if (!body.name) {
    throw new HTTPError("Config name is required", 400)
  }

  const configType = body.configType ?? AIConfigType.COMPLETIONS

  const updateRequest: RequiredKeys<
    RequiredKeys<Parameters<typeof sdk.ai.configs.update>[0]>
  > = {
    _id: body._id,
    _rev: body._rev,
    name: body.name,
    provider: body.provider,
    credentialsFields: body.credentialsFields,
    model: body.model,

    webSearchConfig: body.webSearchConfig,
    configType,
    reasoningEffort: body.reasoningEffort,
  }

  const updatedConfig = await sdk.ai.configs.update(updateRequest)

  ctx.body = await sanitizeConfig(updatedConfig)
}

export const deleteAIConfig = async (
  ctx: UserCtx<{ id: string }, { deleted: true }>
) => {
  const { id } = ctx.params
  if (!id) {
    throw new HTTPError("Config ID is required", 400)
  }

  await sdk.ai.configs.remove(id)

  ctx.body = { deleted: true }
}
