import { getDefinition, getDefinitions } from "../../integrations"
import { BBContext } from "@budibase/types"

export async function fetch(ctx: BBContext) {
  try {
    const definitions = await getDefinitions()
    delete definitions.AIRTABLE
    ctx.status = 200
    ctx.body = definitions
  } catch (error) {
    console.error('Error fetching definitions:', error)
    ctx.status = 500
    ctx.body = { error: 'Internal server error' }
  }
}

export async function find(ctx: BBContext) {
  const def = await getDefinition(ctx.params.type)
  ctx.body = def
  ctx.status = 200
}
