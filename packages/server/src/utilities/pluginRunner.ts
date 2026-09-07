import { spawn, type ChildProcess, type Serializable } from "child_process"
import crypto from "crypto"
import fs from "fs"

import type { IntegrationBase } from "@budibase/types"

import environment from "../environment"

type IntegrationBaseConstructor = new (...args: any[]) => IntegrationBase

interface PluginRunnerError {
  message: string
  stack?: string
}

interface PluginRunnerResponse {
  requestId: string
  result?: any
  error?: PluginRunnerError
}

interface PluginInvocation {
  filename: string
  operation: "describe" | "invoke"
  config?: any
  method?: string
  args?: any[]
  typeCastingSchema?: Record<string, { name: string; type: string }>
}

interface DatasourcePluginProxy {
  config: any
  typeCastingSchema?: Record<string, { name: string; type: string }>
}

interface CachedDatasourcePlugin {
  hash: string
  integration: Promise<IntegrationBaseConstructor>
}

const datasourcePluginCache = new Map<string, CachedDatasourcePlugin>()
const pluginSessions = new WeakMap<object, PluginSession>()
const SESSION_HELPER_METHODS = new Set([
  "getBindingIdentifier",
  "getStringConcat",
])

const PLUGIN_RUNNER_SOURCE = String.raw`
const send = process.send.bind(process)
let Integration
let integration
let queue = Promise.resolve()

const getMethods = Integration => {
  const methods = new Set()
  let prototype = Integration.prototype
  while (prototype && prototype !== Object.prototype) {
    for (const name of Object.getOwnPropertyNames(prototype)) {
      if (name !== "constructor" && typeof prototype[name] === "function") {
        methods.add(name)
      }
    }
    prototype = Object.getPrototypeOf(prototype)
  }
  return [...methods]
}

const handleRequest = async request => {
  try {
    if (!Integration) {
      const plugin = require(request.filename)
      Integration = plugin.integration || plugin
      if (typeof Integration !== "function") {
        throw new Error("Datasource plugin does not export an integration class")
      }
    }

    if (request.operation === "describe") {
      send({ requestId: request.requestId, result: { methods: getMethods(Integration) } })
      return
    }

    if (!integration) {
      integration = new Integration(request.config)
      if (
        request.typeCastingSchema &&
        typeof integration.defineTypeCastingFromSchema === "function"
      ) {
        await integration.defineTypeCastingFromSchema(request.typeCastingSchema)
      }
    }

    const method = integration[request.method]
    if (typeof method !== "function") {
      throw new Error("Datasource plugin method is not available")
    }

    const result = await method.apply(integration, request.args || [])
    send({ requestId: request.requestId, result })
  } catch (error) {
    send({
      requestId: request.requestId,
      error: {
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      },
    })
  }
}
process.on("message", request => {
  queue = queue.then(() => handleRequest(request))
})
`

const isPluginRunnerResponse = (
  message: Serializable
): message is PluginRunnerResponse => {
  if (
    typeof message !== "object" ||
    message === null ||
    !("requestId" in message) ||
    typeof message.requestId !== "string"
  ) {
    return false
  }
  if ("error" in message && message.error !== undefined) {
    return (
      typeof message.error === "object" &&
      message.error !== null &&
      "message" in message.error &&
      typeof message.error.message === "string"
    )
  }
  return true
}

interface PendingInvocation {
  resolve: (result: Serializable | undefined) => void
  reject: (error: Error) => void
}

class PluginSession {
  private child: ChildProcess
  private pending = new Map<string, PendingInvocation>()
  private failure?: Error
  private exited: Promise<void>
  private timeout: ReturnType<typeof setTimeout>
  private disposal?: Promise<void>

  constructor(private options: { filename: string; hasEnd?: boolean }) {
    const { filename } = options
    const dropPrivileges = process.getuid?.() === 0
    this.child = spawn(
      process.execPath,
      [
        "--permission",
        "--allow-fs-read=" + filename,
        "--max-old-space-size=128",
        "-e",
        PLUGIN_RUNNER_SOURCE,
      ],
      {
        cwd: process.platform === "win32" ? undefined : "/tmp",
        env: { NODE_ENV: process.env.NODE_ENV || "production" },
        gid: dropPrivileges ? 65534 : undefined,
        uid: dropPrivileges ? 65534 : undefined,
        serialization: "advanced",
        stdio: ["ignore", "ignore", "ignore", "ipc"],
      }
    )
    this.exited = new Promise(resolve => {
      this.child.once("close", () => {
        this.fail(new Error("Datasource plugin session has closed"))
        clearTimeout(this.timeout)
        resolve()
      })
    })
    this.timeout = setTimeout(() => {
      this.fail(
        new Error("Datasource plugin execution exceeded the time limit")
      )
      this.child.kill("SIGKILL")
    }, environment.QUERY_THREAD_TIMEOUT)

    this.child.once("error", error => {
      this.fail(error)
      this.child.kill("SIGKILL")
    })
    this.child.on("message", message => {
      if (!isPluginRunnerResponse(message)) {
        return
      }
      const pending = this.pending.get(message.requestId)
      if (!pending) {
        return
      }
      this.pending.delete(message.requestId)
      if (message.error) {
        pending.reject(new Error(message.error.message))
      } else {
        pending.resolve(message.result)
      }
    })
  }

  private fail(error: Error) {
    this.failure ||= error
    for (const pending of this.pending.values()) {
      pending.reject(this.failure)
    }
    this.pending.clear()
  }

  async invoke(invocation: PluginInvocation) {
    if (this.failure) {
      throw this.failure
    }
    const requestId = crypto.randomUUID()
    try {
      return await new Promise<Serializable | undefined>((resolve, reject) => {
        this.pending.set(requestId, { resolve, reject })
        this.child.send(
          { ...invocation, filename: this.options.filename, requestId },
          error => {
            if (error) {
              this.fail(error)
            }
          }
        )
      })
    } catch (error) {
      await this.close()
      throw error
    }
  }

  async close() {
    this.fail(new Error("Datasource plugin session has closed"))
    this.child.kill("SIGKILL")
    await this.exited
  }

  dispose() {
    this.disposal ||= this.end()
    return this.disposal
  }

  private async end() {
    try {
      if (this.options.hasEnd && !this.failure) {
        await this.invoke({
          filename: this.options.filename,
          operation: "invoke",
          method: "end",
        })
      }
    } finally {
      await this.close()
    }
  }
}

const createDatasourcePlugin = async (filename: string) => {
  filename = fs.realpathSync(filename)
  const discovery = new PluginSession({ filename })
  let methods: string[]
  try {
    const result = await discovery.invoke({ filename, operation: "describe" })
    if (
      typeof result !== "object" ||
      result === null ||
      !("methods" in result) ||
      !Array.isArray(result.methods) ||
      !result.methods.every(method => typeof method === "string")
    ) {
      throw new Error("Datasource plugin returned invalid methods")
    }
    methods = result.methods
  } finally {
    await discovery.close()
  }

  const Integration: IntegrationBaseConstructor = class {
    declare read?: IntegrationBase["read"]

    config: any
    typeCastingSchema?: Record<string, { name: string; type: string }>

    constructor(config: any) {
      this.config = config
    }
  }

  for (const method of methods) {
    if (method === "defineTypeCastingFromSchema") {
      Object.defineProperty(Integration.prototype, method, {
        value(
          this: DatasourcePluginProxy,
          schema: Record<string, { name: string; type: string }>
        ) {
          this.typeCastingSchema = schema
        },
      })
      continue
    }
    if (method === "end") {
      continue
    }

    Object.defineProperty(Integration.prototype, method, {
      async value(this: DatasourcePluginProxy, ...args: any[]) {
        let session = pluginSessions.get(this)
        if (!session) {
          session = new PluginSession({
            filename,
            hasEnd: methods.includes("end"),
          })
          pluginSessions.set(this, session)
        }
        let result: Serializable | undefined
        try {
          result = await session.invoke({
            filename,
            operation: "invoke",
            config: this.config,
            method,
            args,
            typeCastingSchema: this.typeCastingSchema,
          })
        } catch (error) {
          pluginSessions.delete(this)
          throw error
        }
        if (!SESSION_HELPER_METHODS.has(method)) {
          try {
            await session.dispose()
          } finally {
            pluginSessions.delete(this)
          }
        }
        return result
      },
    })
  }

  return Integration
}

export const loadDatasourcePlugin = async ({
  filename,
  hash,
}: {
  filename: string
  hash: string
}) => {
  const cached = datasourcePluginCache.get(filename)
  if (cached?.hash === hash) {
    return cached.integration
  }

  const integration = createDatasourcePlugin(filename)
  datasourcePluginCache.set(filename, { hash, integration })
  try {
    return await integration
  } catch (err) {
    datasourcePluginCache.delete(filename)
    throw err
  }
}
