import { Ctx } from "@budibase/types"
import { IsolatedVM, PyodideVM } from "../../jsRunner/vm"
import { iifeWrapper, UserScriptError } from "@budibase/string-templates"

export async function execute(ctx: Ctx) {
  const { script, context } = ctx.request.body
  const vm = new IsolatedVM()
  try {
    ctx.body = vm.withContext(context, () => vm.execute(iifeWrapper(script)))
  } catch (err: any) {
    if (err.code === UserScriptError.code) {
      throw err.userScriptError
    }
    throw err
  }
}

export async function executePython(ctx: Ctx) {
  const { script, context } = ctx.request.body
  const vm = new PyodideVM()

  try {
    await vm.initialize()
    ctx.body = vm.withContext(context, () => vm.execute(script))
    console.log("Python execution result:", ctx.body)
  } catch (err: any) {
    if (err.code === UserScriptError.code) {
      throw err.userScriptError
    }
    throw err
  } finally {
    vm.close()
  }
}
