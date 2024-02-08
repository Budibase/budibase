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

class ModuleHandler {
  private modules: {
    import: string
    moduleKey: string
    module: ivm.Module
  }[] = []

  private generateRandomKey = () => `i${crypto.randomUUID().replace(/-/g, "")}`

  registerModule(module: ivm.Module, imports: string) {
    this.modules.push({
      moduleKey: this.generateRandomKey(),
      import: imports,
      module: module,
    })
  }

  generateImports() {
    return this.modules
      .map(m => `import ${m.import} from "${m.moduleKey}"`)
      .join(";")
  }

  getModule(key: string) {
    const module = this.modules.find(m => m.moduleKey === key)
    return module?.module
  }
}

export class IsolatedVM implements VM {
  private isolate: ivm.Isolate
  private vm: ivm.Context
  private jail: ivm.Reference
  private invocationTimeout: number
  private isolateAccumulatedTimeout?: number

  private moduleHandler = new ModuleHandler()

  private readonly resultKey = "results"

  constructor({
    memoryLimit,
    invocationTimeout,
    isolateAccumulatedTimeout,
  }: {
    memoryLimit: number
    invocationTimeout: number
    isolateAccumulatedTimeout?: number
  }) {
    this.isolate = new ivm.Isolate({ memoryLimit })
    this.vm = this.isolate.createContextSync()
    this.jail = this.vm.global
    this.jail.setSync("global", this.jail.derefInto())

    this.addToContext({
      [this.resultKey]: { out: "" },
    })

    this.invocationTimeout = invocationTimeout
    this.isolateAccumulatedTimeout = isolateAccumulatedTimeout
  }

  withHelpers() {
    const urlModule = this.registerCallbacks({
      resolve: url.resolve,
      parse: url.parse,
    })

    const querystringModule = this.registerCallbacks({
      escape: querystring.escape,
    })

    this.addToContext({
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
    const helpersModule = this.isolate.compileModuleSync(
      `${injectedRequire};${helpersSource}`
    )

    helpersModule.instantiateSync(this.vm, specifier => {
      if (specifier === "crypto") {
        const cryptoModule = this.registerCallbacks({
          randomUUID: crypto.randomUUID,
        })
        const module = this.isolate.compileModuleSync(
          `export default ${cryptoModule}`
        )
        module.instantiateSync(this.vm, specifier => {
          throw new Error(`No imports allowed. Required: ${specifier}`)
        })
        return module
      }
      throw new Error(`No imports allowed. Required: ${specifier}`)
    })

    this.moduleHandler.registerModule(helpersModule, "helpers")
    return this
  }

  withContext(context: Record<string, any>) {
    this.addToContext(context)
    return this
  }

  execute(code: string): string {
    if (this.isolateAccumulatedTimeout) {
      const cpuMs = Number(this.isolate.cpuTime) / 1e6
      if (cpuMs > this.isolateAccumulatedTimeout) {
        throw new ExecutionTimeoutError(
          `CPU time limit exceeded (${cpuMs}ms > ${this.isolateAccumulatedTimeout}ms)`
        )
      }
    }

    code = `${this.moduleHandler.generateImports()};results.out=${code};`

    const script = this.isolate.compileModuleSync(code)

    script.instantiateSync(this.vm, specifier => {
      const module = this.moduleHandler.getModule(specifier)
      if (module) {
        return module
      }

      throw new Error(`"${specifier}" import not allowed`)
    })

    script.evaluateSync({ timeout: this.invocationTimeout })

    const result = this.getResult()
    return result
  }

  private registerCallbacks(functions: Record<string, any>) {
    const libId = crypto.randomUUID().replace(/-/g, "")

    const x: Record<string, string> = {}
    for (const [funcName, func] of Object.entries(functions)) {
      const key = `f${libId}${funcName}cb`
      x[funcName] = key

      this.addToContext({
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

  private addToContext(context: Record<string, any>) {
    for (let key in context) {
      const value = context[key]
      this.jail.setSync(
        key,
        typeof value === "function"
          ? value
          : new ivm.ExternalCopy(value).copyInto({ release: true })
      )
    }
  }

  private getResult() {
    const ref = this.vm.global.getSync(this.resultKey, { reference: true })
    const result = ref.copySync()
    ref.release()
    return result.out
  }
}
