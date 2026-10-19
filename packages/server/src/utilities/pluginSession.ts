import { spawn, type ChildProcess, type Serializable } from "child_process"
import crypto from "crypto"
import path from "path"
import { z } from "zod"

import type { ContextEmitter } from "@budibase/types"

const pluginRunnerErrorSchema = z.object({
  message: z.string(),
  stack: z.string().optional(),
})

const pluginRunnerResponseSchema = z.object({
  type: z.literal("response"),
  requestId: z.string(),
  result: z.custom<Serializable>().optional(),
  error: pluginRunnerErrorSchema.optional(),
})

const pluginHostCallSchema = z.object({
  type: z.literal("hostCall"),
  callId: z.string(),
  method: z.enum(["emitRow", "emitTable"]),
  args: z.array(z.custom<Serializable>()),
})

type PluginHostCall = z.infer<typeof pluginHostCallSchema>

interface DescribeDatasourcePluginRequest {
  operation: "describeDatasource"
  config: Serializable | undefined
}

interface InvokeDatasourcePluginRequest {
  operation: "invokeDatasource"
  config?: Serializable
  method: string
  args?: (Serializable | undefined)[]
  typeCastingSchema?: Record<string, { name: string; type: string }>
}

interface DescribeAutomationPluginRequest {
  operation: "describeAutomation"
}

interface InvokeAutomationPluginRequest {
  operation: "invokeAutomation"
  params: Serializable
}

type PluginRequest =
  | { operation: "validateDatasource" }
  | DescribeDatasourcePluginRequest
  | InvokeDatasourcePluginRequest
  | DescribeAutomationPluginRequest
  | InvokeAutomationPluginRequest

interface PluginSessionOptions {
  filename: string
  pluginType: "Datasource" | "Automation"
  timeout: number
  emitter?: ContextEmitter
}

interface PendingInvocation {
  resolve: (result: Serializable | undefined) => void
  reject: (error: Error) => void
}

const PLUGIN_RUNNER_PATH = path.join(__dirname, "pluginRunnerProcess.js")

export class PluginSession {
  private child: ChildProcess
  private pending = new Map<string, PendingInvocation>()
  private failure?: Error
  private exited: Promise<void>
  private timeout: ReturnType<typeof setTimeout>
  private disposal?: Promise<void>

  constructor(private options: PluginSessionOptions) {
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
        this.fail(new Error(`${options.pluginType} plugin session has closed`))
        clearTimeout(this.timeout)
        resolve()
      })
    })
    this.timeout = setTimeout(() => {
      this.fail(
        new Error(
          `${options.pluginType} plugin execution exceeded the time limit`
        )
      )
      this.child.kill("SIGKILL")
    }, options.timeout)

    this.child.once("error", error => {
      this.fail(error)
      this.child.kill("SIGKILL")
    })
    this.child.on("message", message => this.handleMessage(message))
  }

  private handleMessage(message: Serializable) {
    const hostCall = pluginHostCallSchema.safeParse(message)
    if (hostCall.success) {
      this.handleHostCall(hostCall.data)
      return
    }

    const response = pluginRunnerResponseSchema.safeParse(message)
    if (!response.success) {
      return
    }
    const pending = this.pending.get(response.data.requestId)
    if (!pending) {
      return
    }
    this.pending.delete(response.data.requestId)
    if (response.data.error) {
      pending.reject(new Error(response.data.error.message))
    } else {
      pending.resolve(response.data.result)
    }
  }

  private async handleHostCall(message: PluginHostCall) {
    try {
      const emitter = this.options.emitter
      if (!emitter) {
        throw new Error("Plugin host method is not available")
      }
      await Reflect.apply(emitter[message.method], emitter, message.args)
      this.send({ type: "hostResponse", callId: message.callId })
    } catch (error) {
      this.send({
        type: "hostResponse",
        callId: message.callId,
        error: {
          message: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
        },
      })
    }
  }

  private send(message: Serializable) {
    try {
      this.child.send(message, error => {
        if (error) {
          this.fail(error)
        }
      })
    } catch (error) {
      this.fail(error instanceof Error ? error : new Error(String(error)))
    }
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
        this.send({
          ...request,
          filename: this.options.filename,
          requestId,
        })
      })
    } catch (error) {
      await this.close()
      throw error
    }
  }

  async close() {
    this.fail(new Error(`${this.options.pluginType} plugin session has closed`))
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
          operation: "invokeDatasource",
          method: "end",
        })
      }
    } finally {
      await this.close()
    }
  }
}
