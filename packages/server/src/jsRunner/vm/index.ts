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

  #modules: {
    import: string
    moduleKey: string
    module: ivm.Module
  }[] = []

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
    const urlModule = this.#registerCallbacks({
      resolve: url.resolve,
      parse: url.parse,
    })

    const querystringModule = this.#registerCallbacks({
      escape: querystring.escape,
    })

    this.#addToContext({
      helpersStripProtocol: new ivm.Callback((str: string) => {
        var parsed = url.parse(str) as any
        parsed.protocol = ""
        return parsed.format()
      }),
    })

    const injectedRequire = `const require=function req(val) {
        switch (val) {
            case "url": return ${urlModule};
            case "querystring": return ${querystringModule};
        }
      }`
    const helpersSource = loadBundle(BundleType.HELPERS)
    const helpersModule = this.#isolate.compileModuleSync(
      `${injectedRequire};${helpersSource}`
    )

    helpersModule.instantiateSync(this.#vm, specifier => {
      if (specifier === "crypto") {
        const cryptoModule = this.#registerCallbacks({
          randomUUID: crypto.randomUUID,
        })
        const module = this.#isolate.compileModuleSync(
          `export default ${cryptoModule}`
        )
        module.instantiateSync(this.#vm, specifier => {
          throw new Error(`No imports allowed. Required: ${specifier}`)
        })
        return module
      }
      throw new Error(`No imports allowed. Required: ${specifier}`)
    })

    this.#modules.push({
      import: "helpers",
      moduleKey: `i${crypto.randomUUID().replace(/-/g, "")}`,
      module: helpersModule,
    })
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
      ...this.#modules.map(m => `import ${m.import} from "${m.moduleKey}"`),
      `results.out=${code};`,
    ].join(";")

    const script = this.#isolate.compileModuleSync(code)

    script.instantiateSync(this.#vm, specifier => {
      const module = this.#modules.find(m => m.moduleKey === specifier)
      if (module) {
        return module.module
      }

      throw new Error(`"${specifier}" import not allowed`)
    })

    script.evaluateSync({ timeout: this.#timeout })

    const result = this.#getResult()
    return result
  }

  #registerCallbacks(functions: Record<string, any>) {
    const libId = crypto.randomUUID().replace(/-/g, "")

    const x: Record<string, string> = {}
    for (const [funcName, func] of Object.entries(functions)) {
      const key = `f${libId}${funcName}cb`
      x[funcName] = key

      this.#addToContext({
        [key]: new ivm.Callback((...params: any[]) => (func as any)(...params)),
      })
    }

    const mod =
      `{` +
      Object.entries(x)
        .map(([key, func]) => `${key}: ${func}`)
        .join() +
      "}"
    return mod
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
