import { HTTPError } from "@budibase/backend-core"
import {
  AIConfigType,
  BUDIBASE_AI_PROVIDER_ID,
  CustomAIProviderConfig,
  LLMResponse,
  ReasoningEffort,
} from "@budibase/types"
import { createLLM } from "."
import { configs } from ".."
import {
  fetchPublicModelCostMap,
  fetchPublicProviders,
} from "../configs/litellm"

interface GetDefaultLLMOptions {
  reasoningEffort?: ReasoningEffort
}

const applyReasoningEffort = (
  llm: LLMResponse,
  reasoningEffort: ReasoningEffort
): LLMResponse => {
  return {
    ...llm,
    providerOptions: hasTools => {
      const baseProviderOptions = llm.providerOptions?.(hasTools)
      return {
        ...baseProviderOptions,
        openai: {
          ...baseProviderOptions?.openai,
          reasoningEffort,
        },
        azure: {
          ...baseProviderOptions?.azure,
          reasoningEffort,
        },
      }
    },
  }
}

export async function supportsReasoningEffort(
  config: Pick<CustomAIProviderConfig, "provider" | "model">
): Promise<boolean> {
  if (config.provider === BUDIBASE_AI_PROVIDER_ID) {
    return true
  }

  const [providers, modelCostMap] = await Promise.all([
    fetchPublicProviders(),
    fetchPublicModelCostMap(),
  ])

  const liteLLMProvider = providers.find(
    p => p.provider === config.provider
  )?.litellm_provider
  if (!liteLLMProvider) {
    return false
  }

  return Object.entries(modelCostMap).some(([modelId, metadata]) => {
    const modelProvider = metadata?.litellm_provider
    const isMatchingProvider = Array.isArray(modelProvider)
      ? modelProvider.includes(liteLLMProvider)
      : typeof modelProvider === "string"
        ? modelProvider
            .split(",")
            .map(value => value.trim())
            .includes(liteLLMProvider)
        : false

    if (!isMatchingProvider) {
      return false
    }

    const providerPrefix = `${liteLLMProvider}/`
    const normalizedModelId = modelId.startsWith(providerPrefix)
      ? modelId.slice(providerPrefix.length)
      : modelId

    return (
      normalizedModelId === config.model &&
      metadata?.supports_reasoning === true
    )
  })
}

export async function getDefaultLLM(
  options?: GetDefaultLLMOptions
): Promise<LLMResponse | undefined> {
  const allConfigs = await configs.fetch()
  const configToUse = allConfigs.find(
    c => c.configType === AIConfigType.COMPLETIONS && c.isDefault === true
  )
  if (!configToUse?._id) {
    return
  }

  const llm = await createLLM(configToUse._id)

  if (
    !llm ||
    !options?.reasoningEffort ||
    !(await supportsReasoningEffort(configToUse))
  ) {
    return llm
  }
  return applyReasoningEffort(llm, options.reasoningEffort)
}

export async function getDefaultLLMOrThrow(
  options?: GetDefaultLLMOptions
): Promise<LLMResponse> {
  const llm = await getDefaultLLM(options)
  if (!llm) {
    throw new HTTPError("No available LLM configurations", 500)
  }
  return llm
}
