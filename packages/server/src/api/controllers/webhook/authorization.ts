import { context, HTTPError, roles } from "@budibase/backend-core"
import type {
  Agent,
  ChannelIdentityProvider,
  ChatConversationChannel,
  ContextUser,
  DiscordAgentIntegration,
  MSTeamsAgentIntegration,
} from "@budibase/types"
import { getGlobalUser } from "../../../utilities/global"
import sdk from "../../../sdk"

type WebhookProvider = ChannelIdentityProvider

interface ResolveWebhookAuthorizationArgs {
  workspaceId: string
  chatAppId: string
  agentId: string
  provider: WebhookProvider
  externalUserId: string
  externalUserName?: string
  channel: ChatConversationChannel
}

export interface ResolvedWebhookAuthorization {
  chatUserId: string
  contextUser: ContextUser
}

const normalizeStringArray = (values?: string[] | null) =>
  (values || []).map(value => value?.trim()).filter(Boolean) as string[]

const assertAllowlistedValue = ({
  label,
  allowedValues,
  actualValue,
}: {
  label: string
  allowedValues?: string[] | null
  actualValue?: string
}) => {
  const resolvedAllowlist = normalizeStringArray(allowedValues)
  if (resolvedAllowlist.length === 0) {
    return
  }
  if (!actualValue || !resolvedAllowlist.includes(actualValue)) {
    throw new HTTPError(`${label} is not allowed for this agent channel`, 403)
  }
}

const assertMappedUserAccess = (mappedUser: ContextUser) => {
  const status = mappedUser.status
  if (status && status !== "active") {
    throw new HTTPError("Mapped Budibase user is not active", 403)
  }

  if (
    !mappedUser.roleId ||
    mappedUser.roleId === roles.BUILTIN_ROLE_IDS.PUBLIC
  ) {
    throw new HTTPError(
      "Mapped Budibase user does not have access to this workspace",
      403
    )
  }
}

const resolveMappedUser = async ({
  provider,
  externalUserId,
  externalUserName,
  channel,
}: {
  provider: WebhookProvider
  externalUserId: string
  externalUserName?: string
  channel: ChatConversationChannel
}): Promise<ResolvedWebhookAuthorization> => {
  const mappedIdentity = await sdk.ai.channelIdentities.getByProviderExternalId(
    {
      provider,
      externalUserId,
      tenantId: provider === "msteams" ? channel.tenantId : undefined,
    }
  )

  if (!mappedIdentity || mappedIdentity.isActive === false) {
    throw new HTTPError(
      "This channel user is not linked to a Budibase user",
      403
    )
  }

  const globalUserId = mappedIdentity.globalUserId?.trim()
  if (!globalUserId) {
    throw new HTTPError("Channel identity mapping is invalid", 403)
  }

  const mappedUser = await getGlobalUser(globalUserId)
  if (!mappedUser?._id) {
    throw new HTTPError("Mapped Budibase user could not be resolved", 403)
  }

  assertMappedUserAccess(mappedUser)

  const resolvedMappedUser: ContextUser = {
    ...mappedUser,
    firstName:
      mappedUser.firstName || externalUserName || mappedIdentity.displayName,
  }

  return {
    chatUserId: resolvedMappedUser._id!,
    contextUser: resolvedMappedUser,
  }
}

const assertConfiguredChatApp = ({
  integrationChatAppId,
  chatAppId,
}: {
  integrationChatAppId?: string
  chatAppId: string
}) => {
  const resolvedIntegrationChatAppId = integrationChatAppId?.trim()
  if (
    resolvedIntegrationChatAppId &&
    resolvedIntegrationChatAppId !== chatAppId
  ) {
    throw new HTTPError(
      "Webhook chat app does not match the configured channel deployment",
      403
    )
  }
}

const assertDiscordChannelAllowed = ({
  integration,
  channel,
}: {
  integration: DiscordAgentIntegration
  channel: ChatConversationChannel
}) => {
  assertAllowlistedValue({
    label: "Discord guild",
    allowedValues: integration.allowedGuildIds,
    actualValue: channel.guildId?.trim(),
  })
  assertAllowlistedValue({
    label: "Discord channel",
    allowedValues: integration.allowedChannelIds,
    actualValue: channel.channelId?.trim(),
  })
}

const assertTeamsChannelAllowed = ({
  integration,
  channel,
}: {
  integration: MSTeamsAgentIntegration
  channel: ChatConversationChannel
}) => {
  assertAllowlistedValue({
    label: "Teams tenant",
    allowedValues: integration.allowedTenantIds,
    actualValue: channel.tenantId?.trim(),
  })
  assertAllowlistedValue({
    label: "Teams team",
    allowedValues: integration.allowedTeamIds,
    actualValue: channel.teamId?.trim(),
  })
  assertAllowlistedValue({
    label: "Teams channel",
    allowedValues: integration.allowedChannelIds,
    actualValue: channel.channelId?.trim(),
  })
}

const resolveAuthorizationFromAgent = async ({
  provider,
  agent,
  chatAppId,
  externalUserId,
  externalUserName,
  channel,
}: {
  provider: WebhookProvider
  agent: Agent
  chatAppId: string
  externalUserId: string
  externalUserName?: string
  channel: ChatConversationChannel
}): Promise<ResolvedWebhookAuthorization> => {
  const integration =
    provider === "discord" ? agent.discordIntegration : agent.MSTeamsIntegration
  if (!integration) {
    throw new HTTPError(
      `${provider} integration is not configured for this agent`,
      400
    )
  }
  assertConfiguredChatApp({
    integrationChatAppId: integration.chatAppId,
    chatAppId,
  })

  if (provider === "discord") {
    assertDiscordChannelAllowed({ integration, channel })
  } else {
    assertTeamsChannelAllowed({ integration, channel })
  }
  return await resolveMappedUser({
    provider,
    externalUserId,
    externalUserName,
    channel,
  })
}

export const resolveWebhookAuthorization = async ({
  workspaceId,
  chatAppId,
  agentId,
  provider,
  externalUserId,
  externalUserName,
  channel,
}: ResolveWebhookAuthorizationArgs): Promise<ResolvedWebhookAuthorization> =>
  await context.doInWorkspaceContext(workspaceId, async () => {
    const agent = await sdk.ai.agents.getOrThrow(agentId)
    return await resolveAuthorizationFromAgent({
      provider,
      agent,
      chatAppId,
      externalUserId,
      externalUserName,
      channel,
    })
  })
