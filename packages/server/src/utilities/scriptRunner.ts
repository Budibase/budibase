import ivm from "isolated-vm"

import bson from "bson"

const JS_TIMEOUT_MS = 1000

class ScriptRunner {
  vm: IsolatedVM

  constructor(script: string, context: any) {
    this.vm = new IsolatedVM({ memoryLimit: 64 })
    this.vm.context = {
      ...context,
      data: bson.BSON.serialize({ data: context.data }),
      results: { out: "" },
    }

    const code = `let fn = () => {data=deserialize(data).data;\n${script}\n}; cb(JSON.parse(JSON.stringify(fn())));`
    this.vm.code = code
  }

  execute() {
    const result = this.vm.runScript()
    return result
  }
}

class IsolatedVM {
  isolate: ivm.Isolate
  vm: ivm.Context
  #jail: ivm.Reference
  script: ivm.Module = undefined!
  #bsonModule: ivm.Module = undefined!

  constructor({ memoryLimit }: { memoryLimit: number }) {
    this.isolate = new ivm.Isolate({ memoryLimit })
    this.vm = this.isolate.createContextSync()
    this.#jail = this.vm.global
    this.#jail.setSync("global", this.#jail.derefInto())
  }

  getValue(key: string) {
    const ref = this.vm.global.getSync(key, { reference: true })
    const result = ref.copySync()
    ref.release()
    return result
  }

  set context(context: Record<string, any>) {
    for (let key in context) {
      this.#jail.setSync(key, this.copyRefToVm(context[key]))
    }
  }

  set code(code: string) {
    const bsonSource = require("../jsRunner/bundles/bson.ivm.bundle.js")

    this.#bsonModule = this.isolate.compileModuleSync(bsonSource)
    this.#bsonModule.instantiateSync(this.vm, specifier => {
      throw new Error(`No imports allowed. Required: ${specifier}`)
    })

    this.script = this.isolate.compileModuleSync(
      `import {deserialize} from "compiled_module";${code}`
    )
  }

  runScript() {
    this.script.instantiateSync(this.vm, specifier => {
      if (specifier === "compiled_module") {
        return this.#bsonModule
      }

      throw new Error(`"${specifier}" import not allowed`)
    })

    let result
    this.vm.global.setSync(
      "cb",
      new ivm.Callback((value: any) => {
        result = value
      })
    )

    this.script.evaluateSync({ timeout: JS_TIMEOUT_MS })

    return result
  }

  copyRefToVm(value: Object): ivm.Copy<Object> {
    return new ivm.ExternalCopy(value).copyInto({ release: true })
  }
}
export default ScriptRunner
