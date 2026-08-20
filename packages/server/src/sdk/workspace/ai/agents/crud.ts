import {
  cache,
  context,
  docIds,
  encryption,
  events,
  HTTPError,
} from "@budibase/backend-core"
import { WebClient } from "@slack/web-api"
import { DocumentType, ToolExecutionPrincipal } from "@budibase/types"
import type {
  Agent,
  AgentKnowledgeSource,
  AgentOperation,
  AgentOperationToolConfig,
  Datasource,
  MSTeamsAgentIntegration,
  Optional,
  Query,
  SlackAgentIntegration,
} from "@budibase/types"
import { helpers } from "@budibase/shared-core"
import * as knowledgeBaseSdk from "../knowledgeBase"
import { assertAgentHasValidConfig } from "./utils"
import { cleanupKnowledgeForOperation, knowledgeSourceSyncQueue } from "../rag"
import { getValidProjectIdsForDuplication } from "../../projects/utils"
import {
  getLegacyQueryToolBindingReplacements,
  hasPotentialLegacyQueryToolReferences,
  replaceLegacyQueryToolReferences,
} from "./legacyQueryToolReferences"

// TODO: this will eventually go away, after a grace period
type DeprecatedAgentOperationToolConfig = Omit<
  AgentOperationToolConfig,
  "executionPrincipal"
> & {
  executionPrincipal?: ToolExecutionPrincipal | null
}

type DeprecatedAgentOperation = Omit<AgentOperation, "enabledTools"> & {
  enabledTools?: Array<string | DeprecatedAgentOperationToolConfig>
}

type DeprecatedChatAgentIntegration<T> = T & {
  chatAppId?: string
}

type DeprecatedAgent = Omit<
  Agent,
  "operations" | "MSTeamsIntegration" | "slackIntegration"
> & {
  operations?: DeprecatedAgentOperation[]
  MSTeamsIntegration?: DeprecatedChatAgentIntegration<MSTeamsAgentIntegration>
  slackIntegration?: DeprecatedChatAgentIntegration<SlackAgentIntegration>
  promptInstructions?: string
  operationName?: string
  enabledTools?: string[]
  knowledgeBases?: string[]
  knowledgeSources?: AgentKnowledgeSource[]
  allowKnowledgeSourceDownload?: boolean
}

export const normalizePersistedOperationTools = (
  tools: DeprecatedAgentOperation["enabledTools"] = []
): AgentOperationToolConfig[] =>
  tools.map(tool =>
    typeof tool === "string"
      ? {
          toolName: tool,
          executionPrincipal: ToolExecutionPrincipal.ADMIN,
        }
      : {
          ...tool,
          executionPrincipal:
            tool.executionPrincipal ?? ToolExecutionPrincipal.ADMIN,
        }
  )

const SECRET_MASK = "********"
const SECRET_ENCODING_PREFIX = "bbai_enc::"
const NAME_REQUIRED_ERROR = "Agent name is required."
const DEFAULT_OPERATION_NAME = "Main operation"
const LEGACY_QUERY_TOOL_REPLACEMENTS_CACHE_TTL_SECONDS = 60

const fetchRaw = async (): Promise<DeprecatedAgent[]> => {
  const db = context.getWorkspaceDB()
  const result = await db.allDocs<DeprecatedAgent>(
    docIds.getDocParams(DocumentType.AGENT, undefined, {
      include_docs: true,
    })
  )

  return result.rows
    .map(row => row.doc)
    .filter((doc): doc is DeprecatedAgent => !!doc)
}

const guardName = async (name: string, id?: string) => {
  if (!name.trim()) {
    throw new HTTPError(NAME_REQUIRED_ERROR, 400)
  }

  const agents = await fetchRaw()
  const normalizedName = helpers.normalizeForComparison(name)
  const duplicate = agents.find(
    agent =>
      helpers.normalizeForComparison(agent.name) === normalizedName &&
      agent._id !== id
  )

  if (duplicate) {
    throw new HTTPError(`Agent with name '${name}' already exists.`, 400)
  }
}

const encodeSecret = (value?: string): string | undefined => {
  if (!value || value.startsWith(SECRET_ENCODING_PREFIX)) {
    return value
  }
  return `${SECRET_ENCODING_PREFIX}${encryption.encrypt(value)}`
}

const decodeSecret = (value?: string): string | undefined => {
  if (!value || !value.startsWith(SECRET_ENCODING_PREFIX)) {
    return value
  }
  return encryption.decrypt(value.slice(SECRET_ENCODING_PREFIX.length))
}

const encodeSlackIntegrationSecrets = (
  slackIntegration?: Agent["slackIntegration"]
) => {
  if (!slackIntegration) {
    return slackIntegration
  }

  return {
    ...slackIntegration,
    clientSecret: encodeSecret(slackIntegration.clientSecret),
    botToken: encodeSecret(slackIntegration.botToken),
    signingSecret: encodeSecret(slackIntegration.signingSecret),
  }
}

const decodeSlackIntegrationSecrets = (
  slackIntegration?: Agent["slackIntegration"]
) => {
  if (!slackIntegration) {
    return slackIntegration
  }

  return {
    ...slackIntegration,
    clientSecret: decodeSecret(slackIntegration.clientSecret),
    botToken: decodeSecret(slackIntegration.botToken),
    signingSecret: decodeSecret(slackIntegration.signingSecret),
  }
}

const stripDeprecatedIntegrationFields = <T extends object>(
  integration: DeprecatedChatAgentIntegration<T> | undefined
): T | undefined => {
  if (!integration) {
    return integration
  }

  const { chatAppId: _chatAppId, ...sanitised } = integration
  return sanitised as T
}

const stripDeprecatedAgentFields = (raw: DeprecatedAgent): Agent => {
  const {
    promptInstructions: _promptInstructions,
    operationName: _operationName,
    enabledTools: _enabledTools,
    knowledgeBases: _knowledgeBases,
    knowledgeSources: _knowledgeSources,
    allowKnowledgeSourceDownload: _allowKnowledgeSourceDownload,
    ...agent
  } = raw
  return {
    ...agent,
    MSTeamsIntegration: stripDeprecatedIntegrationFields(
      agent.MSTeamsIntegration
    ),
    slackIntegration: stripDeprecatedIntegrationFields(agent.slackIntegration),
  } as Agent
}

const migrateOperations = (raw: DeprecatedAgent): AgentOperation[] => {
  const legacyKnowledgeSources = raw.knowledgeSources
  const legacyAllowKnowledgeSourceDownload = raw.allowKnowledgeSourceDownload

  if (Object.prototype.hasOwnProperty.call(raw, "operations")) {
    return (raw.operations || []).map(operation => ({
      ...operation,
      enabledTools: normalizePersistedOperationTools(operation.enabledTools),
    }))
  }

  if (
    raw.promptInstructions ||
    raw.operationName ||
    raw.enabledTools?.length ||
    raw.knowledgeBases?.length ||
    legacyKnowledgeSources?.length
  ) {
    return [
      {
        id: "operation_default",
        name: raw.operationName || DEFAULT_OPERATION_NAME,
        live: true,
        promptInstructions: raw.promptInstructions || "",
        enabledTools: normalizePersistedOperationTools(raw.enabledTools),
        knowledgeBases: raw.knowledgeBases || [],
        knowledgeSources: legacyKnowledgeSources || [],
        allowKnowledgeSourceDownload:
          legacyAllowKnowledgeSourceDownload ?? true,
      },
    ]
  }

  return []
}

const withAgentDefaults = (raw: DeprecatedAgent): Agent => {
  const agent = stripDeprecatedAgentFields(raw)
  return {
    ...agent,
    live: raw.live ?? false,
    operations: migrateOperations(raw),
    slackIntegration: decodeSlackIntegrationSecrets(agent.slackIntegration),
  }
}

// TODO: remove after agents created before query tool IDs were introduced have
// had enough time to be resaved with their current bindings.
const withCurrentQueryToolReferences = async (agents: Agent[]) => {
  if (!hasPotentialLegacyQueryToolReferences(agents)) {
    return agents
  }

  const workspaceId = context.getOrThrowWorkspaceId()
  const replacementEntries = await cache.withCache<[string, string][]>(
    `legacy_agent_query_tool_replacements_${workspaceId}`,
    LEGACY_QUERY_TOOL_REPLACEMENTS_CACHE_TTL_SECONDS,
    async () => {
      const db = context.getWorkspaceDB()
      const [datasourceResult, queryResult] = await Promise.all([
        db.allDocs<Datasource>(
          docIds.getDocParams(DocumentType.DATASOURCE, undefined, {
            include_docs: true,
          })
        ),
        db.allDocs<Query>(
          docIds.getDocParams(DocumentType.QUERY, undefined, {
            include_docs: true,
          })
        ),
      ])
      return Array.from(
        getLegacyQueryToolBindingReplacements({
          datasources: datasourceResult.rows
            .map(row => row.doc)
            .filter((doc): doc is Datasource => !!doc),
          queries: queryResult.rows
            .map(row => row.doc)
            .filter((doc): doc is Query => !!doc),
        }).entries()
      )
    }
  )
  const replacements = new Map(replacementEntries)

  return agents.map(agent =>
    replaceLegacyQueryToolReferences({ agent, replacements })
  )
}

type AgentIntegrationKeys = {
  [K in keyof Required<Agent>]: K extends `${string}Integration` ? K : never
}[keyof Required<Agent>]

type AgentIntegrationSanitisers = {
  [K in AgentIntegrationKeys]: (integration: Agent[K]) => Agent[K]
}

const sanitiseMSTeamsIntegration = (
  msTeamsIntegration: Agent["MSTeamsIntegration"]
): Agent["MSTeamsIntegration"] => {
  if (!msTeamsIntegration) {
    return msTeamsIntegration
  }

  const {
    appPassword: _appPassword,
    messagingEndpointUrl: _messagingEndpointUrl,
    ...sanitised
  } = msTeamsIntegration
  return sanitised
}

const sanitiseSlackIntegration = (
  slackIntegration: Agent["slackIntegration"]
): Agent["slackIntegration"] => {
  if (!slackIntegration) {
    return slackIntegration
  }

  const {
    clientSecret: _clientSecret,
    botToken: _botToken,
    signingSecret: _signingSecret,
    messagingEndpointUrl: _messagingEndpointUrl,
    ...sanitised
  } = slackIntegration
  return sanitised
}

const agentIntegrationSanitisers: AgentIntegrationSanitisers = {
  MSTeamsIntegration: sanitiseMSTeamsIntegration,
  slackIntegration: sanitiseSlackIntegration,
}

export type SanitisedAgent = Omit<Agent, "publishedAt">

export const sanitiseAgentForExport = (agent: Agent): SanitisedAgent => {
  const sanitised = structuredClone(withAgentDefaults(agent)) as Agent
  sanitised.live = false
  delete sanitised.publishedAt
  sanitised.operations = sanitised.operations?.map(operation => ({
    ...operation,
    knowledgeBases: [],
    knowledgeSources: [],
  }))

  sanitised.MSTeamsIntegration = agentIntegrationSanitisers.MSTeamsIntegration(
    sanitised.MSTeamsIntegration
  )
  sanitised.slackIntegration = agentIntegrationSanitisers.slackIntegration(
    sanitised.slackIntegration
  )

  return sanitised
}

const resolveMSTeamsIntegration = ({
  existing,
  incoming,
}: {
  existing?: Agent["MSTeamsIntegration"]
  incoming?: Agent["MSTeamsIntegration"]
}) => {
  if (incoming === undefined) {
    return existing
  }
  if (!incoming) {
    return incoming
  }

  const resolved = { ...incoming }

  if (incoming.appPassword === SECRET_MASK && existing?.appPassword) {
    resolved.appPassword = existing.appPassword
  }

  return resolved
}

const withSlackTeamId = async (
  integration: Agent["slackIntegration"],
  existing?: Agent["slackIntegration"]
): Promise<Agent["slackIntegration"]> => {
  const botToken = integration?.botToken
  if (!integration || !botToken) {
    return integration
  }
  // teamId is server-derived, never trusted from the client.
  if (botToken === existing?.botToken && existing?.teamId) {
    return { ...integration, teamId: existing.teamId }
  }
  // Drop any inherited teamId - it belongs to the old token's workspace,
  // and leaving it unset on failure lets the next save retry.
  const { teamId: _teamId, ...withoutTeamId } = integration
  try {
    // Single attempt - the default retry policy would block the save for 30 minutes.
    const client = new WebClient(botToken, {
      retryConfig: { retries: 0 },
      timeout: 5000,
    })
    const auth = await client.auth.test()
    return { ...withoutTeamId, teamId: auth.team_id }
  } catch (err) {
    console.warn("Failed to resolve Slack workspace for integration", {
      error: err instanceof Error ? err.message : String(err),
    })
    return withoutTeamId
  }
}

const resolveSlackIntegration = ({
  existing,
  incoming,
}: {
  existing?: Agent["slackIntegration"]
  incoming?: Agent["slackIntegration"]
}) => {
  if (incoming === undefined) {
    return existing
  }
  if (!incoming) {
    return incoming
  }

  const resolved = { ...incoming }

  if (incoming.botToken === SECRET_MASK && existing?.botToken) {
    resolved.botToken = existing.botToken
  }

  if (incoming.clientSecret === SECRET_MASK && existing?.clientSecret) {
    resolved.clientSecret = existing.clientSecret
  }

  if (incoming.signingSecret === SECRET_MASK && existing?.signingSecret) {
    resolved.signingSecret = existing.signingSecret
  }

  return resolved
}

export async function fetch(): Promise<Agent[]> {
  const agents = (await fetchRaw()).map(withAgentDefaults)
  return withCurrentQueryToolReferences(agents)
}

export async function getOrThrow(agentId: string | undefined): Promise<Agent> {
  if (!agentId) {
    throw new HTTPError("agentId is required", 400)
  }

  const db = context.getWorkspaceDB()
  const rawAgent = await db.tryGet<DeprecatedAgent>(agentId)
  if (!rawAgent) {
    throw new HTTPError("Agent not found", 404)
  }

  const agent = withAgentDefaults(rawAgent)
  const [resolvedAgent] = await withCurrentQueryToolReferences([agent])
  return resolvedAgent
}

export async function create(
  request: Optional<
    Omit<Agent, "_id" | "_rev" | "createdAt" | "updatedAt" | "publishedAt">,
    "aiconfig"
  >
): Promise<Agent> {
  const db = context.getWorkspaceDB()
  const now = new Date().toISOString()

  await guardName(request.name)

  const agent: Agent = {
    _id: docIds.generateAgentID(),
    name: request.name,
    description: request.description,
    aiconfig: request.aiconfig || "", // this might be set later, it will be validated on publish/usage
    projectIds: request.projectIds,
    operations: request.operations,
    live: request.live ?? false,
    publishedAt: request.live ? now : undefined,
    icon: request.icon,
    iconColor: request.iconColor,
    goal: request.goal,
    createdAt: now,
    createdBy: request.createdBy,
    MSTeamsIntegration: request.MSTeamsIntegration,
    slackIntegration: await withSlackTeamId(request.slackIntegration),
  }

  if (agent.live) {
    await assertAgentHasValidConfig(agent)
  }

  const { rev } = await db.put({
    ...agent,
    slackIntegration: encodeSlackIntegrationSecrets(agent.slackIntegration),
  })
  agent._rev = rev
  const result = withAgentDefaults(agent)
  events.ai.agentCreated(result)
  return result
}

export async function duplicate(
  source: Agent,
  createdBy: string
): Promise<Agent> {
  const allAgents = await fetch()
  const name = helpers.duplicateName(
    source.name,
    allAgents.map(agent => agent.name)
  )

  return await create({
    name,
    description: source.description,
    aiconfig: source.aiconfig,
    projectIds: await getValidProjectIdsForDuplication(source.projectIds),
    goal: source.goal,
    icon: source.icon,
    iconColor: source.iconColor,
    live: source.live,
    _deleted: false,
    createdBy,
    operations: source.operations,
  })
}

export async function update(agent: Agent): Promise<Agent> {
  const { _id, _rev } = agent
  if (!_id || !_rev) {
    throw new HTTPError("_id and _rev are required", 400)
  }

  const db = context.getWorkspaceDB()
  const existing = await getOrThrow(_id)

  const incomingName = agent.name ?? existing.name
  const normalizedName = helpers.normalizeForComparison(incomingName)
  const normalizedExistingName = helpers.normalizeForComparison(existing.name)

  if (normalizedName !== normalizedExistingName) {
    await guardName(incomingName, _id)
  }

  const now = new Date().toISOString()
  const incomingOperations = agent.operations ?? existing.operations ?? []
  const removedOperations = (existing.operations ?? []).filter(
    existingOperation =>
      existingOperation.id &&
      !incomingOperations.some(
        incomingOperation => incomingOperation.id === existingOperation.id
      )
  )

  const updated = stripDeprecatedAgentFields({
    ...existing,
    ...agent,
    updatedAt: now,
    operations: incomingOperations,
    MSTeamsIntegration: resolveMSTeamsIntegration({
      existing: existing?.MSTeamsIntegration,
      incoming: agent.MSTeamsIntegration,
    }),
    slackIntegration: resolveSlackIntegration({
      existing: existing?.slackIntegration,
      incoming: agent.slackIntegration,
    }),
  } satisfies Agent)

  updated.slackIntegration = await withSlackTeamId(
    updated.slackIntegration,
    existing?.slackIntegration
  )

  if (updated.live) {
    await assertAgentHasValidConfig(updated)
  }

  if (removedOperations.length > 0) {
    for (const removedOperation of removedOperations) {
      await cleanupKnowledgeForOperation(_id, removedOperation.id!)
    }
  }

  const hasBeenPublished =
    !!existing?.publishedAt || existing?.live === true || updated.live === true
  updated.publishedAt = hasBeenPublished
    ? existing?.publishedAt || now
    : undefined

  const { rev } = await db.put({
    ...updated,
    slackIntegration: encodeSlackIntegrationSecrets(updated.slackIntegration),
  })
  updated._rev = rev
  const result = withAgentDefaults(updated)
  if (removedOperations.length > 0) {
    await knowledgeSourceSyncQueue.reconcileAgentJobs(result)
  }
  events.ai.agentUpdated(result)
  return result
}

export async function remove(agentId: string) {
  const db = context.getWorkspaceDB()
  const agent = await getOrThrow(agentId)

  const knowledgeBaseIds = agent.operations?.flatMap(
    operation => operation.knowledgeBases || []
  )

  if (knowledgeBaseIds?.length) {
    for (const knowledgeBaseId of knowledgeBaseIds) {
      const knowledgeBase = await knowledgeBaseSdk.find(knowledgeBaseId)
      if (!knowledgeBase) {
        continue
      }

      const files =
        await knowledgeBaseSdk.listKnowledgeBaseFiles(knowledgeBaseId)
      for (const file of files) {
        try {
          await knowledgeBaseSdk.removeKnowledgeBaseFile(knowledgeBase, file)
        } catch (error) {
          console.log(
            "Failed to remove knowledge base file for agent deletion",
            {
              agentId,
              knowledgeBaseId,
              fileId: file._id,
              error,
            }
          )
        }
      }

      try {
        await knowledgeBaseSdk.remove(knowledgeBaseId)
      } catch (error) {
        console.log("Failed to remove knowledge base for agent deletion", {
          agentId,
          knowledgeBaseId,
          error,
        })
      }
    }
  }

  await db.remove(agent)
  events.ai.agentDeleted(agent)
}
