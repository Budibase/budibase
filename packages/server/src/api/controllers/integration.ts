import { getDefinitions } from "../../integrations"
import { BBContext } from "@budibase/types"

export async function fetch(ctx: BBContext) {
  ctx.status = 200
  ctx.body = await getDefinitions()
}

export async function find(ctx: BBContext) {
  const defs = await getDefinitions()
  ctx.status = 200
  ctx.body = defs[ctx.params.type]
}
