import { configs, context, HTTPError } from "@budibase/backend-core"
import type { Agent, ChatApp, ResolvedTeamsIntegration } from "@budibase/types"
import * as chatApps from "../chatApps"

export const validateTeamsIntegration = (
  agent: Agent
): ResolvedTeamsIntegration => {
  const integration = agent.teamsIntegration
  if (!integration) {
    throw new HTTPError("Teams integration is not configured for this agent", 400)
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

const enableAgentOnChatApp = async (chatApp: ChatApp, agentId: string) => {
  const existingAgents = chatApp.agents || []
  const existing = existingAgents.find(agent => agent.agentId === agentId)
  if (existing?.isEnabled) {
    return chatApp
  }

  const updatedAgents = existing
    ? existingAgents.map(agent =>
        agent.agentId === agentId ? { ...agent, isEnabled: true } : agent
      )
    : [...existingAgents, { agentId, isEnabled: true, isDefault: false }]

  return await chatApps.update({ ...chatApp, agents: updatedAgents })
}

export const resolveChatAppForAgent = async (
  agentId: string,
  chatAppId?: string
) => {
  if (chatAppId) {
    const app = await chatApps.getOrThrow(chatAppId)
    return await enableAgentOnChatApp(app, agentId)
  }

  const existing = await chatApps.getSingle()
  if (existing) {
    return await enableAgentOnChatApp(existing, agentId)
  }

  return await chatApps.create({
    agents: [{ agentId, isEnabled: true, isDefault: false }],
  })
}

export const buildTeamsWebhookUrl = async (chatAppId: string, agentId: string) => {
  const platformUrl = await configs.getPlatformUrl({ tenantAware: true })
  const workspaceId = context.getWorkspaceId()
  if (!workspaceId) {
    throw new HTTPError("workspaceId is required", 400)
  }
  return `${platformUrl.replace(/\/$/, "")}/api/webhooks/teams/${workspaceId}/${chatAppId}/${agentId}`
}
