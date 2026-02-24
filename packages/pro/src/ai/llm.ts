import { configs, context, env, HTTPError } from "@budibase/backend-core"
import {
  AIConfig,
  AIProvider,
  ChatCompletionRequest,
  ConfigType,
  LLMConfigOptions,
  LLMProviderConfig,
  Message,
  ResponseFormat,
  WithRequired,
} from "@budibase/types"
import { tracer } from "dd-trace"
import openai from "openai"
import { z } from "zod"
import { enrichAIConfig } from "../sdk/ai"
import { Anthropic, AnthropicModel } from "./models"
import { AzureOpenAI } from "./models/azureOpenai"
import { LLM } from "./models/base"
import { BudibaseAI } from "./models/budibaseai"
import { OpenAI, OpenAIModel } from "./models/openai"
import { LiteLLMAI } from "./models/litellm"

// Provider-specific default models. If a provider's saved config does not
// include a default model, we fall back to these. Azure defaults to gpt-4.1
// so we avoid GPT-5-only parameters like verbosity/reasoning_effort.
const DefaultModelByProvider: Record<AIProvider, OpenAIModel | AnthropicModel> =
  {
    OpenAI: "gpt-5-mini",
    TogetherAI: "gpt-5-mini",
    AzureOpenAI: "gpt-4.1",
    Custom: "gpt-5-mini",
    Anthropic: "claude-3-5-sonnet-20240620",
    BudibaseAI: "gpt-5-mini",
  }

const ProviderMap = {
  OpenAI: OpenAI,
  TogetherAI: OpenAI,
  AzureOpenAI: AzureOpenAI,
  Custom: OpenAI,
  Anthropic: Anthropic,
  BudibaseAI: BudibaseAI,
}

async function getAIConfig(): Promise<LLMProviderConfig | undefined> {
  return await tracer.trace("getAIConfig", async span => {
    let aiConfigs: AIConfig = {
      type: ConfigType.AI,
      config: {},
    }

    // We can't look up AIConfigs in the database if this is a self-host user
    // calling into Budibase AI in the cloud because self-host users don't have
    // global DBs, that's why this check is here. The call to enrichAIConfig
    // below will add in the Budibase AI config for self-host users using cloud.
    if (!context.isSelfHostUsingCloud()) {
      const storedConfig = await configs.getAIConfig()
      if (storedConfig) {
        aiConfigs = storedConfig
      }
    }

    await enrichAIConfig(aiConfigs)

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
async function getSelfHostOpenAIKeyConfig(): Promise<
  LLMProviderConfig | undefined
> {
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

export async function getLLMConfig(): Promise<LLMProviderConfig | undefined> {
  return tracer.trace(
    "getLLMConfig",
    async () =>
      // Always priorise saved AI config.
      (await getAIConfig()) ||
      // Next check for self-hosters that have their own API key.
      (await getSelfHostOpenAIKeyConfig())
  )
}

// This is the entrypoint for all LLM functionality in Budibase. If you're
// making a feature that uses LLMs, you should call this function to get an LLM
// instance. This function takes care of figuring out what LLM to use, and if
// the user has no LLM configuration it will return undefined. It's the caller's
// responsibility to handle this case.
export async function getLLM(
  options?: LLMConfigOptions
): Promise<LLM | undefined> {
  return await tracer.trace("getLLM", async span => {
    const { model, maxTokens } = options || {}

    const config = await getLLMConfig()
    if (!config) {
      span.addTags({ enabled: false, reason: "no config found" })
      return
    }

    if (model) {
      config.model = model
    }
    if (maxTokens) {
      config.maxTokens = maxTokens
    }

    const LLMProvider = ProviderMap[config.provider]
    if (!LLMProvider) {
      span.addTags({
        enabled: false,
        reason: "no provider found",
        provider: config.provider,
      })
      return
    }

    return new LLMProvider(config)
  })
}

export async function getLLMOrThrow(): Promise<LLM> {
  const llm = await getLLM()
  if (!llm) {
    throw new HTTPError("No available LLM configurations", 500)
  }
  return llm
}

export async function getChatLLM(
  config: WithRequired<LLMConfigOptions, "baseUrl">
): Promise<OpenAI> {
  return await tracer.trace("getChatLLM", async () => {
    return new LiteLLMAI(config)
  })
}

// This function is intended to be used in the local development environment
// and for running local AI testing. It should not be used in production code
// paths.
export async function getOpenAIUsingLocalAPIKey(): Promise<LLM | undefined> {
  if (
    env.BUDIBASE_ENVIRONMENT === "production" ||
    env.BUDIBASE_ENVIRONMENT === "qa"
  ) {
    return
  }

  if (!env.OPENAI_API_KEY) {
    return
  }

  return new OpenAI({
    model: DefaultModelByProvider.OpenAI,
    apiKey: env.OPENAI_API_KEY,
  })
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
