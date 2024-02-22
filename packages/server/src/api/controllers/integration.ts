import { getDefinition, getDefinitions } from "../../integrations"
import { SourceName, UserCtx } from "@budibase/types"

export async function fetch(ctx: UserCtx) {
  const definitions = await getDefinitions()
  delete definitions.AIRTABLE
  ctx.body = definitions
}

export async function find(ctx: UserCtx) {
  const sourceType = ctx.params?.type
  if (sourceType === SourceName.AIRTABLE) {
    ctx.throw(400, `Invalid source type - ${sourceType} is not supported.`)
  }
  ctx.body = await getDefinition(ctx.params.type)
}
