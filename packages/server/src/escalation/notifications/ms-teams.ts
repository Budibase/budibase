import fetch from "node-fetch"
import { cache, tenancy } from "@budibase/backend-core"
import {
  AgentChannelProvider,
  type ChatConversationChannel,
  type EscalationContextDoc,
  type EscalationNotificationDoc,
  EscalationAction,
  EscalationNotificationChannel,
} from "@budibase/types"
import sdk from "../../sdk"
import { findIntegrationAgent, getEscalationText } from "./utils"

export const MS_SCOPE_BOT = "https://api.botframework.com/.default"
export const MS_SCOPE_GRAPH = "https://graph.microsoft.com/.default"

// Commercial Teams service URL — region-specific installs can override via TEAMS_API_URL
const DEFAULT_SERVICE_URL =
  process.env.TEAMS_API_URL ?? "https://smba.trafficmanager.net/apis/"

export const getMSTeamsIntegration = async (
  appId: string,
  agentId?: string
): Promise<
  { msClientId: string; appPassword: string; msTenantId: string } | undefined
> => {
  const agent = await findIntegrationAgent(
    appId,
    agentId,
    a => !!(a.MSTeamsIntegration?.appId && a.MSTeamsIntegration?.appPassword)
  )
  if (
    !agent?.MSTeamsIntegration?.appId ||
    !agent.MSTeamsIntegration.appPassword
  ) {
    return undefined
  }
  return {
    msClientId: agent.MSTeamsIntegration.appId.trim(),
    appPassword: agent.MSTeamsIntegration.appPassword.trim(),
    msTenantId: (agent.MSTeamsIntegration.tenantId ?? "").trim(),
  }
}

// This gives off Datasource vibes.
// Like sharepoint.
// Should we surface/migrate the config?
export const getOAuthToken = async (
  msClientId: string,
  appPassword: string,
  msTenantId: string,
  scope: string
): Promise<string> => {
  return cache.withCacheWithDynamicTTL(
    cache.CacheKey.OAUTH2_TOKEN(`teams_${msClientId}_${scope}`),
    async () => {
      const resp = await fetch(
        `https://login.microsoftonline.com/${msTenantId}/oauth2/v2.0/token`,
        {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            grant_type: "client_credentials",
            client_id: msClientId,
            client_secret: appPassword,
            scope,
          }).toString(),
        }
      )
      if (!resp.ok) {
        throw new Error(
          `Teams OAuth token request failed (${resp.status}): ${await resp.text()}`
        )
      }
      const data = (await resp.json()) as {
        access_token: string
        expires_in?: number
      }
      return { value: data.access_token, ttl: data.expires_in ?? 3600 }
    }
  )
}

const GRAPH_BASE = "https://graph.microsoft.com/v1.0"

const graphGet = async <T>(url: string, token: string): Promise<T> => {
  const resp = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!resp.ok) {
    throw new Error(`Teams Graph API ${resp.status}: ${await resp.text()}`)
  }
  return (await resp.json()) as T
}

// Lists channels across every team the app can see, using a Graph token (a
// separate scope from the bot credentials). Requires Team.ReadBasic.All and
// Channel.ReadBasic.All application permissions consented in Azure.
export const listTeamsChannels = async (
  graphToken: string
): Promise<
  { id: string; name: string; teamId: string; teamName: string }[]
> => {
  const { value: teams } = await graphGet<{
    value: { id: string; displayName: string }[]
  }>(`${GRAPH_BASE}/teams?$select=id,displayName&$top=100`, graphToken)

  const channelsByTeam = await Promise.all(
    teams.map(async team => {
      const { value: channels } = await graphGet<{
        value: { id: string; displayName: string }[]
      }>(
        `${GRAPH_BASE}/teams/${team.id}/channels?$select=id,displayName`,
        graphToken
      )
      return channels.map(channel => ({
        id: channel.id,
        name: channel.displayName,
        teamId: team.id,
        teamName: team.displayName,
      }))
    })
  )

  return channelsByTeam.flat()
}

const buildAdaptiveCard = ({
  title,
  summary,
  escalationId,
  notificationDocId,
  appId,
}: {
  title: string
  summary?: string
  escalationId: string
  notificationDocId: string
  appId: string
}) => {
  const value = JSON.stringify({ escalationId, notificationDocId, appId })
  return {
    $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
    type: "AdaptiveCard",
    version: "1.2",
    body: [
      {
        type: "TextBlock",
        text: title,
        weight: "Bolder",
        wrap: true,
      },
      ...(summary ? [{ type: "TextBlock", text: summary, wrap: true }] : []),
    ],
    actions: [
      {
        type: "Action.Submit",
        title: "Approve",
        style: "positive",
        data: { actionId: EscalationAction.APPROVE, value },
      },
      {
        type: "Action.Submit",
        title: "Reject",
        style: "destructive",
        data: { actionId: EscalationAction.REJECT, value },
      },
    ],
  }
}

const teamsPost = async <T = void>(
  serviceUrl: string,
  token: string,
  conversationId: string,
  body: object
): Promise<T> => {
  const url = `${serviceUrl.replace(/\/$/, "")}/v3/conversations/${encodeURIComponent(conversationId)}/activities`
  const resp = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  })
  if (!resp.ok) {
    throw new Error(`Teams Bot API ${resp.status}: ${await resp.text()}`)
  }
  return resp.json()
}

// Replies to the requester in their originating conversation on escalation
// resume - DM as plain text, channel with an @mention so it's attributed.
export async function replyToConversation({
  appId,
  agentId,
  channel,
  text,
}: {
  appId: string
  agentId?: string
  channel: ChatConversationChannel
  text: string
}): Promise<void> {
  if (!channel.conversationId) {
    console.warn("replyToConversation: no conversationId", { appId })
    return
  }

  const integration = await getMSTeamsIntegration(appId, agentId)
  if (!integration) {
    console.warn("replyToConversation: no Teams-enabled agent", {
      appId,
    })
    return
  }

  const token = await getOAuthToken(
    integration.msClientId,
    integration.appPassword,
    integration.msTenantId,
    MS_SCOPE_BOT
  )
  const serviceUrl = channel.serviceUrl || DEFAULT_SERVICE_URL

  const isChannel =
    !!channel.channelId && channel.conversationType !== "personal"

  let message: Record<string, unknown>
  if (isChannel && channel.externalUserId) {
    const name = channel.externalUserName?.trim() || "there"
    message = {
      type: "message",
      text: `<at>${name}</at> ${text}`,
      entities: [
        {
          type: "mention",
          text: `<at>${name}</at>`,
          mentioned: { id: channel.externalUserId, name },
        },
      ],
    }
  } else {
    message = { type: "message", text }
  }

  await teamsPost(serviceUrl, token, channel.conversationId, message)
}

export async function sendMSTeamsNotification({
  notifDoc,
  contextDoc,
}: {
  notifDoc: EscalationNotificationDoc
  contextDoc: EscalationContextDoc
}): Promise<void> {
  if (notifDoc.recipient.type !== EscalationNotificationChannel.MSTEAMS) {
    return
  }

  const config = notifDoc.recipient.config as Record<string, string>

  const integration = await getMSTeamsIntegration(
    contextDoc.appId,
    contextDoc.agentId
  )
  if (!integration) {
    console.warn("sendMSTeamsNotification: no Teams-enabled agent found", {
      escalationId: contextDoc._id,
      appId: contextDoc.appId,
    })
    return
  }

  const token = await getOAuthToken(
    integration.msClientId,
    integration.appPassword,
    integration.msTenantId,
    MS_SCOPE_BOT
  )

  const { title, summary } = getEscalationText(contextDoc)
  const card = buildAdaptiveCard({
    title,
    summary,
    escalationId: notifDoc.escalationId,
    notificationDocId: notifDoc._id!,
    appId: contextDoc.appId,
  })

  const message = {
    type: "message",
    attachments: [
      {
        contentType: "application/vnd.microsoft.card.adaptive",
        content: card,
      },
    ],
  }

  if (config.channelId && config.teamId) {
    await teamsPost(DEFAULT_SERVICE_URL, token, config.channelId, message)
    console.log("sendMSTeamsNotification: message sent to channel", {
      escalationId: notifDoc.escalationId,
      channelId: config.channelId,
    })
    return
  }

  // User DM — always resolve via identity link to get the Teams-specific externalUserId
  let externalUserId: string | undefined
  let providerTenantId: string | undefined = config.providerTenantId
  let linkServiceUrl: string | undefined

  if (config.globalUserId) {
    const tenantScope = providerTenantId || integration.msTenantId
    // Fail closed. Must discern scope in order to discern intended recipient
    if (!tenantScope) {
      console.warn(
        "sendMSTeamsNotification: could not resolve Teams tenant, skipping",
        {
          escalationId: contextDoc._id,
          globalUserId: config.globalUserId,
        }
      )
      return
    }
    const link = await tenancy.doInTenant(contextDoc.tenantId, () =>
      sdk.ai.chatIdentityLinks.getChatIdentityLinkByGlobalUserId({
        globalUserId: config.globalUserId,
        provider: AgentChannelProvider.MSTEAMS,
        providerTenantId: tenantScope,
      })
    )
    if (!link) {
      console.warn("sendMSTeamsNotification: no Teams identity link for user", {
        globalUserId: config.globalUserId,
        escalationId: contextDoc._id,
      })
      return
    }
    externalUserId = link.externalUserId
    providerTenantId = providerTenantId || link.providerTenantId
    linkServiceUrl = link.serviceUrl
  }

  if (!externalUserId) {
    console.warn("sendMSTeamsNotification: no recipient target in config", {
      escalationId: contextDoc._id,
    })
    return
  }

  const dmServiceUrl = linkServiceUrl || DEFAULT_SERVICE_URL
  const msTenantId = providerTenantId || integration.msTenantId
  const createBody = {
    channelId: "msteams",
    tenantId: msTenantId,
    bot: { id: integration.msClientId, name: "Budibase" },
    isGroup: false,
    members: [{ id: externalUserId }],
    channelData: { tenant: { id: msTenantId } },
  }
  console.log("sendMSTeamsNotification: creating conversation", {
    escalationId: contextDoc._id,
    externalUserId,
  })
  const createResp = await fetch(
    `${dmServiceUrl.replace(/\/$/, "")}/v3/conversations`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(createBody),
    }
  )
  if (!createResp.ok) {
    throw new Error(
      `Teams create conversation failed (${createResp.status}): ${await createResp.text()}`
    )
  }
  const conversation = (await createResp.json()) as {
    id: string
    serviceUrl?: string
  }
  const postServiceUrl = conversation.serviceUrl || DEFAULT_SERVICE_URL
  console.log("sendMSTeamsNotification: conversation created", {
    conversationId: conversation.id,
    serviceUrl: conversation.serviceUrl,
    postServiceUrl,
  })

  await teamsPost(postServiceUrl, token, conversation.id, message)
  console.log("sendMSTeamsNotification: message sent to user", {
    escalationId: notifDoc.escalationId,
    externalUserId,
  })
}
