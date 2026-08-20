import { HTTPError } from "@budibase/backend-core"
import { ChatApp, UserCtx } from "@budibase/types"
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
