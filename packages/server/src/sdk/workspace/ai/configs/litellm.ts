import { configs, context, HTTPError } from "@budibase/backend-core"
import fetch from "node-fetch"
import * as configSdk from "../configs"
import env from "../../../../environment"
import { AIConfigType } from "@budibase/types"

const liteLLMAuthorizationHeader = `Bearer ${env.LITELLM_MASTER_KEY}`

export async function generateKey(
  name: string
): Promise<{ id: string; secret: string }> {
  const body = JSON.stringify({
    key_alias: name,
  })

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: liteLLMAuthorizationHeader,
    },
    body,
  }

  const response = await fetch(
    `${env.LITELLM_URL}/key/generate`,
    requestOptions
  )

  const json = await response.json()
  return { id: json.token_id, secret: json.key }
}

export async function addModel({
  provider,
  name,
  baseUrl,
  apiKey,
  configType,
}: {
  provider: string
  name: string
  baseUrl: string
  apiKey: string | undefined
  configType: AIConfigType
}): Promise<string> {
  provider = await mapToLiteLLMProvider(provider)

  await validateConfig({ provider, name, baseUrl, apiKey, configType })

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: liteLLMAuthorizationHeader,
    },
    body: JSON.stringify({
      model_name: name,
      litellm_params: {
        api_base: baseUrl,
        api_key: apiKey,
        custom_llm_provider: provider,
        model: `${provider}/${name}`,
        use_in_pass_through: false,
        use_litellm_proxy: false,
        merge_reasoning_content_in_choices: false,
        input_cost_per_token: 0,
        output_cost_per_token: 0,
        guardrails: [],
      },
      model_info: {
        created_at: new Date().toISOString(),
        created_by: (context.getIdentity() as any)?.email,
      },
    }),
  }

  const res = await fetch(`${env.LITELLM_URL}/model/new`, requestOptions)
  const json = await res.json()
  return json.model_id
}

export async function updateModel({
  llmModelId,
  provider,
  name,
  baseUrl,
  apiKey,
  configType,
}: {
  llmModelId: string
  provider: string
  name: string
  baseUrl: string
  apiKey: string | undefined
  configType: AIConfigType
}) {
  provider = await mapToLiteLLMProvider(provider)
  await validateConfig({ provider, name, baseUrl, apiKey, configType })

  const requestOptions = {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: liteLLMAuthorizationHeader,
    },
    body: JSON.stringify({
      model_name: name,
      litellm_params: {
        api_base: baseUrl,
        api_key: apiKey,
        custom_llm_provider: provider,
        model: `${provider}/${name}`,
        use_in_pass_through: false,
        use_litellm_proxy: false,
        merge_reasoning_content_in_choices: false,
        input_cost_per_token: 0,
        output_cost_per_token: 0,
        guardrails: [],
      },
      model_info: {
        updated_at: new Date().toISOString(),
        updated_by: (context.getIdentity() as any)?.email,
      },
    }),
  }

  const res = await fetch(
    `${env.LITELLM_URL}/model/${llmModelId}/update`,
    requestOptions
  )
  const json = await res.json()
  if (json.status === "error") {
    const trimmedError = json.result.error.split("\n")[0] || json.result.error

    throw new HTTPError(`Error updating configuration: ${trimmedError}`, 400)
  }
}

export async function validateConfig(model: {
  provider: string
  name: string
  baseUrl: string
  apiKey: string | undefined
  configType: AIConfigType
}) {
  const { name, baseUrl, provider, apiKey, configType } = model

  if (configType === AIConfigType.EMBEDDINGS) {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    }
    if (apiKey) {
      headers.Authorization = `Bearer ${apiKey}`
    }
    const normalizedBase = baseUrl?.replace(/\/+$/, "") || baseUrl
    const response = await fetch(
      `${normalizedBase || "https://api.openai.com"}/v1/embeddings`,
      {
        method: "POST",
        headers,
        body: JSON.stringify({
          model: name,
          input: "Budibase embedding validation",
        }),
      }
    )

    if (!response.ok) {
      const text = await response.text()
      throw new HTTPError(
        `Error validating configuration: ${text || response.statusText}`,
        400
      )
    }
    return
  }

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: liteLLMAuthorizationHeader,
    },
    body: JSON.stringify({
      // mode: "chat",
      litellm_params: {
        model: `${provider}/${name}`,
        custom_llm_provider: provider,
        api_key: apiKey,
        api_base: baseUrl,
      },
    }),
  }

  const res = await fetch(
    `${env.LITELLM_URL}/health/test_connection`,
    requestOptions
  )
  if (res.status !== 200) {
    const text = await res.text()
    throw new HTTPError(text, 500)
  }
  const json = await res.json()
  if (json.status === "error") {
    const trimmedError = json.result.error.split("\n")[0] || json.result.error

    throw new HTTPError(`Error validating configuration: ${trimmedError}`, 400)
  }
}

export async function syncKeyModels() {
  const { liteLLM } = await configs.getSettingsConfig()
  if (!liteLLM) {
    throw new Error("LiteLLM key not configured")
  }

  const aiConfigs = await configSdk.fetch()
  const modelIds = aiConfigs
    .map(c => c.liteLLMModelId)
    .filter((id): id is string => !!id)

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: liteLLMAuthorizationHeader,
    },
    body: JSON.stringify({
      key: liteLLM.keyId,
      models: modelIds,
    }),
  }

  const res = await fetch(`${env.LITELLM_URL}/key/update`, requestOptions)
  const json = await res.json()
  if (json.status === "error") {
    const trimmedError = json.result.error.split("\n")[0] || json.result.error

    throw new HTTPError(`Error syncing keys: ${trimmedError}`, 400)
  }
}

type LiteLLMPublicProvider = {
  provider: string
  provider_display_name: string
  litellm_provider: string
}

export async function fetchPublicProviders(): Promise<LiteLLMPublicProvider[]> {
  const res = await fetch(`${env.LITELLM_URL}/public/providers/fields`)
  if (!res.ok) {
    const text = await res.text()
    throw new HTTPError(
      `Error fetching LiteLLM providers: ${text || res.statusText}`,
      res.status
    )
  }

  const json = await res.json()
  return json as LiteLLMPublicProvider[]
}

async function mapToLiteLLMProvider(provider: string) {
  const providers = await fetchPublicProviders()
  const result = providers.find(p => p.provider === provider)?.litellm_provider
  if (!result) {
    throw new Error(`Provider ${provider} not found in LiteLLM`)
  }
  return result
}
