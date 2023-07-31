import { Ctx, Row } from "@budibase/types"

const checkNoViewData = async (ctx: Ctx<Row>) => {
  if (ctx.request.body._viewId) {
    ctx.throw(400, "Table row endpoints cannot contain view info")
  }
}

export default () => async (ctx: any, next: any) => {
  await checkNoViewData(ctx)
  return next()
}
