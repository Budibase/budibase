import { HTTPError } from "@budibase/backend-core"
import type { Ctx } from "@budibase/types"
import { rawBodyToRequest, readRawBody, responseToKoa } from "./koaToRequest"
import { ensureProdWorkspaceWebhookRoute } from "./utils"

export const runChatWebhook = async ({
  ctx,
  providerName,
  createWebhookHandler,
}: {
  ctx: Ctx<
    unknown,
    unknown,
    { instance: string; chatAppId: string; agentId: string }
  >
  providerName: string
  createWebhookHandler: (args: {
    workspaceId: string
    chatAppId: string
    agentId: string
  }) => Promise<(request: Request) => Promise<Response>>
}): Promise<void> => {
  const prodWorkspaceId = ensureProdWorkspaceWebhookRoute({
    ctx,
    instance: ctx.params.instance,
    providerName,
  })
  if (!prodWorkspaceId) {
    return
  }

  let handleWebhook: (request: Request) => Promise<Response>
  try {
    handleWebhook = await createWebhookHandler({
      workspaceId: prodWorkspaceId,
      chatAppId: ctx.params.chatAppId,
      agentId: ctx.params.agentId,
    })
  } catch (error) {
    if (error instanceof HTTPError) {
      ctx.status = error.status
      ctx.body = { error: error.message }
      return
    }
    throw error
  }

  const rawBody = await readRawBody(ctx.req)
  const request = rawBodyToRequest(ctx, rawBody)
  const response = await handleWebhook(request)
  await responseToKoa(ctx, response)
}
