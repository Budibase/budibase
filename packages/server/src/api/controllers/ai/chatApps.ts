import { HTTPError } from "@budibase/backend-core"
import { ChatApp, FetchChatAppAgentsResponse, UserCtx } from "@budibase/types"
import sdk from "../../../sdk"

export async function fetchChatApp(ctx: UserCtx<void, ChatApp | null>) {
  const chatApp = await sdk.ai.chatApps.getSingle()
  ctx.body = chatApp || (await sdk.ai.chatApps.create({ agents: [] }))
}

export async function fetchChatAppById(
  ctx: UserCtx<void, ChatApp, { chatAppId: string }>
) {
  const chatAppId = ctx.params?.chatAppId
  if (!chatAppId) {
    throw new HTTPError("chatAppId is required", 400)
  }

  ctx.body = await sdk.ai.chatApps.getOrThrow(chatAppId)
}

export async function fetchChatAppAgents(
  ctx: UserCtx<void, FetchChatAppAgentsResponse, { chatAppId: string }>
) {
  const chatAppId = ctx.params?.chatAppId
  if (!chatAppId) {
    throw new HTTPError("chatAppId is required", 400)
  }

  await sdk.ai.chatApps.getOrThrow(chatAppId)

  const workspaceAgents = await sdk.ai.agents.fetch()
  ctx.body = {
    agents: workspaceAgents
      .filter(agent => agent.live)
      .map(agent => ({
        _id: agent._id,
        name: agent.name,
        icon: agent.icon,
        iconColor: agent.iconColor,
        live: agent.live,
      })),
  }
}
