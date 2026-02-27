import { configs, context, env } from "@budibase/backend-core"
import {
  AIConfig,
  AIProvider,
  ChatCompletionRequest,
  ConfigType,
  LLMProviderConfig,
  Message,
  ResponseFormat,
} from "@budibase/types"
import { tracer } from "dd-trace"
import openai from "openai"
import { z } from "zod"

// Provider-specific default models. If a provider's saved config does not
// include a default model, we fall back to these. Azure defaults to gpt-4.1
// so we avoid GPT-5-only parameters like verbosity/reasoning_effort.
const DefaultModelByProvider: Record<AIProvider, string> = {
  OpenAI: "gpt-5-mini",
  TogetherAI: "gpt-5-mini",
  AzureOpenAI: "gpt-4.1",
  Custom: "gpt-5-mini",
  Anthropic: "claude-3-5-sonnet-20240620",
  BudibaseAI: "gpt-5-mini",
}

async function getAIConfig(): Promise<LLMProviderConfig | undefined> {
  return await tracer.trace("getAIConfig", async span => {
    let aiConfigs: AIConfig = {
      type: ConfigType.AI,
      config: {},
    }

    // We can't look up AIConfigs in the database if this is a self-host user
    // calling into Budibase AI in the cloud because self-host users don't have
    // global DBs, that's why this check is here.
    if (!context.isSelfHostUsingCloud()) {
      const storedConfig = await configs.getAIConfig()
      if (storedConfig) {
        aiConfigs = storedConfig
      }
    }

    const provider = Object.values(aiConfigs.config).find(
      config => config.active && config.isDefault
    )
    if (!provider) {
      span.addTags({ enabled: false, reason: "no provider found" })
      return
    }

    span.addTags({ enabled: true })

    return {
      provider: provider.provider,
      model: provider.defaultModel || DefaultModelByProvider[provider.provider],
      apiKey: provider.apiKey,
      baseUrl: provider.baseUrl,
    }
  })
}

// Support for self-host users that want to bring their own API key. We didn't
// want to force self-host users to have to use Budibase AI because that would
// be against the ethos of offering Budibase as an open source product.
function getSelfHostOpenAIKeyConfig(): LLMProviderConfig | undefined {
  return tracer.trace("getSelfHostOpenAIKeyConfig", span => {
    if (!env.SELF_HOSTED) {
      span.addTags({ enabled: false, reason: "not self host" })
      return
    }

    if (!env.OPENAI_API_KEY) {
      span.addTags({ enabled: false, reason: "no OPENAI_API_KEY" })
      return
    }

    span.addTags({ enabled: true })

    return {
      provider: "OpenAI",
      model: DefaultModelByProvider.OpenAI,
      apiKey: env.OPENAI_API_KEY,
    }
  })
}

function getBudibaseAIKeyConfig(): LLMProviderConfig | undefined {
  return tracer.trace("getBudibaseAIKeyConfig", span => {
    if (env.SELF_HOSTED) {
      span.addTags({ enabled: false, reason: "not cloud" })
      return
    }

    span.addTags({ enabled: true })

    return {
      provider: "BudibaseAI",
      model: DefaultModelByProvider.BudibaseAI,
    }
  })
}

export async function getLLMConfig(): Promise<LLMProviderConfig | undefined> {
  return tracer.trace(
    "getLLMConfig",
    async () =>
      // Always priorise saved AI config.
      (await getAIConfig()) ||
      // Next check for self-hosters that have their own API key.
      (env.SELF_HOSTED
        ? getSelfHostOpenAIKeyConfig()
        : getBudibaseAIKeyConfig())
  )
}

export function parseResponseFormat(
  responseFormat?: ResponseFormat
):
  | openai.ResponseFormatText
  | openai.ResponseFormatJSONObject
  | openai.ResponseFormatJSONSchema
  | undefined {
  if (!responseFormat) {
    return
  }

  if (responseFormat === "text") {
    return { type: "text" }
  }
  if (responseFormat === "json") {
    return { type: "json_object" }
  }

  return responseFormat
}

export class LLMRequest {
  messages: Message[] = []
  format?: ResponseFormat

  withFormat(
    format: "text" | "json" | openai.ResponseFormatJSONSchema | z.ZodType
  ) {
    if (format instanceof z.ZodType) {
      this.format = {
        type: "json_schema",
        json_schema: {
          name: "response",
          strict: false,
          schema: format.toJSONSchema({ target: "draft-7" }),
        },
      }
    } else {
      this.format = format
    }
    return this
  }

  addMessage(message: Message) {
    this.messages.push(message)
    return this
  }

  addMessages(messages: Message[]) {
    this.messages.push(...messages)
    return this
  }

  addUserMessage(content: string) {
    this.messages.push({ role: "user", content })
    return this
  }

  addSystemMessage(content: string) {
    this.messages.push({ role: "system", content })
    return this
  }

  static fromRequest(req: ChatCompletionRequest) {
    const prompt = new LLMRequest()
    if (req.messages) {
      prompt.addMessages(req.messages)
    }
    if (req.format) {
      prompt.withFormat(req.format)
    }
    return prompt
  }
}
