import ScriptRunner from "../../utilities/scriptRunner"
import { Ctx } from "@budibase/types"

export async function execute(ctx: Ctx) {
  const { script, context } = ctx.request.body
  const runner = new ScriptRunner(script, context)
  ctx.body = runner.execute()
}

export async function save(ctx: Ctx) {
  ctx.throw(501, "Not currently implemented")
}
