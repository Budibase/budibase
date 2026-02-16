import { HTTPError } from "@budibase/backend-core"
import {
  ChatApp,
  ChatAppAgent,
  FetchChatAppAgentsResponse,
  UpdateChatAppRequest,
  UserCtx,
} from "@budibase/types"
import sdk from "../../../sdk"

export async function fetchChatApp(ctx: UserCtx<void, ChatApp | null>) {
  const chatApp = await sdk.ai.chatApps.getSingle()
  if (chatApp) {
    ctx.body = chatApp
    return
  }

  const created = await sdk.ai.chatApps.create({
    agents: [],
  })
  ctx.body = created
}

export async function updateChatApp(
  ctx: UserCtx<UpdateChatAppRequest, ChatApp>
) {
  const chatAppIdFromPath = ctx.params?.chatAppId
  const chatApp = ctx.request.body as ChatApp
  const resolvedChatApp: ChatApp = chatAppIdFromPath
    ? { ...chatApp, _id: chatApp._id || chatAppIdFromPath }
    : chatApp

  const updated = await sdk.ai.chatApps.update(resolvedChatApp)
  ctx.body = updated
}

export async function fetchChatAppById(
  ctx: UserCtx<void, ChatApp, { chatAppId: string }>
) {
  const chatAppId = ctx.params?.chatAppId
  if (!chatAppId) {
    throw new HTTPError("chatAppId is required", 400)
  }

  const chatApp = await sdk.ai.chatApps.getOrThrow(chatAppId)
  ctx.body = chatApp
}

export async function fetchChatAppAgents(
  ctx: UserCtx<void, FetchChatAppAgentsResponse, { chatAppId: string }>
) {
  const chatAppId = ctx.params?.chatAppId
  if (!chatAppId) {
    throw new HTTPError("chatAppId is required", 400)
  }

  const chatApp = await sdk.ai.chatApps.getOrThrow(chatAppId)
  const configuredAgentIds = new Set(
    (chatApp.agents || [])
      .filter(agent => agent.isEnabled === true)
      .map(agent => agent.agentId)
  )

  if (configuredAgentIds.size === 0) {
    ctx.body = { agents: [] }
    return
  }

  const workspaceAgents = await sdk.ai.agents.fetch()
  const agents: FetchChatAppAgentsResponse["agents"] = workspaceAgents
    .filter(agent => agent._id && configuredAgentIds.has(agent._id))
    .map(agent => ({
      _id: agent._id,
      name: agent.name,
      icon: agent.icon,
      iconColor: agent.iconColor,
      live: agent.live,
    }))

  ctx.body = { agents }
}

export async function setChatAppAgent(
  ctx: UserCtx<{ agentId: string }, ChatAppAgent, { chatAppId: string }>
) {
  const chatAppId = ctx.params?.chatAppId
  const { agentId } = ctx.request.body || {}
  if (!chatAppId) {
    throw new HTTPError("chatAppId is required", 400)
  }
  if (!agentId) {
    throw new HTTPError("agentId is required", 400)
  }

  const chatApp = await sdk.ai.chatApps.getOrThrow(chatAppId)
  await sdk.ai.agents.getOrThrow(agentId)

  const existingAgents = chatApp.agents || []
  const matched = existingAgents.find(agent => agent.agentId === agentId)
  const nextAgent: ChatAppAgent = matched
    ? { ...matched, isEnabled: true }
    : {
        agentId,
        isEnabled: true,
        isDefault: false,
      }

  const agents = matched
    ? existingAgents.map(agent =>
        agent.agentId === agentId ? nextAgent : agent
      )
    : [...existingAgents, nextAgent]

  await sdk.ai.chatApps.update({
    ...chatApp,
    agents,
  })

  ctx.body = nextAgent
}
