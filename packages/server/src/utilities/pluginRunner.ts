import { spawn, type Serializable } from "child_process"
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

interface PluginDescription {
  methods: string[]
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

const PLUGIN_RUNNER_SOURCE = String.raw`
const send = response => {
  if (process.send) {
    process.send(response, () => process.exit(0))
  } else {
    process.exit(1)
  }
}

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

process.once("message", async request => {
  try {
    const plugin = require(request.filename)
    const Integration = plugin.integration || plugin
    if (typeof Integration !== "function") {
      throw new Error("Datasource plugin does not export an integration class")
    }

    if (request.operation === "describe") {
      send({ requestId: request.requestId, result: { methods: getMethods(Integration) } })
      return
    }

    const integration = new Integration(request.config)
    if (
      request.typeCastingSchema &&
      typeof integration.defineTypeCastingFromSchema === "function"
    ) {
      integration.defineTypeCastingFromSchema(request.typeCastingSchema)
    }

    const method = integration[request.method]
    if (typeof method !== "function") {
      throw new Error("Datasource plugin method is not available")
    }

    const result = await method.apply(integration, request.args || [])
    if (typeof integration.end === "function") {
      await integration.end()
    }
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
})
`

const isPluginRunnerResponse = (
  message: Serializable
): message is PluginRunnerResponse => {
  return (
    typeof message === "object" && message !== null && "requestId" in message
  )
}

const runPlugin = <T>(invocation: PluginInvocation): Promise<T> => {
  const requestId = crypto.randomUUID()
  const execArgv = [
    "--permission",
    `--allow-fs-read=${invocation.filename}`,
    "--max-old-space-size=128",
  ]
  const dropPrivileges = process.getuid?.() === 0

  return new Promise((resolve, reject) => {
    const child = spawn(
      process.execPath,
      [...execArgv, "-e", PLUGIN_RUNNER_SOURCE],
      {
        cwd: process.platform === "win32" ? undefined : "/tmp",
        env: { NODE_ENV: process.env.NODE_ENV || "production" },
        gid: dropPrivileges ? 65534 : undefined,
        uid: dropPrivileges ? 65534 : undefined,
        serialization: "advanced",
        stdio: ["ignore", "ignore", "ignore", "ipc"],
      }
    )

    let completed = false
    const finish = (callback: () => void) => {
      if (completed) {
        return
      }
      completed = true
      clearTimeout(timeout)
      callback()
    }

    const timeout = setTimeout(() => {
      child.kill("SIGKILL")
      finish(() =>
        reject(new Error("Datasource plugin execution exceeded the time limit"))
      )
    }, environment.QUERY_THREAD_TIMEOUT)

    child.once("error", error => finish(() => reject(error)))
    child.once("exit", code => {
      if (!completed) {
        finish(() =>
          reject(
            new Error(
              `Datasource plugin process exited before responding (${code})`
            )
          )
        )
      }
    })
    child.on("message", message => {
      if (!isPluginRunnerResponse(message) || message.requestId !== requestId) {
        return
      }
      if (message.error) {
        const error = new Error(message.error.message)
        error.stack = message.error.stack
        finish(() => reject(error))
      } else {
        finish(() => resolve(message.result))
      }
    })

    child.send({ ...invocation, requestId }, error => {
      if (error) {
        finish(() => reject(error))
      }
    })
  })
}

const createDatasourcePlugin = async (filename: string) => {
  filename = fs.realpathSync(filename)
  const { methods } = await runPlugin<PluginDescription>({
    filename,
    operation: "describe",
  })

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
      value(this: DatasourcePluginProxy, ...args: any[]) {
        return runPlugin({
          filename,
          operation: "invoke",
          config: this.config,
          method,
          args,
          typeCastingSchema: this.typeCastingSchema,
        })
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
