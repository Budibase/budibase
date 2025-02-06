import { Ctx } from "@budibase/types"
import { doInIPContext } from "../context"

export default async (ctx: Ctx, next: any) => {
  if (ctx.ip) {
    return await doInIPContext(ctx.ip, () => {
      return next()
    })
  } else {
    return next()
  }
}
