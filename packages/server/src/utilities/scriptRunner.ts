import env from "../environment"
import { IsolatedVM } from "../jsRunner/vm"

const JS_TIMEOUT_MS = 1000
class ScriptRunner {
  #code: string
  #vm: IsolatedVM

  constructor(script: string, context: any, { parseBson = false } = {}) {
    this.#code = `(() => {${script}})();`
    this.#vm = new IsolatedVM({
      memoryLimit: env.JS_RUNNER_MEMORY_LIMIT,
      timeout: JS_TIMEOUT_MS,
    }).withContext(context)

    if (parseBson) {
      this.#vm = this.#vm.withParsingBson()
    }
  }

  execute() {
    const result = this.#vm.execute(this.#code)
    return result
  }
}

// <<<<<<< HEAD
//   constructor(script: string, context: any, { parseBson = false } = {}) {
//     this.vm = new IsolatedVM({
//       memoryLimit: env.JS_RUNNER_MEMORY_LIMIT,
//       parseBson,
//       context: {
//         ...context,
//         data: parseBson
//           ? bson.BSON.serialize({ data: context.data })
//           : context.data,
//       },
//     })

//     if (parseBson) {
//       // If we need to parse bson, we follow the next steps:
//       // 1. Serialise the data from potential BSON to buffer before passing it to the isolate
//       // 2. Deserialise the data within the isolate, to get the original data
//       // 3. Process script
//       // 4. Stringify the result in order to convert the result from BSON to json
//       script = `return toJson((function(){data=deserialize(data, { validation: { utf8: true } }).data;${script}})());`
//     }

//     this.vm.code = script
//   }

//   execute() {
//     this.vm.runScript()
//     const result = this.vm.getResult()
//     return result
//   }
// }

// class IsolatedVM {
//   #isolate: ivm.Isolate
//   #vm: ivm.Context
//   #jail: ivm.Reference
//   #script: ivm.Module = undefined!
//   #bsonModule?: ivm.Module

//   readonly #resultKey = "results"

//   constructor({
//     memoryLimit,
//     parseBson,
//     context,
//   }: {
//     memoryLimit: number
//     parseBson: boolean
//     context: Record<string, any>
//   }) {
//     this.#isolate = new ivm.Isolate({ memoryLimit })
//     this.#vm = this.#isolate.createContextSync()
//     this.#jail = this.#vm.global
//     this.#jail.setSync("global", this.#jail.derefInto())

//     this.#addToContext(context)
//     this.#addToContext({
//       [this.#resultKey]: { out: "" },
//     })

//     if (parseBson) {
//       const bsonSource = loadBundle(BundleType.BSON)
//       this.#bsonModule = this.#isolate.compileModuleSync(bsonSource)
//       this.#bsonModule.instantiateSync(this.#vm, specifier => {
//         throw new Error(`No imports allowed. Required: ${specifier}`)
//       })
//     }
//   }

//   getResult() {
//     const ref = this.#vm.global.getSync(this.#resultKey, { reference: true })
//     const result = ref.copySync()
//     ref.release()
//     return result.out
//   }

//   #addToContext(context: Record<string, any>) {
//     for (let key in context) {
//       this.#jail.setSync(key, this.#copyRefToVm(context[key]))
//     }
//   }

//   set code(code: string) {
//     code = `const fn=function(){${code}};results.out=fn();`
//     if (this.#bsonModule) {
//       code = `import {deserialize, toJson} from "compiled_module";${code}`
//     }
//     this.#script = this.#isolate.compileModuleSync(code)
//   }

//   runScript(): void {
//     this.#script.instantiateSync(this.#vm, specifier => {
//       if (specifier === "compiled_module" && this.#bsonModule) {
//         return this.#bsonModule!
//       }

//       throw new Error(`"${specifier}" import not allowed`)
//     })

//     this.#script.evaluateSync({ timeout: JS_TIMEOUT_MS })
//   }

//   #copyRefToVm(value: Object): ivm.Copy<Object> {
//     return new ivm.ExternalCopy(value).copyInto({ release: true })
//   }
// =======

// >>>>>>> isolated-vm-wrapper
// }

export default ScriptRunner
