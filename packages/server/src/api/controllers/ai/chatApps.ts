import { HTTPError } from "@budibase/backend-core"
import { ChatApp, UpdateChatAppRequest, UserCtx } from "@budibase/types"
import sdk from "../../../sdk"

export async function fetchChatApp(ctx: UserCtx<void, ChatApp | null>) {
  const chatApp = await sdk.ai.chatApps.getSingle()
  if (chatApp) {
    ctx.body = chatApp
    return
  }

  const fallbackAgentId = (await sdk.ai.agents.fetch())[0]?._id
  const enabledAgents = fallbackAgentId ? [{ agentId: fallbackAgentId }] : []

  const created = await sdk.ai.chatApps.create({
    enabledAgents,
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

export async function setChatAppAgent(
  ctx: UserCtx<{ agentId: string }, ChatApp, { chatAppId: string }>
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

  const existingAgents = chatApp.enabledAgents || []
  const matched = existingAgents.some(agent => agent.agentId === agentId)
  const enabledAgents = matched
    ? existingAgents
    : [...existingAgents, { agentId }]

  const updated = await sdk.ai.chatApps.update({
    ...chatApp,
    enabledAgents,
  })
  ctx.body = updated
}
