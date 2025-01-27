import ivm from "isolated-vm"
import bson from "bson"

import url from "url"
import crypto from "crypto"
import querystring from "querystring"

import { BundleType, loadBundle } from "../bundles"
import { Snippet, VM } from "@budibase/types"
import { iifeWrapper, UserScriptError } from "@budibase/string-templates"
import environment from "../../environment"

export class JsRequestTimeoutError extends Error {
  static code = "JS_REQUEST_TIMEOUT_ERROR"
  code = JsRequestTimeoutError.code
}

export class IsolatedVM implements VM {
  private isolate: ivm.Isolate
  private vm: ivm.Context
  private jail: ivm.Reference
  private invocationTimeout: number
  private isolateAccumulatedTimeout?: number

  // By default the wrapper returns itself
  private codeWrapper: (code: string) => string = code => code

  private readonly resultKey = "results"
  private runResultKey: string
  private runErrorKey: string

  constructor({
    memoryLimit,
    invocationTimeout,
    isolateAccumulatedTimeout,
  }: {
    memoryLimit?: number
    invocationTimeout?: number
    isolateAccumulatedTimeout?: number
  } = {}) {
    this.isolate = new ivm.Isolate({
      memoryLimit: memoryLimit || environment.JS_RUNNER_MEMORY_LIMIT,
    })
    this.vm = this.isolate.createContextSync()
    this.jail = this.vm.global
    this.jail.setSync("global", this.jail.derefInto())

    this.runResultKey = crypto.randomUUID()
    this.runErrorKey = crypto.randomUUID()
    this.addToContext({
      [this.resultKey]: { [this.runResultKey]: "" },
    })

    this.invocationTimeout =
      invocationTimeout || environment.JS_PER_INVOCATION_TIMEOUT_MS
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

    const cryptoModule = this.registerCallbacks({
      randomUUID: crypto.randomUUID,
    })

    this.addToContext({
      helpersStripProtocol: new ivm.Callback((str: string) => {
        let parsed = url.parse(str) as any
        parsed.protocol = ""
        return parsed.format()
      }),
    })

    const injectedRequire = `require=function req(val) {
        switch (val) {
            case "url": return ${urlModule};
            case "querystring": return ${querystringModule};
            case "crypto": return ${cryptoModule};
        }
      }`
    const helpersSource = loadBundle(BundleType.HELPERS)

    const script = this.isolate.compileScriptSync(
      `${injectedRequire};${helpersSource};helpers=helpers.default`
    )

    script.runSync(this.vm, { timeout: this.invocationTimeout, release: false })
    new Promise(() => {
      script.release()
    })

    return this
  }

  withSnippets(snippets?: Snippet[]) {
    // Transform snippets into a map for faster access
    let snippetMap: Record<string, string> = {}
    for (let snippet of snippets || []) {
      snippetMap[snippet.name] = snippet.code
    }
    const snippetsSource = loadBundle(BundleType.SNIPPETS)
    const script = this.isolate.compileScriptSync(`
      const snippetDefinitions = ${JSON.stringify(snippetMap)};
      const snippetCache = {};
      ${snippetsSource};
      snippets = snippets.default;
    `)
    script.runSync(this.vm, { timeout: this.invocationTimeout, release: false })
    new Promise(() => {
      script.release()
    })
    return this
  }

  withBuffer() {
    const bufferSource = loadBundle(BundleType.BUFFER)
    const script = this.isolate.compileScriptSync(`
      ${bufferSource};
      const Buffer = buffer.default;
    `)
    script.runSync(this.vm, { timeout: this.invocationTimeout, release: false })
    new Promise(() => {
      script.release()
    })
    return this
  }

  withContext<T>(context: Record<string, any>, executeWithContext: () => T) {
    this.addToContext(context)

    try {
      return executeWithContext()
    } finally {
      this.removeFromContext(Object.keys(context))
    }
  }

  withParsingBson(data: any) {
    this.addToContext({
      bsonData: bson.BSON.serialize({ data }),
    })

    // If we need to parse bson, we follow the next steps:
    // 1. Serialise the data from potential BSON to buffer before passing it to the isolate
    // 2. Deserialise the data within the isolate, to get the original data
    // 3. Process script
    // 4. Stringify the result in order to convert the result from BSON to json
    this.codeWrapper = code =>
      iifeWrapper(`
        const data = bson.deserialize(bsonData, { validation: { utf8: false } }).data;
        const result = ${code}
        return bson.toJson(result);
      `)

    const bsonSource = loadBundle(BundleType.BSON)

    this.addToContext({
      textDecoderCb: new ivm.Callback(
        (args: {
          constructorArgs: any
          functionArgs: Parameters<InstanceType<typeof TextDecoder>["decode"]>
        }) => {
          const result = new TextDecoder(...args.constructorArgs).decode(
            ...args.functionArgs
          )
          return result
        }
      ),
    })

    // "Polyfilling" text decoder. `bson.deserialize` requires decoding. We are creating a bridge function so we don't need to inject the full library
    const textDecoderPolyfill = class TextDecoderMock {
      constructorArgs

      constructor(...constructorArgs: any) {
        this.constructorArgs = constructorArgs
      }

      decode(...input: any) {
        // @ts-expect-error - this is going to run in the isolate, where this function will be available
        // eslint-disable-next-line no-undef
        return textDecoderCb({
          constructorArgs: this.constructorArgs,
          functionArgs: input,
        })
      }
    }
      .toString()
      .replace(/TextDecoderMock/, "TextDecoder")

    const script = this.isolate.compileScriptSync(
      `${textDecoderPolyfill};${bsonSource}`
    )
    script.runSync(this.vm, { timeout: this.invocationTimeout, release: false })
    new Promise(() => {
      script.release()
    })

    return this
  }

  execute(code: string): any {
    if (this.isolateAccumulatedTimeout) {
      const cpuMs = Number(this.isolate.cpuTime) / 1e6
      if (cpuMs > this.isolateAccumulatedTimeout) {
        throw new JsRequestTimeoutError(
          `CPU time limit exceeded (${cpuMs}ms > ${this.isolateAccumulatedTimeout}ms)`
        )
      }
    }

    code = `
      try {
        results['${this.runResultKey}']=${this.codeWrapper(code)}
      } catch (e) {
        results['${this.runErrorKey}']=e
      }
    `

    const script = this.isolate.compileScriptSync(code)

    script.runSync(this.vm, { timeout: this.invocationTimeout, release: false })
    new Promise(() => {
      script.release()
    })

    // We can't rely on the script run result as it will not work for non-transferable values
    const result = this.getFromContext(this.resultKey)
    if (result[this.runErrorKey]) {
      throw new UserScriptError(result[this.runErrorKey])
    }
    return result[this.runResultKey]
  }

  close(): void {
    this.vm.release()
    this.isolate.dispose()
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

  private removeFromContext(keys: string[]) {
    for (let key of keys) {
      this.jail.deleteSync(key)
    }
  }

  private getFromContext(key: string) {
    const ref = this.vm.global.getSync(key, { reference: true })
    const result = ref.copySync()

    new Promise(() => {
      ref.release()
    })
    return result
  }
}
