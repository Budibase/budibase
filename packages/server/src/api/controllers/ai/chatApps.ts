import { HTTPError } from "@budibase/backend-core"
import { ChatApp, UpdateChatAppRequest, UserCtx } from "@budibase/types"
import sdk from "../../../sdk"

export async function fetchChatApp(
  ctx: UserCtx<void, ChatApp | null, { agentId?: string }>
) {
  const chatApp = await sdk.ai.chatApps.getSingle()
  if (chatApp) {
    ctx.body = chatApp
    return
  }

  const agentId = Array.isArray(ctx.query.agentId)
    ? ctx.query.agentId[0]
    : ctx.query.agentId
  const fallbackAgentId = agentId || (await sdk.ai.agents.fetch())[0]?._id
  if (!fallbackAgentId) {
    throw new HTTPError("agentId is required to create a chat app", 400)
  }

  const created = await sdk.ai.chatApps.create({
    agentIds: [fallbackAgentId],
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

  if (!resolvedChatApp.agentIds?.length) {
    throw new HTTPError("agentIds is required", 400)
  }
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
