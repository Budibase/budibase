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
  KnowledgeBaseType,
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
import sdk from "../../.."

const liteLLMUrl = env.LITELLM_URL
const liteLLMAuthorizationHeader = `Bearer ${env.LITELLM_MASTER_KEY}`

function sanitizeLiteLLMErrorMessage(message?: string): string | undefined {
  if (!message) {
    return
  }

  const hasTraceback =
    /stack trace:|Traceback \(most recent call last\):/i.test(message)

  let cleaned = message
    .split(/stack trace:/i)[0]
    .split(/Traceback \(most recent call last\):/i)[0]
    .replace(/\s+/g, " ")
    .trim()

  if (hasTraceback) {
    cleaned = cleaned
      .replace(/^litellm\.[\w.]+:\s*/i, "")
      .replace(/^[\w.]+Exception\s*-\s*/i, "")
      .trim()
  }

  return cleaned || message
}

export enum LiteLLMStatus {
  OK = "ok",
  STARTING = "starting",
  NOT_CONFIGURED = "not configured",
}

type LiteLLMTeam = {
  id: string
  alias: string
}

interface LiteLLMTenantTeamConfig {
  _id: string
  _rev?: string
  teamId: string
}

const tenantTeamDocId = "litellmteam_config"

const getTenantTeamAlias = () => {
  const tenantId = context.getTenantId()
  return tenantId
}

const getKeyAlias = (workspaceId: string) => {
  return `${context.getTenantId()}:${workspaceId}`
}

const getModelAlias = (configId: string) => {
  return `${context.getTenantId()}:${context.getProdWorkspaceId()}:${configId}`
}

export async function getLiteLLMStatus({
  signal,
}: {
  signal?: AbortSignal
} = {}): Promise<LiteLLMStatus> {
  if (!env.LITELLM_MASTER_KEY) {
    return LiteLLMStatus.NOT_CONFIGURED
  }

  try {
    const response = await fetch(`${liteLLMUrl}/health/liveliness`, {
      signal,
    })
    return response.ok ? LiteLLMStatus.OK : LiteLLMStatus.STARTING
  } catch {
    return LiteLLMStatus.STARTING
  }
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
      alias: getTenantTeamAlias(),
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
          alias: getTenantTeamAlias(),
        }
      }

      const team = await createTeam(teamAlias)
      await tenantDb.put({
        _id: tenantTeamDocId,
        teamId: team.id,
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
  configId,
  provider,
  model,
  credentialFields,
  configType,
  reasoningEffort,
}: {
  configId?: string
  provider: string
  model: string
  credentialFields: Record<string, string>
  configType: AIConfigType
  reasoningEffort?: ReasoningEffort
}): Promise<string> {
  configId ??= docIds.generateAIConfigID()
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
      model_name: getModelAlias(configId),
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
  configId,
  llmModelId,
  provider,
  name,
  credentialFields,
  configType,
  reasoningEffort,
}: {
  configId: string
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
      model_name: getModelAlias(configId),
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
  if (!res.ok) {
    const json = await res.json()
    const message = sanitizeLiteLLMErrorMessage(
      json.error?.message || json.result?.error
    )

    throw new HTTPError(
      [`Error updating configuration`, message].filter(Boolean).join(": "),
      res.status || 400
    )
  }

  const json = await res.json()
  if (json?.status && json.status !== "success") {
    const message = sanitizeLiteLLMErrorMessage(
      json.error?.message || json.result?.error
    )
    throw new HTTPError(
      ["Error updating configuration", message].filter(Boolean).join(": "),
      400
    )
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
    if (text.includes("DB not connected")) {
      throw new HTTPError(
        "LiteLLM requires a database connection. Set DATABASE_URL on LiteLLM when store_model_in_db is enabled.",
        400
      )
    }
    throw new HTTPError(text, 500)
  }

  const json = await res.json()
  if (json?.status !== "success") {
    const message = [
      "Error validating configuration",
      sanitizeLiteLLMErrorMessage(json.error?.message || json.result?.error),
    ]
      .filter(Boolean)
      .join(": ")

    throw new HTTPError(message, 400)
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
          }
          const { rev } = await db.put(updatedConfig)
          return { ...updatedConfig, _rev: rev }
        }

        const key = await generateKey(getKeyAlias(workspaceId), team.id)
        const config: LiteLLMKeyConfig = {
          _id: keyDocId,
          keyId: key.id,
          secretKey: key.secret,
          teamId: team.id,
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
    teamId: keyConfig.teamId,
  }
}

async function updateKey({
  keyId,
  modelIds,
  vectorStoreIds,
  teamId,
}: {
  keyId: string
  modelIds?: string[]
  vectorStoreIds?: string[]
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
      ...(vectorStoreIds ? { vector_store_ids: vectorStoreIds } : {}),
      ...(teamId ? { team_id: teamId } : {}),
    }),
  }

  const res = await fetch(`${liteLLMUrl}/key/update`, requestOptions)
  const json = await res.json()
  if (!res.ok) {
    const message = ["Error syncing keys", json.error?.message]
      .filter(Boolean)
      .join(": ")

    throw new HTTPError(message, res.status || 400)
  }
}

function isMissingVirtualKeyError(error: any): boolean {
  const message = `${error?.message || ""}`.toLowerCase()
  const status = error?.status

  return status === 401 && message.includes("user key does not exist in db")
}

async function regenerateWorkspaceKey() {
  const db = context.getWorkspaceDB()
  const keyDocId = docIds.getLiteLLMKeyID()
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
      const existing = await db.tryGet<LiteLLMKeyConfig>(keyDocId)
      const teamId = existing?.teamId || (await getOrCreateTenantTeam()).id
      const key = await generateKey(getKeyAlias(workspaceId), teamId)
      const updatedConfig: LiteLLMKeyConfig = {
        _id: keyDocId,
        _rev: existing?._rev,
        keyId: key.id,
        secretKey: key.secret,
        teamId,
      }
      const { rev } = await db.put(updatedConfig)
      return {
        ...updatedConfig,
        _rev: rev,
      }
    }
  )

  return result
}

export async function syncKeyVectorStores() {
  const kbs = await sdk.ai.knowledgeBase.fetch()
  const vectorStoreIds = kbs
    .filter(kb => kb.type === KnowledgeBaseType.GEMINI)
    .map(kb => kb.config.googleFileStoreId)
    .filter((id): id is string => !!id)
    .sort()

  const { keyId } = await getKeySettings()
  await updateKey({
    keyId,
    vectorStoreIds,
  })
}

export async function syncKeyModels() {
  let { keyId } = await getKeySettings()

  const aiConfigs = await configSdk.fetch()
  const modelIds = aiConfigs
    .map(c => c.liteLLMModelId)
    .filter((id): id is string => !!id)

  let success = false
  try {
    await updateKey({
      keyId,
      modelIds,
    })
    success = true
  } catch (err: any) {
    if (!isMissingVirtualKeyError(err)) {
      throw err
    }
  }

  if (!success) {
    const keyRes = await fetch(`${liteLLMUrl}/key/info?key=${keyId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: liteLLMAuthorizationHeader,
      },
    })
    if (keyRes.status !== 404) {
      throw new Error("Key already exists, cannot be recreated")
    }

    const regeneratedKey = await regenerateWorkspaceKey()
    keyId = regeneratedKey.keyId
    await updateKey({
      keyId,
      modelIds,
    })
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

type LiteLLMModelCostMap = Record<
  string,
  {
    litellm_provider?: string | string[] | null
    mode?: string | string[] | null
    supports_reasoning?: boolean | null
  }
>

export async function fetchPublicModelCostMap(): Promise<LiteLLMModelCostMap> {
  const res = await fetch(`${liteLLMUrl}/public/litellm_model_cost_map`)
  if (!res.ok) {
    const text = await res.text()
    throw new HTTPError(
      `Error fetching LiteLLM model cost map: ${text || res.statusText}`,
      res.status
    )
  }

  const json = await res.json()
  return json as LiteLLMModelCostMap
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
