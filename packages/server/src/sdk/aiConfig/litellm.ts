import { configs, HTTPError } from "@budibase/backend-core"
import fetch from "node-fetch"
import sdk from ".."

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
      Authorization: "Bearer sk-1234",
    },
    body,
  }

  const response = await fetch(
    "http://localhost:4000/key/generate",
    requestOptions
  )

  const json = await response.json()
  return { id: json.token_id, secret: json.key }
}

export async function addModal(model: {
  provider: string
  name: string
  baseUrl: string
  apiKey: string | undefined
}): Promise<string> {
  const { name, baseUrl, provider } = model
  await validateConfig(model)

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer sk-1234",
    },
    body: JSON.stringify({
      model_name: name,
      litellm_params: {
        api_base: baseUrl,
        custom_llm_provider: provider,
        model: `${provider}/${name}`,
        use_in_pass_through: false,
        use_litellm_proxy: false,
        merge_reasoning_content_in_choices: false,
        input_cost_per_token: 0,
        output_cost_per_token: 0,
        guardrails: [],
      },
    }),
  }

  const res = await fetch("http://localhost:4000/model/new", requestOptions)
  const json = await res.json()
  return json.model_id
}

export async function validateConfig(model: {
  provider: string
  name: string
  baseUrl: string
  apiKey: string | undefined
}) {
  const { name, baseUrl, provider, apiKey } = model

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer sk-1234",
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
    "http://localhost:4000/health/test_connection",
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

  const aiConfigs = await sdk.aiConfigs.fetch()

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer sk-1234",
    },
    body: JSON.stringify({
      key: liteLLM.keyId,
      models: aiConfigs.map(c => c.liteLLMModelId),
    }),
  }

  const res = await fetch("http://localhost:4000/key/update", requestOptions)
  const json = await res.json()
  if (json.status === "error") {
    const trimmedError = json.result.error.split("\n")[0] || json.result.error

    throw new HTTPError(`Error syncing keys: ${trimmedError}`, 400)
  }

}
