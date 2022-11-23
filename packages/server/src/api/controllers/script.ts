import ScriptRunner from "../../utilities/scriptRunner"
import { BBContext } from "@budibase/types"

export async function execute(ctx: BBContext) {
  const { script, context } = ctx.request.body
  const runner = new ScriptRunner(script, context)
  ctx.body = runner.execute()
}

export async function save(ctx: BBContext) {
  ctx.throw(501, "Not currently implemented")
}
