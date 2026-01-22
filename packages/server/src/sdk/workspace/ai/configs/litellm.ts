import { context, docIds, HTTPError, locks } from "@budibase/backend-core"
import {
  AIConfigType,
  LiteLLMKeyConfig,
  LockName,
  LockType,
} from "@budibase/types"
import fetch from "node-fetch"
import env from "../../../../environment"
import * as configSdk from "../configs"

const liteLLMUrl = env.LITELLM_URL
const liteLLMAuthorizationHeader = `Bearer ${env.LITELLM_MASTER_KEY}`

async function generateKey(
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

  const response = await fetch(`${liteLLMUrl}/key/generate`, requestOptions)

  const json = await response.json()
  return { id: json.token_id, secret: json.key }
}

export async function addModel({
  provider,
  name,
  credentialFields,
  configType,
}: {
  provider: string
  name: string
  credentialFields: Record<string, string>
  configType: AIConfigType
}): Promise<string> {
  provider = await mapToLiteLLMProvider(provider)

  await validateConfig({ provider, name, credentialFields, configType })

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: liteLLMAuthorizationHeader,
    },
    body: JSON.stringify({
      model_name: name,
      litellm_params: {
        custom_llm_provider: provider,
        model: `${provider}/${name}`,
        use_in_pass_through: false,
        use_litellm_proxy: false,
        merge_reasoning_content_in_choices: false,
        input_cost_per_token: 0,
        output_cost_per_token: 0,
        guardrails: [],
        ...credentialFields,
      },
      model_info: {
        created_at: new Date().toISOString(),
        created_by: (context.getIdentity() as any)?.email,
      },
    }),
  }

  const res = await fetch(`${liteLLMUrl}/model/new`, requestOptions)
  const json = await res.json()
  return json.model_id
}

export async function updateModel({
  llmModelId,
  provider,
  name,
  credentialFields,
  configType,
}: {
  llmModelId: string
  provider: string
  name: string
  credentialFields: Record<string, string>
  configType: AIConfigType
}) {
  provider = await mapToLiteLLMProvider(provider)
  await validateConfig({ provider, name, credentialFields, configType })

  const requestOptions = {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: liteLLMAuthorizationHeader,
    },
    body: JSON.stringify({
      model_name: name,
      litellm_params: {
        custom_llm_provider: provider,
        model: `${provider}/${name}`,
        use_in_pass_through: false,
        use_litellm_proxy: false,
        merge_reasoning_content_in_choices: false,
        input_cost_per_token: 0,
        output_cost_per_token: 0,
        guardrails: [],
        ...credentialFields,
      },
      model_info: {
        updated_at: new Date().toISOString(),
        updated_by: (context.getIdentity() as any)?.email,
      },
    }),
  }

  const res = await fetch(
    `${liteLLMUrl}/model/${llmModelId}/update`,
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
  credentialFields: Record<string, string>
  configType: AIConfigType
}) {
  const { name, provider, credentialFields, configType } = model

  if (configType === AIConfigType.EMBEDDINGS) {
    let modelId: string | undefined

    try {
      const createModelResponse = await fetch(`${liteLLMUrl}/model/new`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: liteLLMAuthorizationHeader,
        },
        body: JSON.stringify({
          model_name: name,
          litellm_params: {
            custom_llm_provider: provider,
            model: `${provider}/${name}`,
            use_in_pass_through: false,
            use_litellm_proxy: false,
            merge_reasoning_content_in_choices: false,
            input_cost_per_token: 0,
            output_cost_per_token: 0,
            guardrails: [],
            ...credentialFields,
          },
          model_info: {
            created_at: new Date().toISOString(),
            created_by: (context.getIdentity() as any)?.email,
          },
        }),
      })

      const createModelJson = await createModelResponse.json()
      if (!createModelResponse.ok || createModelJson.status === "error") {
        const errorMessage =
          createModelJson?.result?.error ||
          createModelJson?.error ||
          createModelResponse.statusText
        throw new HTTPError(
          `Error validating configuration: ${errorMessage}`,
          400
        )
      }

      modelId = createModelJson.model_id

      const response = await fetch(`${liteLLMUrl}/v1/embeddings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: liteLLMAuthorizationHeader,
        },
        body: JSON.stringify({
          model: name,
          input: "Budibase embedding validation",
        }),
      })

      if (!response.ok) {
        const text = await response.text()
        throw new HTTPError(
          `Error validating configuration: ${text || response.statusText}`,
          400
        )
      }
    } finally {
      if (modelId) {
        try {
          await fetch(`${liteLLMUrl}/model/delete`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: liteLLMAuthorizationHeader,
            },
            body: JSON.stringify({ id: modelId }),
          })
        } catch (e) {
          console.error(
            "Error deleting the temporary model for validating embeddings",
            { e }
          )
        }
      }
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
        ...credentialFields,
      },
    }),
  }

  const res = await fetch(
    `${liteLLMUrl}/health/test_connection`,
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

export async function getKeySettings(): Promise<{
  keyId: string
  secretKey: string
}> {
  const db = context.getWorkspaceDB()
  const keyDocId = docIds.getLiteLLMKeyID()

  let keyConfig = await db.tryGet<LiteLLMKeyConfig>(keyDocId)
  if (!keyConfig) {
    const workspaceId = context.getProdWorkspaceId()
    if (!workspaceId) {
      throw new HTTPError("Workspace ID is required to configure LiteLLM", 400)
    }
    const { result } = await locks.doWithLock(
      {
        name: LockName.LITELLM_KEY,
        type: LockType.AUTO_EXTEND,
        resource: workspaceId,
      },
      async () => {
        let existingKeyConfig = await db.tryGet<LiteLLMKeyConfig>(keyDocId)
        if (existingKeyConfig) {
          return existingKeyConfig
        }

        const key = await generateKey(workspaceId)
        const config: LiteLLMKeyConfig = {
          _id: keyDocId,
          keyId: key.id,
          secretKey: key.secret,
        }
        const { rev } = await db.put(config)
        return { ...config, _rev: rev }
      }
    )
    keyConfig = result
  }
  return {
    keyId: keyConfig.keyId,
    secretKey: keyConfig.secretKey,
  }
}

export async function syncKeyModels() {
  const { keyId } = await getKeySettings()

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
      key: keyId,
      models: modelIds,
    }),
  }

  const res = await fetch(`${liteLLMUrl}/key/update`, requestOptions)
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
  default_model_placeholder?: string | null
  credential_fields: {
    key: string
    label: string
    placeholder?: string | null
    tooltip?: string | null
    required?: boolean
    field_type?: string
    options?: string[] | null
    default_value?: string | null
  }[]
}

export async function fetchPublicProviders(): Promise<LiteLLMPublicProvider[]> {
  const res = await fetch(`${liteLLMUrl}/public/providers/fields`)
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
