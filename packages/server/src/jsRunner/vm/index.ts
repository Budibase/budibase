import ivm from "isolated-vm"

import url from "url"
import crypto from "crypto"
import querystring from "querystring"

import { BundleType, loadBundle } from "../bundles"
import { VM } from "@budibase/types"

class ExecutionTimeoutError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "ExecutionTimeoutError"
  }
}

export class IsolatedVM implements VM {
  #isolate: ivm.Isolate
  #vm: ivm.Context
  #jail: ivm.Reference
  #timeout: number
  #perRequestLimit?: number

  #modules: Record<
    string,
    {
      headCode: string
      module: ivm.Module
    }
  > = {}

  readonly #resultKey = "results"

  constructor({
    memoryLimit,
    timeout,
    perRequestLimit,
  }: {
    memoryLimit: number
    timeout: number
    perRequestLimit?: number
  }) {
    this.#isolate = new ivm.Isolate({ memoryLimit })
    this.#vm = this.#isolate.createContextSync()
    this.#jail = this.#vm.global
    this.#jail.setSync("global", this.#jail.derefInto())

    this.#addToContext({
      [this.#resultKey]: { out: "" },
    })

    this.#timeout = timeout
    this.#perRequestLimit = perRequestLimit
  }

  withHelpers() {
    const injectedRequire = `
    const require = function(val){
      switch (val) {
        case "url": 
          return {
            resolve: (...params) => urlResolveCb(...params),
            parse: (...params) => urlParseCb(...params),
          }
        case "querystring":
          return {
            escape: (...params) => querystringEscapeCb(...params),
          }
      }
    };`

    const helpersSource = loadBundle(BundleType.HELPERS)
    const helpersModule = this.#isolate.compileModuleSync(
      `${injectedRequire};${helpersSource}`
    )

    this.#addToContext({
      urlResolveCb: new ivm.Callback(
        (...params: Parameters<typeof url.resolve>) => url.resolve(...params)
      ),
      urlParseCb: new ivm.Callback((...params: Parameters<typeof url.parse>) =>
        url.parse(...params)
      ),
      querystringEscapeCb: new ivm.Callback(
        (...params: Parameters<typeof querystring.escape>) =>
          querystring.escape(...params)
      ),
      helpersStripProtocol: new ivm.Callback((str: string) => {
        var parsed = url.parse(str) as any
        parsed.protocol = ""
        return parsed.format()
      }),
    })

    const cryptoModule = this.#isolate.compileModuleSync(
      `export default { randomUUID: cryptoRandomUUIDCb }`
    )
    cryptoModule.instantiateSync(this.#vm, specifier => {
      throw new Error(`No imports allowed. Required: ${specifier}`)
    })

    this.#addToContext({
      cryptoRandomUUIDCb: new ivm.Callback(
        (...params: Parameters<typeof crypto.randomUUID>) => {
          return crypto.randomUUID(...params)
        }
      ),
    })

    helpersModule.instantiateSync(this.#vm, specifier => {
      if (specifier === "crypto") {
        return cryptoModule
      }
      throw new Error(`No imports allowed. Required: ${specifier}`)
    })

    this.#modules["compiled_module"] = {
      headCode: 'import helpers from "compiled_module"',
      module: helpersModule,
    }
    return this
  }

  execute(code: string): string {
    const perRequestLimit = this.#perRequestLimit

    if (perRequestLimit) {
      const cpuMs = Number(this.#isolate.cpuTime) / 1e6
      if (cpuMs > perRequestLimit) {
        throw new ExecutionTimeoutError(
          `CPU time limit exceeded (${cpuMs}ms > ${perRequestLimit}ms)`
        )
      }
    }

    code = [
      ...Object.values(this.#modules).map(m => m.headCode),
      `results.out=${code};`,
    ].join(";")

    const script = this.#isolate.compileModuleSync(code)

    script.instantiateSync(this.#vm, specifier => {
      if (specifier === "compiled_module") {
        return this.#modules[specifier].module
      }

      throw new Error(`"${specifier}" import not allowed`)
    })

    script.evaluateSync({ timeout: this.#timeout })

    const result = this.#getResult()
    return result
  }

  #addToContext(context: Record<string, any>) {
    for (let key in context) {
      this.#jail.setSync(
        key,
        new ivm.ExternalCopy(context[key]).copyInto({ release: true })
      )
    }
  }

  #getResult() {
    const ref = this.#vm.global.getSync(this.#resultKey, { reference: true })
    const result = ref.copySync()
    ref.release()
    return result.out
  }
}
