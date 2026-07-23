import type { FunctionRunResult, JSONValue } from "@budibase/types"
import type { ChildMessage } from "./ipc"
import { validateParentMessage } from "./ipc"
import { executeFunctionInIsolate } from "./isolatedVmRuntime"

let handledRequest = false
let nextQueryId = 0
const pendingQueries = new Map<
  string,
  {
    resolve: (value: JSONValue) => void
    reject: (error: Error) => void
  }
>()

const sendResult = (result: FunctionRunResult) => {
  if (!process.send) {
    process.exit(1)
  }
  const message: ChildMessage = { type: "result", result }
  process.send(message, undefined, undefined, error =>
    process.exit(error ? 1 : 0)
  )
}

const executeQuery = (
  capabilityId: string,
  parameters: Record<string, JSONValue>,
  signal: AbortSignal
) =>
  new Promise<JSONValue>((resolve, reject) => {
    if (!process.send) {
      reject(new Error("Function query transport is unavailable"))
      return
    }
    const requestId = String(++nextQueryId)
    const abort = () => {
      pendingQueries.delete(requestId)
      reject(new Error("Function query was cancelled"))
    }
    if (signal.aborted) {
      abort()
      return
    }
    signal.addEventListener("abort", abort, { once: true })
    const removeAbortListener = () => signal.removeEventListener("abort", abort)
    pendingQueries.set(requestId, {
      resolve: value => {
        removeAbortListener()
        resolve(value)
      },
      reject: error => {
        removeAbortListener()
        reject(error)
      },
    })
    const message: ChildMessage = {
      type: "query",
      requestId,
      capabilityId,
      parameters,
    }
    process.send(message, undefined, undefined, error => {
      if (error) {
        pendingQueries.delete(requestId)
        removeAbortListener()
        reject(new Error("Function query transport failed"))
      }
    })
  })

process.on("message", async (value: unknown) => {
  try {
    const message = validateParentMessage(value)
    if (message.type === "queryResult") {
      const pending = pendingQueries.get(message.requestId)
      if (!pending) {
        process.exit(1)
      }
      pendingQueries.delete(message.requestId)
      if (message.error) {
        pending.reject(new Error(message.error))
      } else if (message.result === undefined) {
        pending.reject(new Error("Function query returned no result"))
      } else {
        pending.resolve(message.result)
      }
      return
    }

    if (handledRequest) {
      process.exit(1)
    }
    handledRequest = true
    sendResult(
      await executeFunctionInIsolate(message.request, queryRequest =>
        executeQuery(
          queryRequest.capabilityId,
          queryRequest.parameters,
          queryRequest.signal
        )
      )
    )
  } catch {
    process.exit(1)
  }
})

process.on("disconnect", () => {
  if (!handledRequest) {
    process.exit(1)
  }
})
