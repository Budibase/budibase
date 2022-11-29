import { migrate as migrationImpl, MIGRATIONS } from "../../migrations"
import { BBContext } from "@budibase/types"

export async function migrate(ctx: BBContext) {
  const options = ctx.request.body
  // don't await as can take a while, just return
  migrationImpl(options)
  ctx.status = 200
}

export async function fetchDefinitions(ctx: BBContext) {
  ctx.body = MIGRATIONS
  ctx.status = 200
}
