import env from "../environment"
import { Ctx } from "@budibase/types"

// if added as a middleware will stop requests unless builder is in self host mode
// or cloud is in self host
export default async (ctx: Ctx, next: any) => {
  if (env.SELF_HOSTED) {
    await next()
    return
  }
  ctx.throw(400, "Endpoint unavailable in cloud hosting.")
}
