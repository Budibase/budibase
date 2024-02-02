import { Ctx } from "@budibase/types"
import { context } from "@budibase/backend-core"

export default async (ctx: Ctx, next: any) => {
  const resp = await next()

  const current = context.getCurrentContext()
  if (current?.cleanup) {
    for (let fn of current.cleanup || []) {
      await fn()
    }
    delete current.cleanup
  }

  return resp
}
