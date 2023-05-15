import { getDefinition, getDefinitions } from "../../integrations"
import { BBContext } from "@budibase/types"

export async function fetch(ctx: BBContext) {
  ctx.status = 200
  ctx.body = await getDefinitions()
}

export async function find(ctx: BBContext) {
  const def = await getDefinition(ctx.params.type)
  ctx.body = def
  ctx.status = 200
}
