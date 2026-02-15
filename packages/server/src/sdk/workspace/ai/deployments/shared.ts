import {
  configs,
  context,
  db as dbCore,
  HTTPError,
} from "@budibase/backend-core"
import type { ChatApp } from "@budibase/types"
import * as chatApps from "../chatApps"

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

export const resolveChatAppForAgent = async ({
  agentId,
  chatAppId,
}: {
  agentId: string
  chatAppId?: string
}) => {
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

export const buildWebhookUrl = async ({
  provider,
  chatAppId,
  agentId,
  useProdWorkspaceId = false,
}: {
  provider: "discord" | "teams"
  chatAppId: string
  agentId: string
  useProdWorkspaceId?: boolean
}) => {
  const platformUrl = await configs.getPlatformUrl({ tenantAware: true })
  const workspaceId = context.getWorkspaceId()
  if (!workspaceId) {
    throw new HTTPError("workspaceId is required", 400)
  }
  const targetWorkspaceId = useProdWorkspaceId
    ? dbCore.getProdWorkspaceID(workspaceId)
    : workspaceId
  return `${platformUrl.replace(/\/$/, "")}/api/webhooks/${provider}/${targetWorkspaceId}/${chatAppId}/${agentId}`
}
