import { context, docIds, HTTPError, locks } from "@budibase/backend-core"
import { utils } from "@budibase/shared-core"
import {
  AIConfigType,
  LiteLLMKeyConfig,
  ReasoningEffort,
  LockName,
  LockType,
  UserContext,
} from "@budibase/types"
import { buildLiteLLMParams } from "../helpers/litellm"
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

function buildBudibaseLiteLLMParams(
  model: string,
  credentialFields: Record<string, string>
) {
  return {
    model,
    custom_llm_provider: "openai_like",
    ...credentialFields,
  }
}

export async function addModel({
  provider,
  model,
  displayName,
  credentialFields,
  configType,
  reasoningEffort,
  validate = true,
}: {
  provider: string
  model: string
  displayName?: string
  credentialFields: Record<string, string>
  configType: AIConfigType
  reasoningEffort?: ReasoningEffort
  validate?: boolean
}): Promise<string> {
  if (validate) {
    await validateConfig({
      provider,
      name: model,
      credentialFields,
      configType,
    })
  }

  const litellmParams =
    provider === "budibase"
      ? buildBudibaseLiteLLMParams(model, credentialFields)
      : buildLiteLLMParams({
          provider: await mapToLiteLLMProvider(provider),
          name: model,
          credentialFields,
          configType,
          reasoningEffort,
        })

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: liteLLMAuthorizationHeader,
    },
    body: JSON.stringify({
      model_name: displayName || model,
      litellm_params: litellmParams,
      model_info: {
        created_at: new Date().toISOString(),
        created_by: (context.getIdentity() as UserContext)?.email,
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
  reasoningEffort,
}: {
  llmModelId: string
  provider: string
  name: string
  credentialFields: Record<string, string>
  configType: AIConfigType
  reasoningEffort?: ReasoningEffort
}) {
  await validateConfig({ provider, name, credentialFields, configType })

  const litellmParams =
    provider === "budibase"
      ? buildBudibaseLiteLLMParams(name, credentialFields)
      : buildLiteLLMParams({
          provider: await mapToLiteLLMProvider(provider),
          name,
          credentialFields,
          configType,
          reasoningEffort,
        })

  const requestOptions = {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: liteLLMAuthorizationHeader,
    },
    body: JSON.stringify({
      model_name: name,
      litellm_params: litellmParams,
      model_info: {
        updated_at: new Date().toISOString(),
        updated_by: (context.getIdentity() as UserContext)?.email,
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

async function validateEmbeddingConfig(model: {
  provider: string
  name: string
  credentialFields: Record<string, string>
}) {
  let modelId: string | undefined

  try {
    modelId = await addModel({
      provider: model.provider,
      model: model.name,
      displayName: `tmp-${model.name}`,
      credentialFields: model.credentialFields,
      configType: AIConfigType.EMBEDDINGS,
      validate: false,
    })

    const response = await fetch(`${liteLLMUrl}/v1/embeddings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: liteLLMAuthorizationHeader,
      },
      body: JSON.stringify({
        model: modelId,
        input: "Budibase embedding validation",
      }),
    })

    if (!response.ok) {
      const text = await response.text()
      throw new HTTPError(text || "Embedding validation failed", 500)
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    throw new HTTPError(`Error validating configuration: ${message}`, 400)
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

async function validateGenerationModel(model: {
  provider: string
  name: string
  credentialFields: Record<string, string>
}) {
  let { name, provider, credentialFields } = model
  const mappedProvider =
    provider === "budibase" ? undefined : await mapToLiteLLMProvider(provider)

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: liteLLMAuthorizationHeader,
    },
    body: JSON.stringify({
      litellm_params: {
        ...(provider === "budibase"
          ? buildBudibaseLiteLLMParams(name, credentialFields)
          : {
              model: `${mappedProvider}/${name}`,
              custom_llm_provider: mappedProvider,
              ...credentialFields,
            }),
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

async function validateConfig(model: {
  provider: string
  name: string
  credentialFields: Record<string, string>
  configType: AIConfigType
}) {
  if (model.provider === "budibase") {
    return
  }
  switch (model.configType) {
    case AIConfigType.EMBEDDINGS:
      return validateEmbeddingConfig(model)
    case AIConfigType.GENERATION:
      return validateGenerationModel(model)
    default:
      throw utils.unreachable(model.configType)
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
  if (provider === "budibase") {
    return "openai_like"
  }

  const providers = await fetchPublicProviders()
  const result = providers.find(p => p.provider === provider)?.litellm_provider

  if (!result) {
    throw new Error(`Provider ${provider} not found in LiteLLM`)
  }
  return result
}
