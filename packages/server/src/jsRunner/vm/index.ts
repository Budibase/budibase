import ivm from "isolated-vm"
import bson from "bson"

import url from "url"
import crypto from "crypto"
import querystring from "querystring"

import { BundleType, loadBundle } from "../bundles"
import { VM } from "@budibase/types"
import { context } from "@budibase/backend-core"

class ExecutionTimeoutError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "ExecutionTimeoutError"
  }
}

class ModuleHandler {
  #modules: {
    import: string
    moduleKey: string
    module: ivm.Module
  }[] = []

  #generateRandomKey = () => `i${crypto.randomUUID().replace(/-/g, "")}`

  registerModule(module: ivm.Module, imports: string) {
    this.#modules.push({
      moduleKey: this.#generateRandomKey(),
      import: imports,
      module: module,
    })
  }

  generateImports() {
    return this.#modules
      .map(m => `import ${m.import} from "${m.moduleKey}"`)
      .join(";")
  }

  getModule(key: string) {
    const module = this.#modules.find(m => m.moduleKey === key)
    return module?.module
  }
}

export class IsolatedVM implements VM {
  #isolate: ivm.Isolate
  #vm: ivm.Context
  #jail: ivm.Reference
  #timeout: number
  #perRequestLimit?: number

  #parseBson?: boolean

  #moduleHandler = new ModuleHandler()

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

    this.#moduleHandler.registerModule(helpersModule, "helpers")
    return this
  }

  withContext(context: Record<string, any>) {
    this.#addToContext(context)
    this.#handleBsonData()
    return this
  }

  withParsingBson() {
    this.#parseBson = true
    this.#handleBsonData()

    const bsonSource = loadBundle(BundleType.BSON)
    const bsonModule = this.#isolate.compileModuleSync(bsonSource)
    bsonModule.instantiateSync(this.#vm, specifier => {
      throw new Error(`No imports allowed. Required: ${specifier}`)
    })

    this.#moduleHandler.registerModule(bsonModule, "{deserialize, toJson}")
    return this
  }

  #handleBsonData() {
    if (!this.#parseBson) {
      return
    }

    const data = this.#getFromContext("data")
    if (!data) {
      return
    }

    this.#addToContext({
      data: bson.BSON.serialize({ data }),
    })
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

    if (this.#parseBson) {
      // If we need to parse bson, we follow the next steps:
      // 1. Serialise the data from potential BSON to buffer before passing it to the isolate
      // 2. Deserialise the data within the isolate, to get the original data
      // 3. Process script
      // 4. Stringify the result in order to convert the result from BSON to json
      code = `toJson(
                (function(){
                    data= deserialize(data).data;
                    return ${code};
                })()
            );`
    }

    code = `${this.#moduleHandler.generateImports()};results.out=${code};`

    const script = this.#isolate.compileModuleSync(code)

    script.instantiateSync(this.#vm, specifier => {
      const module = this.#moduleHandler.getModule(specifier)
      if (module) {
        return module
      }

      throw new Error(`"${specifier}" import not allowed`)
    })

    script.evaluateSync({ timeout: this.#timeout })

    const result = this.#getFromContext(this.#resultKey)
    return result.out
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

  #getFromContext(key: string) {
    const ref = this.#vm.global.getSync(key, { reference: true })
    const result = ref.copySync()
    ref.release()
    return result
  }
}
