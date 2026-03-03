import { HTTPError } from "@budibase/backend-core"
import type { Agent, ResolvedSlackIntegration } from "@budibase/types"
import * as shared from "./shared"

export const validateSlackIntegration = (
  agent: Agent
): ResolvedSlackIntegration => {
  const integration = agent.slackIntegration
  if (!integration) {
    throw new HTTPError(
      "Slack integration is not configured for this agent",
      400
    )
  }

  const botToken = integration.botToken?.trim()
  const signingSecret = integration.signingSecret?.trim()

  if (!botToken || !signingSecret) {
    throw new HTTPError(
      "Slack integration requires botToken and signingSecret",
      400
    )
  }

  return {
    botToken,
    signingSecret,
    chatAppId: integration.chatAppId?.trim() || undefined,
  }
}

export const resolveChatAppForAgent = async (
  agentId: string,
  chatAppId?: string
) => await shared.resolveProviderChatAppForAgent(agentId, chatAppId)

export const buildSlackWebhookUrl = async (
  chatAppId: string,
  agentId: string
) => await shared.buildProviderWebhookUrl("slack", chatAppId, agentId)
