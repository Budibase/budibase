import { HTTPError } from "@budibase/backend-core"
import {
  AgentChannelProvider,
  type Agent,
  type ResolvedTelegramIntegration,
} from "@budibase/types"
import * as shared from "./shared"

export const validateTelegramIntegration = (
  agent: Agent
): ResolvedTelegramIntegration => {
  const integration = agent.telegramIntegration
  if (!integration) {
    throw new HTTPError(
      "Telegram integration is not configured for this agent",
      400
    )
  }

  const botToken = integration.botToken?.trim()
  if (!botToken) {
    throw new HTTPError("Telegram integration requires botToken", 400)
  }

  const webhookSecretToken = integration.webhookSecretToken?.trim()
  const botUserName = integration.botUserName?.trim()

  return {
    botToken,
    ...(webhookSecretToken ? { webhookSecretToken } : {}),
    ...(botUserName ? { botUserName } : {}),
    chatAppId: integration.chatAppId?.trim() || undefined,
  }
}

export const resolveChatAppForAgent = async (
  agentId: string,
  chatAppId?: string
) => await shared.resolveProviderChatAppForAgent(agentId, chatAppId)

export const buildTelegramWebhookUrl = async (
  chatAppId: string,
  agentId: string
) =>
  await shared.buildProviderWebhookUrl(
    AgentChannelProvider.TELEGRAM,
    chatAppId,
    agentId
  )

export const setTelegramWebhook = async ({
  botToken,
  webhookUrl,
  secretToken,
}: {
  botToken: string
  webhookUrl: string
  secretToken?: string
}) => {
  const body: Record<string, string> = { url: webhookUrl }
  if (secretToken) {
    body.secret_token = secretToken
  }

  const response = await fetch(
    `https://api.telegram.org/bot${botToken}/setWebhook`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }
  )

  if (!response.ok) {
    const text = await response.text()
    throw new HTTPError(
      `Telegram setWebhook failed (${response.status}): ${text || response.statusText}`,
      400
    )
  }

  const data = await response.json()
  if (!data.ok) {
    throw new HTTPError(
      `Telegram setWebhook failed: ${data.description || "Unknown error"}`,
      400
    )
  }
}
