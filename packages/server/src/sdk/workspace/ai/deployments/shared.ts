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
  [AgentChannelProvider.MSTEAMS]: "ms-teams",
  [AgentChannelProvider.SLACK]: "slack",
}

const ensureAgentOnChatApp = async (chatApp: ChatApp, agentId: string) => {
  const existingAgents = chatApp.agents || []
  if (existingAgents.includes(agentId)) {
    return chatApp
  }

  return await chatApps.update({
    ...chatApp,
    agents: [...existingAgents, agentId],
  })
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
    return await ensureAgentOnChatApp(app, agentId)
  }

  const existing = await chatApps.getSingle()
  if (existing) {
    return await ensureAgentOnChatApp(existing, agentId)
  }

  return await chatApps.create({ agents: [agentId] })
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
