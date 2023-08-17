import { Ctx, Row } from "@budibase/types"

export default async (ctx: Ctx<Row>, next: any) => {
  if (ctx.request.body._viewId) {
    return ctx.throw(400, "Table row endpoints cannot contain view info")
  }

  return next()
}
