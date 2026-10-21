import { context, HTTPError } from "@budibase/backend-core"
import {
  EscalationAction,
  EscalationRespondResult,
  RespondToEscalationRequest,
  UserCtx,
} from "@budibase/types"
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
  console.log("Escalation resolve: forced via resolve route", {
    escalationId: id,
    userId: ctx.user?._id,
    accepted: ctx.request.body?.response?.accepted,
  })
  const status = await sdk.escalations.withEscalationLock(id, async () => {
    const doc = await sdk.escalations.getContextDoc(id)
    if (!doc) {
      ctx.throw(404, `Escalation not found: ${id}`)
    }
    if (doc.resolution !== "pending") {
      return "closed"
    }
    await escalationProcessor.resolve(id, ctx.request.body?.response)
    return "recorded"
  })
  ctx.body = {
    status,
    message:
      status === "closed" ? "Escalation already closed." : "Response recorded.",
  }
}

export async function cancel(ctx: UserCtx) {
  const { id } = ctx.params
  await sdk.escalations.withEscalationLock(id, () =>
    escalationProcessor.cancel(id)
  )
  ctx.body = { message: "Escalation cancelled" }
}

export async function fetchNotifications(ctx: UserCtx) {
  const { id } = ctx.params
  ctx.body = await sdk.escalations.listNotifications(id)
}

export async function respond(
  ctx: UserCtx<
    RespondToEscalationRequest,
    EscalationRespondResult,
    { id: string }
  >
) {
  const { id } = ctx.params
  const globalUserId = ctx.user?.globalId
  const doc = globalUserId ? await sdk.escalations.getContextDoc(id) : undefined
  if (!globalUserId || !doc?.policy?.approvers?.includes(globalUserId)) {
    throw new HTTPError("Escalation not found", 404)
  }
  const { actionId, note } = ctx.request.body
  if (
    actionId !== EscalationAction.APPROVE &&
    actionId !== EscalationAction.REJECT
  ) {
    throw new HTTPError("Invalid actionId", 400)
  }
  ctx.body = await sdk.escalations.respond(
    id,
    undefined,
    {
      userId: globalUserId,
      actionId,
      ...(typeof note === "string" && note.trim() ? { note: note.trim() } : {}),
    },
    (escalationId, res) => escalationProcessor.resolve(escalationId, res)
  )
}
