import { context, HTTPError } from "@budibase/backend-core"
import { WebClient } from "@slack/web-api"
import {
  AgentChannelProvider,
  type ChatIdentityLinkProvider,
  type ChatIdentityLinkSessionView,
  type UserCtx,
} from "@budibase/types"
import { getGlobalIDFromUserMetadataID } from "../../../db/utils"
import sdk from "../../../sdk"
import {
  getMSTeamsIntegration,
  getOAuthToken,
  listTeamsChannels,
  MS_SCOPE_GRAPH,
} from "../../../escalation/notifications/ms-teams"

const resolveToken = (token?: string) => {
  if (!token) {
    throw new HTTPError("token is required", 400)
  }
  return token
}

const assertSessionMatchesInstance = ({
  workspaceId,
  instance,
}: {
  workspaceId?: string
  instance: string
}) => {
  if (!workspaceId || workspaceId !== instance) {
    throw new HTTPError("Link token is not valid for this workspace", 400)
  }
}

const getCurrentGlobalUserId = (ctx: UserCtx) => {
  const currentUserId =
    ctx.user?.globalId ||
    getGlobalIDFromUserMetadataID(ctx.user?._id || "") ||
    ctx.user?._id
  if (!currentUserId) {
    throw new HTTPError("Unable to resolve current user", 400)
  }
  return currentUserId
}

const providerDisplayName = (provider: ChatIdentityLinkProvider) => {
  if (provider === AgentChannelProvider.DISCORD) {
    return "Discord"
  }
  if (provider === AgentChannelProvider.MSTEAMS) {
    return "Teams"
  }
  if (provider === AgentChannelProvider.TELEGRAM) {
    return "Telegram"
  }
  if (provider === AgentChannelProvider.SLACK) {
    return "Slack"
  }

  throw provider satisfies never
}

export async function getChatLinkSessionView(
  ctx: UserCtx<
    void,
    ChatIdentityLinkSessionView,
    { instance: string; token: string }
  >
) {
  const token = resolveToken(ctx.params.token)
  const session =
    await sdk.ai.chatIdentityLinks.getChatIdentityLinkSession(token)
  if (!session) {
    throw new HTTPError("Link token is invalid or has expired", 400)
  }
  assertSessionMatchesInstance({
    workspaceId: session.workspaceId,
    instance: ctx.params.instance,
  })

  if (!ctx.isAuthenticated) {
    throw new HTTPError(
      "Authentication is required to view chat identity link",
      401
    )
  }

  const currentGlobalUserId = getCurrentGlobalUserId(ctx)
  const preparedSession =
    await sdk.ai.chatIdentityLinks.prepareChatIdentityLinkSessionConfirmation(
      token,
      currentGlobalUserId
    )
  if (!preparedSession) {
    throw new HTTPError("Link token is invalid or has expired", 400)
  }

  const existingLink = await sdk.ai.chatIdentityLinks.getChatIdentityLink({
    provider: preparedSession.provider,
    externalUserId: preparedSession.externalUserId,
    teamId: preparedSession.teamId,
    providerTenantId: preparedSession.providerTenantId,
  })

  ctx.body = {
    provider: preparedSession.provider,
    providerLabel: providerDisplayName(preparedSession.provider),
    externalUserId: preparedSession.externalUserId,
    externalUserName: preparedSession.externalUserName,
    workspaceId: preparedSession.workspaceId,
    alreadyLinked: !!existingLink,
  }
}

export async function confirmChatLinkSession(
  ctx: UserCtx<void, { success: boolean }, { instance: string; token: string }>
) {
  const token = resolveToken(ctx.params.token)
  const session =
    await sdk.ai.chatIdentityLinks.getChatIdentityLinkSession(token)
  if (!session) {
    throw new HTTPError("Link token is invalid or has expired", 400)
  }
  assertSessionMatchesInstance({
    workspaceId: session.workspaceId,
    instance: ctx.params.instance,
  })

  if (!ctx.isAuthenticated) {
    throw new HTTPError("Authentication is required to link chat identity", 401)
  }

  const currentGlobalUserId = getCurrentGlobalUserId(ctx)
  if (
    !session.confirmationToken ||
    !session.confirmationGlobalUserId ||
    session.confirmationGlobalUserId !== currentGlobalUserId
  ) {
    throw new HTTPError("Link confirmation is invalid or has expired", 400)
  }

  const consumedSession =
    await sdk.ai.chatIdentityLinks.consumeChatIdentityLinkSession(token)
  if (!consumedSession) {
    throw new HTTPError("Link token is invalid or has expired", 400)
  }
  assertSessionMatchesInstance({
    workspaceId: consumedSession.workspaceId,
    instance: ctx.params.instance,
  })

  await sdk.ai.chatIdentityLinks.upsertChatIdentityLink({
    provider: consumedSession.provider,
    externalUserId: consumedSession.externalUserId,
    externalUserName: consumedSession.externalUserName,
    teamId: consumedSession.teamId,
    guildId: consumedSession.guildId,
    providerTenantId: consumedSession.providerTenantId,
    serviceUrl: consumedSession.serviceUrl,
    globalUserId: currentGlobalUserId,
    linkedBy: currentGlobalUserId,
  })

  ctx.body = {
    success: true,
  }
}

export async function listChatIdentityLinks(ctx: UserCtx) {
  const provider = ctx.query.provider as ChatIdentityLinkProvider | undefined
  ctx.body = await sdk.ai.chatIdentityLinks.listChatIdentityLinks(provider)
}

export async function listSlackChannels(ctx: UserCtx) {
  const appId = ctx.appId
  if (!appId) {
    ctx.throw(400, "appId is required")
  }

  const agentId = ctx.query.agentId as string | undefined
  if (!agentId) {
    ctx.throw(400, "agentId is required")
  }

  const botToken = await context.doInWorkspaceContext(appId, async () => {
    const agents = await sdk.ai.agents.fetch()
    const agent = agents.find(
      a => a._id === agentId && a.slackIntegration?.botToken
    )
    if (!agent?.slackIntegration?.botToken) {
      return undefined
    }
    return sdk.ai.deployments.slack.validateSlackIntegration(agent).botToken
  })

  if (!botToken) {
    ctx.body = []
    return
  }

  const client = new WebClient(botToken)
  const result = await client.conversations.list({
    types: "public_channel,private_channel,mpim",
    exclude_archived: true,
    limit: 200,
  })

  const all = result.channels ?? []

  ctx.body = all
    .filter(c => c.is_member)
    .map(c => ({
      id: c.id,
      name: c.is_mpim
        ? `Group DM: ${c.purpose?.value?.replace("Group messaging with: ", "") ?? c.name}`
        : c.name,
    }))
}

export async function listMSTeamsChannels(ctx: UserCtx) {
  const appId = ctx.appId
  if (!appId) {
    ctx.throw(400, "appId is required")
  }

  const agentId = ctx.query.agentId as string | undefined
  if (!agentId) {
    ctx.throw(400, "agentId is required")
  }

  const integration = await getMSTeamsIntegration(appId, agentId)
  if (!integration) {
    ctx.body = []
    return
  }

  const graphToken = await getOAuthToken(
    integration.msClientId,
    integration.appPassword,
    integration.msTenantId,
    MS_SCOPE_GRAPH
  )

  ctx.body = await listTeamsChannels(graphToken)
}
