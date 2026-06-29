import { context } from "@budibase/backend-core"
import { UserCtx } from "@budibase/types"
import { escalationProcessor } from "../../escalation/processor"
import sdk from "../../sdk"

export async function fetch(ctx: UserCtx) {
  const appId = context.getWorkspaceId()
  if (!appId) {
    ctx.body = []
    return
  }
  ctx.body = await escalationProcessor.list(appId)
}

export async function fetchContextDocs(ctx: UserCtx) {
  ctx.body = await sdk.escalations.listContextDocs()
}

export async function findContextDoc(ctx: UserCtx) {
  const { id } = ctx.params
  const doc = await sdk.escalations.getContextDoc(id)
  if (!doc) {
    ctx.throw(404, `Escalation context doc not found: ${id}`)
  }
  ctx.body = doc
}

export async function result(ctx: UserCtx) {
  const { id } = ctx.params
  const result = await sdk.escalations.getResult(id)
  if (!result) {
    ctx.throw(404, `Escalation not found: ${id}`)
  }
  ctx.body = result
}

export async function resolve(ctx: UserCtx) {
  const { id } = ctx.params
  const doc = await sdk.escalations.getContextDoc(id)
  const status = doc && doc.resolution !== "pending" ? "closed" : "recorded"
  await escalationProcessor.resolve(id, ctx.request.body?.response)
  ctx.body = {
    status,
    message:
      status === "closed" ? "Escalation already closed." : "Response recorded.",
  }
}

export async function cancel(ctx: UserCtx) {
  const { id } = ctx.params
  await escalationProcessor.cancel(id)
  ctx.body = { message: "Escalation cancelled" }
}

export async function fetchNotifications(ctx: UserCtx) {
  const { id } = ctx.params
  ctx.body = await sdk.escalations.listNotifications(id)
}

export async function respond(ctx: UserCtx) {
  const { id, notificationId } = ctx.params
  const { response } = ctx.request.body
  const result = await sdk.escalations.respond(
    id,
    notificationId,
    response,
    (escalationId, res) => escalationProcessor.resolve(escalationId, res)
  )
  ctx.body = result
}
