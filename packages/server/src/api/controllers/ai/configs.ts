import { HTTPError } from "@budibase/backend-core"
import {
  CustomAIProviderConfig,
  AIConfigListResponse,
  CreateAIConfigRequest,
  UpdateAIConfigRequest,
  PASSWORD_REPLACEMENT,
  UserCtx,
  RequiredKeys,
  WithoutDocMetadata,
  ToDocUpdateMetadata,
  LLMProvidersResponse,
} from "@budibase/types"
import sdk from "../../../sdk"

const sanitizeConfig = async (
  config: CustomAIProviderConfig
): Promise<CustomAIProviderConfig> => {
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

  const sanitized: CustomAIProviderConfig = {
    ...config,
    credentialsFields,
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
  ctx.body = await sdk.ai.configs.fetchLiteLLMProviders()
}

export const createAIConfig = async (
  ctx: UserCtx<CreateAIConfigRequest, CustomAIProviderConfig>
) => {
  const body = ctx.request.body

  if (!body.name) {
    throw new HTTPError("Config name is required", 400)
  }

  const createRequest: RequiredKeys<WithoutDocMetadata<CreateAIConfigRequest>> =
    {
      name: body.name,
      provider: body.provider,
      credentialsFields: body.credentialsFields,
      model: body.model,
      liteLLMModelId: body.liteLLMModelId,
      webSearchConfig: body.webSearchConfig,
      configType: body.configType,
      reasoningEffort: body.reasoningEffort,
    }

  const newConfig = await sdk.ai.configs.create(createRequest)

  ctx.body = await sanitizeConfig(newConfig)
}

export const updateAIConfig = async (
  ctx: UserCtx<UpdateAIConfigRequest, CustomAIProviderConfig>
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

  const updateRequest: RequiredKeys<
    ToDocUpdateMetadata<UpdateAIConfigRequest>
  > = {
    _id: body._id,
    _rev: body._rev,
    name: body.name,
    provider: body.provider,
    credentialsFields: body.credentialsFields,
    model: body.model,
    liteLLMModelId: body.liteLLMModelId,
    webSearchConfig: body.webSearchConfig,
    configType: body.configType,
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
