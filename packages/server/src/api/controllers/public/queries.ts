import { search as stringSearch } from "./utils"
import * as queryController from "../query"

export async function search(ctx: any, next: any) {
  await queryController.fetch(ctx)
  const { name } = ctx.request.body
  ctx.body = stringSearch(ctx.body, name)
  await next()
}

export async function execute(ctx: any, next: any) {
  // don't wrap this, already returns "data"
  await queryController.executeV2(ctx)
  await next()
}

export default {
  search,
  execute,
}
