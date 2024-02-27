import { Ctx } from "@budibase/types"
import { IsolatedVM } from "../../jsRunner/vm"
import { iifeWrapper } from "../../jsRunner/utilities"

export async function execute(ctx: Ctx) {
  const { script, context } = ctx.request.body
  const vm = new IsolatedVM()
  ctx.body = vm.withContext(context, () => vm.execute(iifeWrapper(script)))
}

export async function save(ctx: Ctx) {
  ctx.throw(501, "Not currently implemented")
}
