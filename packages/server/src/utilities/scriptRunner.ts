import ivm from "isolated-vm"

import bson from "bson"
import { BundleType, loadBundle } from "../jsRunner/bundles"
import env from "../environment"

const JS_TIMEOUT_MS = 1000

class ScriptRunner {
  vm: IsolatedVM

  constructor(script: string, context: any, { parseBson = false } = {}) {
    this.vm = new IsolatedVM({
      memoryLimit: env.JS_RUNNER_MEMORY_LIMIT,
      parseBson,
    })
    this.vm.context = {
      ...context,
      data: parseBson
        ? bson.BSON.serialize({ data: context.data })
        : context.data,
      results: { out: "" },
    }

    if (parseBson) {
      script = `return JSON.parse(JSON.stringify((function(){data=deserialize(data).data;${script}})()));`
    }

    const code = `const fn=function(){${script}};cb(fn());`
    this.vm.code = code
  }

  execute() {
    const result = this.vm.runScript()
    return result
  }
}

class IsolatedVM {
  #isolate: ivm.Isolate
  #vm: ivm.Context
  #jail: ivm.Reference
  #script: ivm.Module = undefined!
  #bsonModule?: ivm.Module

  constructor({
    memoryLimit,
    parseBson,
  }: {
    memoryLimit: number
    parseBson: boolean
  }) {
    this.#isolate = new ivm.Isolate({ memoryLimit })
    this.#vm = this.#isolate.createContextSync()
    this.#jail = this.#vm.global
    this.#jail.setSync("global", this.#jail.derefInto())

    if (parseBson) {
      const bsonSource = loadBundle(BundleType.BSON)
      this.#bsonModule = this.#isolate.compileModuleSync(bsonSource)
      this.#bsonModule.instantiateSync(this.#vm, specifier => {
        throw new Error(`No imports allowed. Required: ${specifier}`)
      })
    }
  }

  getValue(key: string) {
    const ref = this.#vm.global.getSync(key, { reference: true })
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
    if (this.#bsonModule) {
      code = `import {deserialize} from "compiled_module";${code}`
    }
    this.#script = this.#isolate.compileModuleSync(code)
  }

  runScript() {
    if (this.#bsonModule) {
      this.#script.instantiateSync(this.#vm, specifier => {
        if (specifier === "compiled_module") {
          return this.#bsonModule!
        }

        throw new Error(`"${specifier}" import not allowed`)
      })
    }

    let result
    this.#vm.global.setSync(
      "cb",
      new ivm.Callback((value: any) => {
        result = value
      })
    )

    this.#script.evaluateSync({ timeout: JS_TIMEOUT_MS })

    return result
  }

  copyRefToVm(value: Object): ivm.Copy<Object> {
    return new ivm.ExternalCopy(value).copyInto({ release: true })
  }
}
export default ScriptRunner
