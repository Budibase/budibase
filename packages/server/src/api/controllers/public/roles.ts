import { UserCtx } from "@budibase/types"
import { Next } from "koa"

async function assign(ctx: UserCtx, next: Next) {
  ctx.body = { message: "roles assigned" }
}

async function unAssign(ctx: UserCtx, next: Next) {
  ctx.body = { message: "roles un-assigned" }
}

export default {
  assign,
  unAssign,
}
