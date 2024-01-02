import ivm, { Context, Script } from "isolated-vm"

const JS_TIMEOUT_MS = 1000

class ScriptRunner {
  vm: IsolatedVM

  constructor(script: string, context: any) {
    const code = `let fn = () => {\n${script}\n}; results.out = fn();`
    this.vm = new IsolatedVM({ memoryLimit: 8 })
    this.vm.context = {
      data: context.data,
      params: context.params,
      results: { out: "" },
    }
    this.vm.code = code
  }

  execute() {
    this.vm.runScript()
    const results = this.vm.getValue("results")
    return results.out
  }
}

class IsolatedVM {
  isolate: ivm.Isolate
  vm: ivm.Context
  jail: ivm.Reference
  script: any

  constructor({ memoryLimit }: { memoryLimit: number }) {
    this.isolate = new ivm.Isolate({ memoryLimit })
    this.vm = this.isolate.createContextSync()
    this.jail = this.vm.global
    this.jail.setSync("global", this.jail.derefInto())
  }

  getValue(key: string) {
    const ref = this.vm.global.getSync(key, { reference: true })
    const result = ref.copySync()
    ref.release()
    return result
  }

  set context(context: Record<string, any>) {
    for (let key in context) {
      this.jail.setSync(key, this.copyRefToVm(context[key]))
    }
  }

  set code(code: string) {
    this.script = this.isolate.compileScriptSync(code)
  }

  runScript() {
    this.script.runSync(this.vm, { timeout: JS_TIMEOUT_MS })
  }

  copyRefToVm(value: Object): ivm.Copy<Object> {
    return new ivm.ExternalCopy(value).copyInto({ release: true })
  }
}
export default ScriptRunner
