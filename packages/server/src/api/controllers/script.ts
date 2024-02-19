import { Ctx } from "@budibase/types"
import { IsolatedVM } from "../../jsRunner/vm"

export async function execute(ctx: Ctx) {
  const { script, context } = ctx.request.body
  const runner = new IsolatedVM().withContext(context)

  const result = runner.execute(`(function(){\n${script}\n})();`)
  ctx.body = result
}

export async function save(ctx: Ctx) {
  ctx.throw(501, "Not currently implemented")
}
