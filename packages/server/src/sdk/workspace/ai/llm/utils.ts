import { features, HTTPError } from "@budibase/backend-core"
import {
  AIConfigType,
  FeatureFlag,
  LLMResponse,
  ReasoningEffort,
} from "@budibase/types"
import { createLLM } from "."
import { configs } from ".."
import { createLegacyLLM } from "./legacy"

interface GetDefaultLLMOptions {
  reasoningEffort?: ReasoningEffort
}

const applyReasoningEffort = (
  llm: LLMResponse,
  reasoningEffort?: ReasoningEffort
): LLMResponse => {
  if (!reasoningEffort) {
    return llm
  }

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

async function getDefaultLLMObject(): Promise<LLMResponse | undefined> {
  if (!(await features.isEnabled(FeatureFlag.USE_NEW_AICONFIGS))) {
    return await createLegacyLLM()
  }

  const allConfigs = await configs.fetch()
  const configToUse = allConfigs.find(
    c => c.configType === AIConfigType.COMPLETIONS && c.isDefault === true
  )
  if (!configToUse?._id) {
    return await createLegacyLLM()
  }

  return await createLLM(configToUse._id)
}

export async function getDefaultLLM(
  options?: GetDefaultLLMOptions
): Promise<LLMResponse | undefined> {
  const llm = await getDefaultLLMObject()
  return llm ? applyReasoningEffort(llm, options?.reasoningEffort) : llm
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
