import { HTTPError } from "@budibase/backend-core"
import { AIConfigType, LLMResponse, ReasoningEffort } from "@budibase/types"
import { createLLM } from "."
import { configs } from ".."

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
  const allConfigs = await configs.fetch()
  const configToUse = allConfigs.find(
    c => c.configType === AIConfigType.COMPLETIONS && c.isDefault === true
  )
  if (!configToUse?._id) {
    return
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
