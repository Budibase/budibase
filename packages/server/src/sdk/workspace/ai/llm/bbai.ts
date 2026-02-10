import { createOpenAI } from "@ai-sdk/openai"
import { env, HTTPError } from "@budibase/backend-core"
import { BUDIBASE_AI_MODEL_MAP } from "@budibase/types"

export async function createBBAIClient(model: string) {
  const bbaiModel = BUDIBASE_AI_MODEL_MAP[model]
  if (!bbaiModel) {
    throw new HTTPError(`Unsupported BBAI model: ${model}`, 400)
  }

  const { provider } = bbaiModel

  let apiKey: string | undefined
  let baseURL: string | undefined
  if (provider === "openai") {
    apiKey = env.BBAI_OPENAI_API_KEY
  } else {
    apiKey = env.BBAI_MISTRAL_API_KEY
    baseURL = env.MISTRAL_BASE_URL
    if (!baseURL) {
      throw new HTTPError("MISTRAL_BASE_URL not configured", 500)
    }
  }

  if (!apiKey) {
    throw new HTTPError(`${provider.toUpperCase()} API key not configured`, 500)
  }

  const client = createOpenAI({ apiKey, baseURL })
  return { chat: client.chat(bbaiModel.model), providerOptions: undefined }
}
