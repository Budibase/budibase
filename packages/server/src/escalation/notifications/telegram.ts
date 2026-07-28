import fetch from "node-fetch"
import { tenancy } from "@budibase/backend-core"
import {
  AgentChannelProvider,
  type ChatConversationChannel,
  DocumentType,
  type EscalationContextDoc,
  type EscalationNotificationDoc,
  EscalationAction,
  EscalationNotificationChannel,
  SEPARATOR,
} from "@budibase/types"
import sdk from "../../sdk"
import { findIntegrationAgent, getEscalationText } from "./utils"

const TELEGRAM_API_BASE = "https://api.telegram.org"
// Must match the prefix used by @chat-adapter/telegram to encode callback_data
const CALLBACK_DATA_PREFIX = "chat:"
const NOTIF_DOC_PREFIX = `${DocumentType.ESCALATION_NOTIFICATION}${SEPARATOR}`

// Produces callback_data that @chat-adapter/telegram's decodeTelegramCallbackData will parse
// into { actionId, value } — keeping bytes under the 64-byte Telegram limit.
const buildCallbackData = (actionId: string, value: string) =>
  `${CALLBACK_DATA_PREFIX}${JSON.stringify({ a: actionId, v: value })}`

const buildEscalationKeyboard = (shortId: string) => ({
  inline_keyboard: [
    [
      {
        text: "Approve",
        callback_data: buildCallbackData(EscalationAction.APPROVE, shortId),
      },
      {
        text: "Reject",
        callback_data: buildCallbackData(EscalationAction.REJECT, shortId),
      },
    ],
  ],
})

const getTelegramBotToken = async (
  appId: string,
  agentId?: string
): Promise<string | undefined> => {
  const agent = await findIntegrationAgent(
    appId,
    agentId,
    a => !!a.telegramIntegration?.botToken
  )
  return agent?.telegramIntegration?.botToken?.trim() || undefined
}

const telegramPost = async <T = void>(
  botToken: string,
  method: string,
  body: object
): Promise<T> => {
  const resp = await fetch(`${TELEGRAM_API_BASE}/bot${botToken}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
  if (!resp.ok) {
    throw new Error(`Telegram API ${resp.status}: ${await resp.text()}`)
  }
  return resp.json()
}

export async function sendTelegramNotification({
  notifDoc,
  contextDoc,
}: {
  notifDoc: EscalationNotificationDoc
  contextDoc: EscalationContextDoc
}): Promise<void> {
  if (notifDoc.recipient.type !== EscalationNotificationChannel.TELEGRAM) {
    return
  }

  const config = notifDoc.recipient.config as Record<string, string>
  const botToken = await getTelegramBotToken(
    contextDoc.appId,
    contextDoc.agentId
  )
  if (!botToken) {
    console.warn("sendTelegramNotification: no Telegram-enabled agent found", {
      escalationId: contextDoc._id,
      appId: contextDoc.appId,
    })
    return
  }

  const shortId = notifDoc._id!.startsWith(NOTIF_DOC_PREFIX)
    ? notifDoc._id!.slice(NOTIF_DOC_PREFIX.length)
    : notifDoc._id!

  const keyboard = buildEscalationKeyboard(shortId)

  let chatId = config.channelId || config.externalUserId
  if (!chatId && config.globalUserId) {
    const link = await tenancy.doInTenant(contextDoc.tenantId, () =>
      sdk.ai.chatIdentityLinks.getChatIdentityLinkByGlobalUserId({
        globalUserId: config.globalUserId,
        provider: AgentChannelProvider.TELEGRAM,
      })
    )
    if (!link) {
      console.warn(
        "sendTelegramNotification: no Telegram identity link for user",
        { globalUserId: config.globalUserId, escalationId: contextDoc._id }
      )
      return
    }
    chatId = link.externalUserId
  }

  if (!chatId) {
    console.warn("sendTelegramNotification: no chatId for recipient", {
      escalationId: contextDoc._id,
    })
    return
  }

  const { title, summary } = getEscalationText(contextDoc)
  await telegramPost(botToken, "sendMessage", {
    chat_id: chatId,
    text: summary ? `${title}\n${summary}` : title,
    reply_markup: keyboard,
  })

  console.log("sendTelegramNotification: message sent", {
    escalationId: notifDoc.escalationId,
    chatId,
  })
}

// Replies to the requester in their originating conversation on escalation
// resume. Telegram has no clean id-based mention, so it's plain text to the chat.
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
  const botToken = await getTelegramBotToken(appId, agentId)
  if (!botToken) {
    console.warn("replyToConversation: no Telegram-enabled agent", { appId })
    return
  }

  // Telegram enforces a 4096-character message limit.
  await telegramPost(botToken, "sendMessage", {
    chat_id: channel.channelId,
    text: text.slice(0, 4096),
  })
}
