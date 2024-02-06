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
      context: {
        ...context,
        data: parseBson
          ? bson.BSON.serialize({ data: context.data })
          : context.data,
      },
    })

    if (parseBson) {
      script = `return JSON.parse(JSON.stringify((function(){data=deserialize(data).data;${script}})()));`
    }

    this.vm.code = script
  }

  execute() {
    this.vm.runScript()
    const result = this.vm.getResult()
    return result
  }
}

class IsolatedVM {
  #isolate: ivm.Isolate
  #vm: ivm.Context
  #jail: ivm.Reference
  #script: ivm.Module = undefined!
  #bsonModule?: ivm.Module

  readonly #resultKey = "results"

  constructor({
    memoryLimit,
    parseBson,
    context,
  }: {
    memoryLimit: number
    parseBson: boolean
    context: Record<string, any>
  }) {
    this.#isolate = new ivm.Isolate({ memoryLimit })
    this.#vm = this.#isolate.createContextSync()
    this.#jail = this.#vm.global
    this.#jail.setSync("global", this.#jail.derefInto())

    this.#addToContext(context)
    this.#addToContext({
      [this.#resultKey]: { out: "" },
    })

    if (parseBson) {
      const bsonSource = loadBundle(BundleType.BSON)
      this.#bsonModule = this.#isolate.compileModuleSync(bsonSource)
      this.#bsonModule.instantiateSync(this.#vm, specifier => {
        throw new Error(`No imports allowed. Required: ${specifier}`)
      })
    }
  }

  getResult() {
    const ref = this.#vm.global.getSync(this.#resultKey, { reference: true })
    const result = ref.copySync()
    ref.release()
    return result.out
  }

  #addToContext(context: Record<string, any>) {
    for (let key in context) {
      this.#jail.setSync(key, this.#copyRefToVm(context[key]))
    }
  }

  set code(code: string) {
    code = `const fn=function(){${code}};results.out=fn();`
    if (this.#bsonModule) {
      code = `import {deserialize} from "compiled_module";${code}`
    }
    this.#script = this.#isolate.compileModuleSync(code)
  }

  runScript(): void {
    if (this.#bsonModule) {
      this.#script.instantiateSync(this.#vm, specifier => {
        if (specifier === "compiled_module") {
          return this.#bsonModule!
        }

        throw new Error(`"${specifier}" import not allowed`)
      })
    }

    this.#script.evaluateSync({ timeout: JS_TIMEOUT_MS })
  }

  #copyRefToVm(value: Object): ivm.Copy<Object> {
    return new ivm.ExternalCopy(value).copyInto({ release: true })
  }
}
export default ScriptRunner
