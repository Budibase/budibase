import fetch from "node-fetch"
import { tenancy } from "@budibase/backend-core"
import {
  AgentChannelProvider,
  type ChatConversationChannel,
  DocumentType,
  type EscalationContextDoc,
  type EscalationNotificationDoc,
  EscalationNotificationChannel,
  SEPARATOR,
} from "@budibase/types"
import sdk from "../../sdk"
import { findIntegrationAgent, getEscalationText } from "./utils"

const DISCORD_API_BASE = "https://discord.com/api/v10"

const NOTIF_DOC_PREFIX = `${DocumentType.ESCALATION_NOTIFICATION}${SEPARATOR}`

// custom_id is max 100 chars — strip the doc-type prefix and use short action codes
// handler reconstructs the full notifDocId as NOTIF_DOC_PREFIX + parts[1]
const buildEscalationComponents = ({
  notifDocId,
  appId,
}: {
  notifDocId: string
  appId: string
}) => {
  const shortId = notifDocId.startsWith(NOTIF_DOC_PREFIX)
    ? notifDocId.slice(NOTIF_DOC_PREFIX.length)
    : notifDocId
  return [
    {
      type: 1,
      components: [
        {
          type: 2,
          style: 3,
          label: "Approve",
          custom_id: `esc_a:${shortId}:${appId}`,
        },
        {
          type: 2,
          style: 4,
          label: "Reject",
          custom_id: `esc_r:${shortId}:${appId}`,
        },
      ],
    },
  ]
}

const getDiscordBotToken = async (
  appId: string,
  agentId?: string
): Promise<string | undefined> => {
  const agent = await findIntegrationAgent(
    appId,
    agentId,
    a => !!a.discordIntegration?.botToken
  )
  return agent?.discordIntegration?.botToken?.trim() || undefined
}

const discordPost = async <T = void>(
  path: string,
  botToken: string,
  body: object
): Promise<T> => {
  const resp = await fetch(`${DISCORD_API_BASE}${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bot ${botToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  })
  if (!resp.ok) {
    throw new Error(`Discord API ${resp.status}: ${await resp.text()}`)
  }
  return resp.json()
}

export async function sendDiscordNotification({
  notifDoc,
  contextDoc,
}: {
  notifDoc: EscalationNotificationDoc
  contextDoc: EscalationContextDoc
}): Promise<void> {
  if (notifDoc.recipient.type !== EscalationNotificationChannel.DISCORD) {
    return
  }

  const config = notifDoc.recipient.config as Record<string, string>
  const botToken = await getDiscordBotToken(contextDoc.appId, contextDoc.agentId)
  if (!botToken) {
    console.warn("sendDiscordNotification: no Discord-enabled agent found", {
      escalationId: contextDoc._id,
      appId: contextDoc.appId,
    })
    return
  }

  const { title, summary } = getEscalationText(contextDoc)
  const messageBody = {
    content: summary ? `**${title}**\n${summary}` : `**${title}**`,
    components: buildEscalationComponents({
      notifDocId: notifDoc._id!,
      appId: contextDoc.appId,
    }),
  }

  if (config.channelId) {
    await discordPost(`/channels/${config.channelId}/messages`, botToken, messageBody)
    console.log("sendDiscordNotification: message sent to channel", {
      escalationId: notifDoc.escalationId,
      channelId: config.channelId,
    })
    return
  }

  let externalUserId = config.externalUserId
  if (!externalUserId && config.globalUserId) {
    const link = await tenancy.doInTenant(contextDoc.tenantId, () =>
      sdk.ai.chatIdentityLinks.getChatIdentityLinkByGlobalUserId({
        globalUserId: config.globalUserId,
        provider: AgentChannelProvider.DISCORD,
      })
    )
    if (!link) {
      console.warn("sendDiscordNotification: no Discord identity link for user", {
        globalUserId: config.globalUserId,
        escalationId: contextDoc._id,
      })
      return
    }
    externalUserId = link.externalUserId
  }

  if (!externalUserId) {
    console.warn(
      "sendDiscordNotification: no channelId or userId in recipient config",
      { escalationId: contextDoc._id }
    )
    return
  }

  const dmChannel = await discordPost<{ id: string }>(
    "/users/@me/channels",
    botToken,
    { recipient_id: externalUserId }
  )
  await discordPost(`/channels/${dmChannel.id}/messages`, botToken, messageBody)

  console.log("sendDiscordNotification: message sent to user", {
    escalationId: notifDoc.escalationId,
    externalUserId,
  })
}

// Replies to the requester in their originating conversation on escalation
// resume - @mention in a guild channel, plain text in a DM.
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
  if (!channel.channelId) {
    console.warn("replyToConversation: no channelId", { appId })
    return
  }
  const botToken = await getDiscordBotToken(appId, agentId)
  if (!botToken) {
    console.warn("replyToConversation: no Discord-enabled agent", { appId })
    return
  }

  // Mention the requester in a guild channel; DMs (no guild) get plain text.
  const mention =
    channel.guildId && channel.externalUserId
      ? `<@${channel.externalUserId}> `
      : ""
  // Discord enforces a 2000-character message limit.
  const content = `${mention}${text}`.slice(0, 2000)

  await discordPost(`/channels/${channel.channelId}/messages`, botToken, {
    content,
  })
}
