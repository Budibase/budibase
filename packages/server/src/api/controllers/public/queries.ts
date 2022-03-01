import { search as stringSearch, wrapResponse } from "./utils"
import { default as queryController } from "../query"

export async function search(ctx: any) {
  await queryController.fetch(ctx)
  const { name } = ctx.request.body
  ctx.body = stringSearch(ctx.body, name)
  wrapResponse(ctx)
}

export async function execute(ctx: any) {
  await queryController.executeV2(ctx)
  wrapResponse(ctx)
}

export default {
  search,
  execute,
}
