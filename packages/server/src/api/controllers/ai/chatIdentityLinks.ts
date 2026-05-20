import { context, HTTPError, utils } from "@budibase/backend-core"
import { WebClient } from "@slack/web-api"
import type { ChatIdentityLinkProvider, UserCtx } from "@budibase/types"
import { getGlobalIDFromUserMetadataID } from "../../../db/utils"
import sdk from "../../../sdk"

const CHAT_LINK_RETURN_URL_COOKIE = "budibase:returnurl"
const BUILDER_LOGIN_PATH = "/builder/auth/login"

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

const renderLinkSuccessPage = () => {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Authentication succeeded</title>
  </head>
  <body>
    <p>Authentication succeeded.</p>
    <script>
      if (window.opener && !window.opener.closed) {
        try {
          window.opener.focus()
          window.close()
        } catch (error) {}
      }
    </script>
  </body>
</html>`
}

export async function handoffChatLinkSession(
  ctx: UserCtx<void, string, { instance: string; token: string }>
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
    utils.setCookie(
      ctx,
      `/api/chat-links/${ctx.params.instance}/${token}/handoff`,
      CHAT_LINK_RETURN_URL_COOKIE,
      { sign: false }
    )
    ctx.redirect(BUILDER_LOGIN_PATH)
    return
  }

  const currentGlobalUserId = getCurrentGlobalUserId(ctx)
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
    globalUserId: currentGlobalUserId,
    linkedBy: currentGlobalUserId,
  })

  ctx.type = "text/html"
  ctx.body = renderLinkSuccessPage()
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
