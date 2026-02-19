import {
  context,
  docIds,
  HTTPError,
  locks,
  tenancy,
} from "@budibase/backend-core"
import { utils } from "@budibase/shared-core"
import {
  AIConfigType,
  BUDIBASE_AI_PROVIDER_ID,
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

type LiteLLMTeam = {
  id: string
  alias: string
}

interface LiteLLMTenantTeamConfig {
  _id: string
  _rev?: string
  teamId: string
  teamAlias: string
}

const tenantTeamDocId = "litellmteam_config"

const getTenantTeamAlias = () => {
  const tenantId = context.getTenantId()
  return `budibase-tenant-${tenantId}`
}

async function createTeam(alias: string): Promise<LiteLLMTeam> {
  const response = await fetch(`${liteLLMUrl}/team/new`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: liteLLMAuthorizationHeader,
    },
    body: JSON.stringify({
      team_alias: alias,
    }),
  })

  if (!response.ok) {
    const text = await response.text()
    throw new HTTPError(
      `Error creating LiteLLM team: ${text || response.statusText}`,
      response.status
    )
  }

  const json = await response.json()
  const teamId = json.team_id || json.team_id_string || json?.team?.team_id
  if (!teamId) {
    throw new HTTPError("LiteLLM team creation did not return a team ID", 500)
  }
  return {
    id: teamId,
    alias,
  }
}

async function getOrCreateTenantTeam(): Promise<LiteLLMTeam> {
  const tenantId = context.getTenantId()
  const teamAlias = getTenantTeamAlias()
  const tenantDb = tenancy.getTenantDB(tenantId)

  const existing =
    await tenantDb.tryGet<LiteLLMTenantTeamConfig>(tenantTeamDocId)
  if (existing) {
    return {
      id: existing.teamId,
      alias: existing.teamAlias,
    }
  }

  const { result } = await locks.doWithLock(
    {
      name: LockName.LITELLM_KEY,
      type: LockType.AUTO_EXTEND,
      resource: tenantId,
    },
    async () => {
      const maybeExisting =
        await tenantDb.tryGet<LiteLLMTenantTeamConfig>(tenantTeamDocId)
      if (maybeExisting) {
        return {
          id: maybeExisting.teamId,
          alias: maybeExisting.teamAlias,
        }
      }

      const team = await createTeam(teamAlias)
      await tenantDb.put({
        _id: tenantTeamDocId,
        teamId: team.id,
        teamAlias: team.alias,
      })
      return team
    }
  )

  return result
}

async function generateKey(
  name: string,
  teamId: string
): Promise<{ id: string; secret: string }> {
  const body = JSON.stringify({
    key_alias: name,
    team_id: teamId,
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
  if (!response.ok) {
    const text = await response.text()
    throw new HTTPError(
      `Error generating LiteLLM key: ${text || response.statusText}`,
      response.status
    )
  }

  const json = await response.json()
  return { id: json.token_id, secret: json.key }
}

export async function addModel({
  provider,
  model,
  displayName,
  credentialFields,
  configType,
  reasoningEffort,
}: {
  provider: string
  model: string
  displayName?: string
  credentialFields: Record<string, string>
  configType: AIConfigType
  reasoningEffort?: ReasoningEffort
}): Promise<string> {
  const litellmParams = buildLiteLLMParams({
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
  const litellmParams = buildLiteLLMParams({
    provider: await mapToLiteLLMProvider(provider),
    name: name,
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

async function validateCompletionsModel(model: {
  provider: string
  name: string
  credentialFields: Record<string, string>
}) {
  let { name, provider, credentialFields } = model
  const mappedProvider = await mapToLiteLLMProvider(provider)

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: liteLLMAuthorizationHeader,
    },
    body: JSON.stringify({
      litellm_params: {
        model: `${mappedProvider}/${name}`,
        custom_llm_provider: mappedProvider,
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

export async function validateConfig(model: {
  provider: string
  name: string
  credentialFields: Record<string, string>
  configType: AIConfigType
}) {
  switch (model.configType) {
    case AIConfigType.EMBEDDINGS:
      return validateEmbeddingConfig(model)
    case AIConfigType.COMPLETIONS:
      return validateCompletionsModel(model)
    default:
      throw utils.unreachable(model.configType)
  }
}

export async function getKeySettings(): Promise<{
  keyId: string
  secretKey: string
  teamId: string
}> {
  const db = context.getWorkspaceDB()
  const keyDocId = docIds.getLiteLLMKeyID()

  let keyConfig = await db.tryGet<LiteLLMKeyConfig>(keyDocId)
  if (!keyConfig || !keyConfig.teamId) {
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
        const shouldCreateTenantTeam = !existingKeyConfig?.teamId

        if (existingKeyConfig && !shouldCreateTenantTeam) {
          return existingKeyConfig
        }

        const team = await getOrCreateTenantTeam()

        if (existingKeyConfig) {
          await updateKey({
            keyId: existingKeyConfig.keyId,
            teamId: team.id,
          })
          const updatedConfig: LiteLLMKeyConfig = {
            ...existingKeyConfig,
            teamId: team.id,
            teamAlias: team.alias,
          }
          const { rev } = await db.put(updatedConfig)
          return { ...updatedConfig, _rev: rev }
        }

        const key = await generateKey(workspaceId, team.id)
        const config: LiteLLMKeyConfig = {
          _id: keyDocId,
          keyId: key.id,
          secretKey: key.secret,
          teamId: team.id,
          teamAlias: team.alias,
        }
        const { rev } = await db.put({
          ...config,
          _rev: existingKeyConfig?._rev,
        })
        return { ...config, _rev: rev }
      }
    )
    keyConfig = result
  }
  return {
    keyId: keyConfig.keyId,
    secretKey: keyConfig.secretKey,
    teamId: keyConfig.teamId,
  }
}

async function updateKey({
  keyId,
  modelIds,
  teamId,
}: {
  keyId: string
  modelIds?: string[]
  teamId?: string
}) {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: liteLLMAuthorizationHeader,
    },
    body: JSON.stringify({
      key: keyId,
      ...(modelIds ? { models: modelIds } : {}),
      ...(teamId ? { team_id: teamId } : {}),
    }),
  }

  const res = await fetch(`${liteLLMUrl}/key/update`, requestOptions)
  const json = await res.json()
  if (json.status === "error") {
    const trimmedError = json.result.error.split("\n")[0] || json.result.error

    throw new HTTPError(`Error syncing keys: ${trimmedError}`, 400)
  }
}

export async function syncKeyModels() {
  const { keyId } = await getKeySettings()

  const aiConfigs = await configSdk.fetch()
  const modelIds = aiConfigs
    .map(c => c.liteLLMModelId)
    .filter((id): id is string => !!id)

  await updateKey({
    keyId,
    modelIds,
  })
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
  if (provider === BUDIBASE_AI_PROVIDER_ID) {
    return "custom_openai"
  }

  const providers = await fetchPublicProviders()
  const result = providers.find(p => p.provider === provider)?.litellm_provider

  if (!result) {
    throw new Error(`Provider ${provider} not found in LiteLLM`)
  }
  return result
}
