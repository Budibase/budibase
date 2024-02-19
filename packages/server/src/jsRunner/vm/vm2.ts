import vm2 from "vm2"
import { VM } from "@budibase/types"

const JS_TIMEOUT_MS = 1000

export class VM2 implements VM {
  vm: vm2.VM
  results: { out: string }

  constructor(context: any) {
    this.vm = new vm2.VM({
      timeout: JS_TIMEOUT_MS,
    })
    this.results = { out: "" }
    this.vm.setGlobals(context)
    this.vm.setGlobal("fetch", fetch)
    this.vm.setGlobal("results", this.results)
  }

  execute(script: string) {
    const code = `let fn = () => {\n${script}\n}; results.out = fn();`
    const vmScript = new vm2.VMScript(code)
    this.vm.run(vmScript)
    return this.results.out
  }
}
