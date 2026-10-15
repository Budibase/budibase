import { spawn, type ChildProcess, type Serializable } from "child_process"
import crypto from "crypto"
import fs from "fs"
import path from "path"

import type { IntegrationBase } from "@budibase/types"

import environment from "../environment"

export type IntegrationFactory = (
  config: Serializable | undefined
) => Promise<IntegrationBase>

type IntegrationBaseConstructor = new (
  config: Serializable | undefined
) => IntegrationBase

interface PluginRunnerError {
  message: string
  stack?: string
}

interface PluginRunnerResponse {
  requestId: string
  result?: any
  error?: PluginRunnerError
}

interface DescribePluginRequest {
  operation: "describe"
  config: Serializable | undefined
}

interface InvokePluginRequest {
  operation: "invoke"
  config?: any
  method: string
  args?: any[]
  typeCastingSchema?: Record<string, { name: string; type: string }>
}

type PluginRequest =
  | { operation: "validate" }
  | DescribePluginRequest
  | InvokePluginRequest

interface DatasourcePluginProxy {
  config: Serializable | undefined
  typeCastingSchema?: Record<string, { name: string; type: string }>
}

interface CachedDatasourcePlugin {
  hash: string
  integration: Promise<IntegrationFactory>
}

// loadDatasourcePlugin returns a host-side proxy with the plugin's methods.
// Each proxy call is forwarded over IPC to pluginRunnerProcess.js, where the
// real integration runs with restricted filesystem, process and memory access.
const datasourcePluginCache = new Map<string, CachedDatasourcePlugin>()
const pluginSessions = new WeakMap<object, PluginSession>()

// SQL helpers prepare state that the following operation consumes, so they
// continue using the same child process. Other methods end and reap the session.
const SESSION_CONTINUATION_METHODS = new Set([
  "getBindingIdentifier",
  "getStringConcat",
])
const PLUGIN_RUNNER_PATH = path.join(__dirname, "pluginRunnerProcess.js")

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

  constructor(private options: { filename: string }) {
    const { filename } = options
    const dropPrivileges = process.getuid?.() === 0
    this.child = spawn(
      process.execPath,
      [
        "--permission",
        "--allow-fs-read=" + filename,
        "--max-old-space-size=128",
        PLUGIN_RUNNER_PATH,
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

  async invoke(request: PluginRequest) {
    if (this.failure) {
      throw this.failure
    }
    const requestId = crypto.randomUUID()
    try {
      return await new Promise<Serializable | undefined>((resolve, reject) => {
        this.pending.set(requestId, { resolve, reject })
        this.child.send(
          { ...request, filename: this.options.filename, requestId },
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

  dispose({ hasEnd }: { hasEnd: boolean }) {
    this.disposal ||= this.end({ hasEnd })
    return this.disposal
  }

  private async end({ hasEnd }: { hasEnd: boolean }) {
    try {
      if (hasEnd && !this.failure) {
        await this.invoke({
          operation: "invoke",
          method: "end",
        })
      }
    } finally {
      await this.close()
    }
  }
}

const discoverPluginMethods = async ({
  session,
  config,
}: {
  session: PluginSession
  config: Serializable | undefined
}) => {
  const result = await session.invoke({ operation: "describe", config })
  if (
    typeof result !== "object" ||
    result === null ||
    !("methods" in result) ||
    !Array.isArray(result.methods) ||
    !result.methods.every(method => typeof method === "string")
  ) {
    throw new Error("Datasource plugin returned invalid methods")
  }
  return result.methods
}

const createIntegrationProxy = ({
  filename,
  methods,
}: {
  filename: string
  methods: string[]
}) => {
  const Integration: IntegrationBaseConstructor = class {
    declare read?: IntegrationBase["read"]

    config: Serializable | undefined
    typeCastingSchema?: Record<string, { name: string; type: string }>

    constructor(config: Serializable | undefined) {
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
          })
          pluginSessions.set(this, session)
        }
        let result: Serializable | undefined
        try {
          result = await session.invoke({
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
        if (!SESSION_CONTINUATION_METHODS.has(method)) {
          try {
            await session.dispose({ hasEnd: methods.includes("end") })
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

const createDatasourcePlugin = async (
  filename: string
): Promise<IntegrationFactory> => {
  filename = fs.realpathSync(filename)
  const validation = new PluginSession({ filename })
  try {
    await validation.invoke({ operation: "validate" })
  } finally {
    await validation.close()
  }

  return async config => {
    const session = new PluginSession({ filename })
    try {
      const methods = await discoverPluginMethods({ session, config })
      const Integration = createIntegrationProxy({ filename, methods })
      const integration = new Integration(config)
      pluginSessions.set(integration, session)
      return integration
    } catch (error) {
      await session.close()
      throw error
    }
  }
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
