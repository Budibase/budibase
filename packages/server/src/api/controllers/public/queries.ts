import { search as stringSearch } from "./utils"
import { default as queryController } from "../query"

export async function search(ctx: any) {
  await queryController.fetch(ctx)
  const { name } = ctx.request.body
  ctx.body = {
    queries: stringSearch(ctx.body, name),
  }
}

export async function execute(ctx: any) {
  await queryController.executeV2(ctx)
}

export default {
  search,
  execute,
}
