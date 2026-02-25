import { HTTPError } from "@budibase/backend-core"
import type { Agent, ResolvedMSTeamsIntegration } from "@budibase/types"
import * as shared from "./shared"

export const validateMSTeamsIntegration = (
  agent: Agent
): ResolvedMSTeamsIntegration => {
  const integration = agent.MSTeamsIntegration
  if (!integration) {
    throw new HTTPError(
      "Teams integration is not configured for this agent",
      400
    )
  }

  const appId = integration.appId?.trim()
  const appPassword = integration.appPassword?.trim()

  if (!appId || !appPassword) {
    throw new HTTPError(
      "Teams integration requires appId (client ID) and appPassword (client secret value)",
      400
    )
  }

  return {
    appId,
    appPassword,
    tenantId: integration.tenantId?.trim() || undefined,
    chatAppId: integration.chatAppId?.trim() || undefined,
  }
}

export const resolveChatAppForAgent = async (
  agentId: string,
  chatAppId?: string
) =>
  await shared.resolveChatAppForAgent({
    agentId,
    chatAppId,
  })

export const buildMSTeamsWebhookUrl = async (
  chatAppId: string,
  agentId: string
) =>
  await shared.buildWebhookUrl({
    provider: "ms-teams",
    chatAppId,
    agentId,
    useProdWorkspaceId: true,
  })
