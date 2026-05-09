import {
  configs,
  context,
  db as dbCore,
  HTTPError,
} from "@budibase/backend-core"
import type { ChatApp } from "@budibase/types"
import { AgentChannelProvider } from "@budibase/types"
import * as chatApps from "../chatApps"

/** Webhook URL path segment (ms-teams uses hyphen, provider value uses msteams) */
export const WEBHOOK_PATH_BY_PROVIDER: Record<AgentChannelProvider, string> = {
  [AgentChannelProvider.DISCORD]: "discord",
  [AgentChannelProvider.MSTEAMS]: "ms-teams",
  [AgentChannelProvider.SLACK]: "slack",
}

const normalizeDefaultAgent = (agents: NonNullable<ChatApp["agents"]>) => {
  const defaultAgentId =
    agents.find(agent => agent.isEnabled && agent.isDefault)?.agentId ||
    agents.find(agent => agent.isEnabled)?.agentId

  return agents.map(agent => ({
    ...agent,
    isDefault: !!defaultAgentId && agent.agentId === defaultAgentId,
  }))
}

const ensureAgentOnChatApp = async (
  chatApp: ChatApp,
  agentId: string,
  isEnabled?: boolean
) => {
  const existingAgents = chatApp.agents || []
  const existing = existingAgents.find(agent => agent.agentId === agentId)
  if (existing) {
    if (isEnabled === undefined || existing.isEnabled === isEnabled) {
      return chatApp
    }

    const updatedAgents = normalizeDefaultAgent(
      existingAgents.map(agent =>
        agent.agentId === agentId
          ? {
              ...agent,
              isEnabled,
              isDefault: isEnabled ? agent.isDefault : false,
            }
          : agent
      )
    )

    return await chatApps.update({ ...chatApp, agents: updatedAgents })
  }

  const updatedAgents = normalizeDefaultAgent([
    ...existingAgents,
    { agentId, isEnabled: isEnabled === true, isDefault: false },
  ])

  return await chatApps.update({ ...chatApp, agents: updatedAgents })
}

export const disableAgentOnChatApp = async ({
  chatAppId,
  agentId,
}: {
  chatAppId: string
  agentId: string
}) => {
  const chatApp = await chatApps.getOrThrow(chatAppId)
  const existingAgents = chatApp.agents || []
  const existing = existingAgents.find(agent => agent.agentId === agentId)
  if (!existing || !existing.isEnabled) {
    return chatApp
  }

  const updatedAgents = existingAgents.map(agent =>
    agent.agentId === agentId ? { ...agent, isEnabled: false } : agent
  )

  return await chatApps.update({ ...chatApp, agents: updatedAgents })
}

export const resolveChatAppForAgent = async ({
  agentId,
  chatAppId,
  isEnabled,
}: {
  agentId: string
  chatAppId?: string
  isEnabled?: boolean
}) => {
  if (chatAppId) {
    const app = await chatApps.getOrThrow(chatAppId)
    return await ensureAgentOnChatApp(app, agentId, isEnabled)
  }

  const existing = await chatApps.getSingle()
  if (existing) {
    return await ensureAgentOnChatApp(existing, agentId, isEnabled)
  }

  return await chatApps.create({
    agents: normalizeDefaultAgent([
      { agentId, isEnabled: isEnabled === true, isDefault: false },
    ]),
  })
}

export const resolveProviderChatAppForAgent = async (
  agentId: string,
  chatAppId?: string
) =>
  await resolveChatAppForAgent({
    agentId,
    chatAppId,
  })

export const buildWebhookUrl = async ({
  provider,
  chatAppId,
  agentId,
  useProdWorkspaceId = false,
}: {
  provider: AgentChannelProvider
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
  const pathSegment = WEBHOOK_PATH_BY_PROVIDER[provider]
  return `${platformUrl.replace(/\/$/, "")}/api/webhooks/${pathSegment}/${targetWorkspaceId}/${chatAppId}/${agentId}`
}

export const buildProviderWebhookUrl = async (
  provider: AgentChannelProvider,
  chatAppId: string,
  agentId: string
) =>
  await buildWebhookUrl({
    provider,
    chatAppId,
    agentId,
    useProdWorkspaceId: true,
  })
