import { getDefinition, getDefinitions } from "../../integrations"
import { BBContext } from "@budibase/types"

async function fetchDefinitions(ctx: BBContext) {
  try {
    const definitions = await getDefinitions()
    delete definitions.AIRTABLE
    ctx.status = 200
    ctx.body = definitions

    return definitions
  } catch (error) {
    console.error("Error fetching definitions:", error)
    ctx.status = 500
    ctx.body = { error: "Internal server error" }

    return {}
  }
}

export async function fetch(ctx: BBContext) {
  await fetchDefinitions(ctx)
}

export async function find(ctx: BBContext) {
  const def = await getDefinition(ctx.params.type)
  if (ctx.params.type in (await fetchDefinitions(ctx))) {
    ctx.body = def
    ctx.status = 200
  } else {
    ctx.status = 400
    ctx.body = {
      message: `Cannot find definition '${ctx.params.type}'`,
      status: 400,
    }
  }
}
