import { createOpenAI } from "@ai-sdk/openai"
import type { LanguageModelV3StreamResult } from "@ai-sdk/provider"
import type {
  LanguageModelV3StreamPart,
  LanguageModelV3Usage,
} from "@ai-sdk/provider"
import { HTTPError } from "@budibase/backend-core"
import { quotas } from "@budibase/pro"
import { BUDIBASE_AI_MODEL_MAP } from "@budibase/types"
import { wrapLanguageModel } from "ai"
import { TransformStream } from "node:stream/web"
import { LLMResponse } from "."
import environment from "../../../../environment"

interface OpenAIUsage {
  prompt_tokens?: number
  completion_tokens?: number
  input_tokens?: number
  output_tokens?: number
}

const calculateBudibaseAICredits = (
  inputTokens: number,
  outputTokens: number
): number => outputTokens * 3 + inputTokens

const incrementBudibaseAICreditsFromUsage = async (
  usage?: LanguageModelV3Usage
) => {
  if (!usage) {
    return
  }

  const inputTokens = usage.inputTokens.total ?? 0
  const outputTokens = usage.outputTokens.total ?? 0
  const credits = calculateBudibaseAICredits(inputTokens, outputTokens)
  if (credits > 0) {
    await quotas.incrementBudibaseAICredits(credits)
  }
}

export async function incrementBudibaseAICreditsFromOpenAIUsage(
  usage?: OpenAIUsage
) {
  if (!usage) {
    return
  }

  const inputTokens = usage.prompt_tokens ?? usage.input_tokens ?? 0
  const outputTokens = usage.completion_tokens ?? usage.output_tokens ?? 0
  const credits = calculateBudibaseAICredits(inputTokens, outputTokens)

  if (credits > 0) {
    await quotas.incrementBudibaseAICredits(credits)
  }
}

const availableBudibaseAIModels: typeof BUDIBASE_AI_MODEL_MAP = {
  ...BUDIBASE_AI_MODEL_MAP,
  "legacy/gpt-4o-mini": {
    provider: "openai",
    model: "gpt-4o-mini",
  },
  "legacy/gpt-4o": {
    provider: "openai",
    model: "gpt-4o",
  },
  "legacy/gpt-5": {
    provider: "openai",
    model: "gpt-5",
  },
  "legacy/gpt-5-mini": {
    provider: "openai",
    model: "gpt-5-mini",
  },
  "legacy/gpt-5-nano": {
    provider: "openai",
    model: "gpt-5-nano",
  },
}

export function assertSupportedBBAIModel(model: string) {
  if (!availableBudibaseAIModels[model]) {
    throw new HTTPError(`Unsupported BBAI model: ${model}`, 400)
  }
}

export async function createBBAIClient(model: string): Promise<LLMResponse> {
  assertSupportedBBAIModel(model)

  const client = createOpenAI({
    apiKey: environment.BBAI_LITELLM_KEY,
    baseURL: environment.LITELLM_URL,
  })
  const chat = wrapLanguageModel({
    model: client.chat(model),
    middleware: {
      specificationVersion: "v3",
      async wrapGenerate({ doGenerate }) {
        const result = await doGenerate()
        await incrementBudibaseAICreditsFromUsage(result.usage).catch(() => {})
        return result
      },
      async wrapStream({ doStream }) {
        const result = await doStream()
        const transformStream = new TransformStream<
          LanguageModelV3StreamPart,
          LanguageModelV3StreamPart
        >({
          async transform(chunk, controller) {
            controller.enqueue(chunk)
            if (chunk.type === "finish") {
              await incrementBudibaseAICreditsFromUsage(chunk.usage).catch(
                () => {}
              )
            }
            return
          },
        }) as Parameters<typeof result.stream.pipeThrough>[0]

        return {
          ...result,
          stream: result.stream.pipeThrough(
            transformStream
          ) as LanguageModelV3StreamResult["stream"],
        }
      },
    },
  })
  return {
    chat,
    embedding: (() => {
      throw new Error("BBAI embeddings are not supported")
    }) as any,
    providerOptions: undefined,
  }
}
