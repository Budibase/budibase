import { HTTPError } from "@budibase/backend-core"
import {
  AgentChannelProvider,
  type Agent,
  type ResolvedMSTeamsIntegration,
} from "@budibase/types"
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
  const tenantId = integration.tenantId?.trim()

  if (!appId || !appPassword || !tenantId) {
    throw new HTTPError(
      "Teams integration requires appId (client ID) and appPassword (client secret value)",
      400
    )
  }

  return {
    appId,
    appPassword,
    tenantId,
  }
}

export const buildMSTeamsWebhookUrl = async (agentId: string) =>
  await shared.buildProviderWebhookUrl(AgentChannelProvider.MSTEAMS, agentId)
