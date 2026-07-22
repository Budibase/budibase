import ivm from "isolated-vm"
import type { ExecuteError, ExecuteStatus, JsonValue } from "./protocol"

export interface IsolateResult {
  status: ExecuteStatus
  result?: JsonValue
  error?: ExecuteError
}

export interface RunOptions {
  code: string
  input: JsonValue
  timeoutMs: number
  memoryMb: number
}

const TIMEOUT_MARKER = "Script execution timed out"

// Executes untrusted Function source inside a fresh isolate. The isolate is
// created per-call and disposed in a finally block so no state, handles or host
// references leak between executions. Only a copied `input` value crosses the
// boundary - never a live host object.
export const runInIsolate = async ({
  code,
  input,
  timeoutMs,
  memoryMb,
}: RunOptions): Promise<IsolateResult> => {
  const isolate = new ivm.Isolate({ memoryLimit: memoryMb })
  try {
    const context = await isolate.createContext()
    const jail = context.global
    await jail.set("global", jail.derefInto())
    await jail.set(
      "__input__",
      new ivm.ExternalCopy(input).copyInto({ release: true })
    )

    const wrapped = `
      (async () => {
        "use strict";
        const input = __input__;
        return await (async () => {
          ${code}
        })();
      })()
    `

    const script = await isolate.compileScript(wrapped)
    const result = await script.run(context, {
      timeout: timeoutMs,
      promise: true,
      copy: true,
    })

    return { status: "ok", result: result as JsonValue }
  } catch (err: unknown) {
    const error = err as Error
    const message = error?.message || String(err)
    if (message.includes(TIMEOUT_MARKER)) {
      return {
        status: "timeout",
        error: { name: "TimeoutError", message },
      }
    }
    return {
      status: "error",
      error: { name: error?.name || "Error", message },
    }
  } finally {
    if (!isolate.isDisposed) {
      isolate.dispose()
    }
  }
}
