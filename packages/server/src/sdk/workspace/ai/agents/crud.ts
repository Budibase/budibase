import {
  context,
  docIds,
  encryption,
  events,
  HTTPError,
} from "@budibase/backend-core"
import { DocumentType } from "@budibase/types"
import type {
  Agent,
  AgentKnowledgeSource,
  AgentOperation,
  Optional,
} from "@budibase/types"
import { helpers } from "@budibase/shared-core"
import * as knowledgeBaseSdk from "../knowledgeBase"
import { assertAgentHasValidConfig } from "./utils"
import { cleanupKnowledgeForOperation, knowledgeSourceSyncQueue } from "../rag"

// TODO: this will eventually go away, after a grace period
type DeprecatedAgent = Agent & {
  promptInstructions?: string
  operationName?: string
  enabledTools?: string[]
  knowledgeBases?: string[]
  knowledgeSources?: AgentKnowledgeSource[]
  allowKnowledgeSourceDownload?: boolean
}

const SECRET_MASK = "********"
const SECRET_ENCODING_PREFIX = "bbai_enc::"
const NAME_REQUIRED_ERROR = "Agent name is required."
const DEFAULT_OPERATION_NAME = "Operation"

const guardName = async (name: string, id?: string) => {
  if (!name.trim()) {
    throw new HTTPError(NAME_REQUIRED_ERROR, 400)
  }

  const agents = await fetch()
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

const encodeDiscordIntegrationSecrets = (
  discordIntegration?: Agent["discordIntegration"]
) => {
  if (!discordIntegration) {
    return discordIntegration
  }

  return {
    ...discordIntegration,
    publicKey: encodeSecret(discordIntegration.publicKey),
    botToken: encodeSecret(discordIntegration.botToken),
  }
}

const decodeDiscordIntegrationSecrets = (
  discordIntegration?: Agent["discordIntegration"]
) => {
  if (!discordIntegration) {
    return discordIntegration
  }

  return {
    ...discordIntegration,
    publicKey: decodeSecret(discordIntegration.publicKey),
    botToken: decodeSecret(discordIntegration.botToken),
  }
}

const encodeSlackIntegrationSecrets = (
  slackIntegration?: Agent["slackIntegration"]
) => {
  if (!slackIntegration) {
    return slackIntegration
  }

  return {
    ...slackIntegration,
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
    botToken: decodeSecret(slackIntegration.botToken),
    signingSecret: decodeSecret(slackIntegration.signingSecret),
  }
}

const encodeTelegramIntegrationSecrets = (
  telegramIntegration?: Agent["telegramIntegration"]
) => {
  if (!telegramIntegration) {
    return telegramIntegration
  }

  return {
    ...telegramIntegration,
    botToken: encodeSecret(telegramIntegration.botToken),
    webhookSecretToken: encodeSecret(telegramIntegration.webhookSecretToken),
  }
}

const decodeTelegramIntegrationSecrets = (
  telegramIntegration?: Agent["telegramIntegration"]
) => {
  if (!telegramIntegration) {
    return telegramIntegration
  }

  return {
    ...telegramIntegration,
    botToken: decodeSecret(telegramIntegration.botToken),
    webhookSecretToken: decodeSecret(telegramIntegration.webhookSecretToken),
  }
}

const migrateOperations = (raw: DeprecatedAgent): AgentOperation[] => {
  const legacyKnowledgeSources = raw.knowledgeSources
  const legacyAllowKnowledgeSourceDownload = raw.allowKnowledgeSourceDownload

  if (Object.prototype.hasOwnProperty.call(raw, "operations")) {
    return (raw.operations ?? []).map((operation, index) => ({
      ...operation,
      enabledTools: operation.enabledTools || [],
      live: operation.live ?? false,
      knowledgeBases: operation.knowledgeBases || [],
      knowledgeSources: operation.knowledgeSources?.length
        ? operation.knowledgeSources
        : index === 0 && legacyKnowledgeSources?.length
          ? legacyKnowledgeSources
          : operation.knowledgeSources || [],
      allowKnowledgeSourceDownload:
        operation.allowKnowledgeSourceDownload ??
        (index === 0 ? legacyAllowKnowledgeSourceDownload : undefined),
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
        enabledTools: raw.enabledTools || [],
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
  const {
    promptInstructions: _promptInstructions,
    operationName: _operationName,
    enabledTools: _enabledTools,
    knowledgeBases: _knowledgeBases,
    knowledgeSources: _knowledgeSources,
    allowKnowledgeSourceDownload: _allowKnowledgeSourceDownload,
    ...rest
  } = raw
  return {
    ...rest,
    live: raw.live ?? false,
    operations: migrateOperations(raw),
    discordIntegration: decodeDiscordIntegrationSecrets(raw.discordIntegration),
    slackIntegration: decodeSlackIntegrationSecrets(raw.slackIntegration),
    telegramIntegration: decodeTelegramIntegrationSecrets(
      raw.telegramIntegration
    ),
  }
}

const mergeDiscordIntegration = ({
  existing,
  incoming,
}: {
  existing?: Agent["discordIntegration"]
  incoming?: Agent["discordIntegration"]
}) => {
  if (incoming === undefined) {
    return existing
  }
  if (!incoming) {
    return incoming
  }

  const merged = {
    ...(existing || {}),
    ...incoming,
  }

  if (incoming.publicKey === SECRET_MASK && existing?.publicKey) {
    merged.publicKey = existing.publicKey
  }

  if (incoming.botToken === SECRET_MASK && existing?.botToken) {
    merged.botToken = existing.botToken
  }

  return merged
}

const mergeMSTeamsIntegration = ({
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

  const merged = {
    ...(existing || {}),
    ...incoming,
  }

  if (incoming.appPassword === SECRET_MASK && existing?.appPassword) {
    merged.appPassword = existing.appPassword
  }

  return merged
}

const mergeSlackIntegration = ({
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

  const merged = {
    ...(existing || {}),
    ...incoming,
  }

  if (incoming.botToken === SECRET_MASK && existing?.botToken) {
    merged.botToken = existing.botToken
  }

  if (incoming.signingSecret === SECRET_MASK && existing?.signingSecret) {
    merged.signingSecret = existing.signingSecret
  }

  return merged
}

const mergeTelegramIntegration = ({
  existing,
  incoming,
}: {
  existing?: Agent["telegramIntegration"]
  incoming?: Agent["telegramIntegration"]
}) => {
  if (incoming === undefined) {
    return existing
  }
  if (!incoming) {
    return incoming
  }

  const merged = {
    ...(existing || {}),
    ...incoming,
  }

  if (incoming.botToken === SECRET_MASK && existing?.botToken) {
    merged.botToken = existing.botToken
  }

  if (
    incoming.webhookSecretToken === SECRET_MASK &&
    existing?.webhookSecretToken
  ) {
    merged.webhookSecretToken = existing.webhookSecretToken
  }

  return merged
}

export async function fetch(): Promise<Agent[]> {
  const db = context.getWorkspaceDB()
  const result = await db.allDocs<DeprecatedAgent>(
    docIds.getDocParams(DocumentType.AGENT, undefined, {
      include_docs: true,
    })
  )

  return result.rows
    .map(row => row.doc)
    .filter(doc => !!doc)
    .map(withAgentDefaults)
}

export async function getOrThrow(agentId: string | undefined): Promise<Agent> {
  if (!agentId) {
    throw new HTTPError("agentId is required", 400)
  }

  const db = context.getWorkspaceDB()

  const agent = await db.tryGet<DeprecatedAgent>(agentId)
  if (!agent) {
    throw new HTTPError("Agent not found", 404)
  }

  return withAgentDefaults(agent)
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
    operations: request.operations || [],
    live: request.live ?? false,
    publishedAt: request.live ? now : undefined,
    icon: request.icon,
    iconColor: request.iconColor,
    goal: request.goal,
    createdAt: now,
    createdBy: request.createdBy,
    discordIntegration: request.discordIntegration,
    MSTeamsIntegration: request.MSTeamsIntegration,
    slackIntegration: request.slackIntegration,
    telegramIntegration: request.telegramIntegration,
  }

  if (agent.live) {
    await assertAgentHasValidConfig(agent)
  }

  const { rev } = await db.put({
    ...agent,
    discordIntegration: encodeDiscordIntegrationSecrets(
      agent.discordIntegration
    ),
    slackIntegration: encodeSlackIntegrationSecrets(agent.slackIntegration),
    telegramIntegration: encodeTelegramIntegrationSecrets(
      agent.telegramIntegration
    ),
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
  const removedOperations = (existing.operations ?? []).filter(
    existingOperation =>
      existingOperation.id &&
      !(agent.operations ?? []).some(
        incomingOperation => incomingOperation.id === existingOperation.id
      )
  )

  const updated: Agent = {
    ...existing,
    ...agent,
    updatedAt: now,
    operations: (agent.operations ?? []).map(operation => ({
      ...operation,
      enabledTools: operation.enabledTools || [],
      knowledgeBases: operation.knowledgeBases || [],
      knowledgeSources: operation.knowledgeSources || [],
    })),
    discordIntegration: mergeDiscordIntegration({
      existing: existing?.discordIntegration,
      incoming: agent.discordIntegration,
    }),
    MSTeamsIntegration: mergeMSTeamsIntegration({
      existing: existing?.MSTeamsIntegration,
      incoming: agent.MSTeamsIntegration,
    }),
    slackIntegration: mergeSlackIntegration({
      existing: existing?.slackIntegration,
      incoming: agent.slackIntegration,
    }),
    telegramIntegration: mergeTelegramIntegration({
      existing: existing?.telegramIntegration,
      incoming: agent.telegramIntegration,
    }),
  }

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
    discordIntegration: encodeDiscordIntegrationSecrets(
      updated.discordIntegration
    ),
    slackIntegration: encodeSlackIntegrationSecrets(updated.slackIntegration),
    telegramIntegration: encodeTelegramIntegrationSecrets(
      updated.telegramIntegration
    ),
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
