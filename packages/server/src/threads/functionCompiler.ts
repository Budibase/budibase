import { compileFunctionInProcess } from "../sdk/workspace/functions/compiler/compile"
import type { FunctionCompilerRequest } from "../sdk/workspace/functions/compiler/types"

const isCompilerRequest = (
  value: unknown
): value is FunctionCompilerRequest => {
  return (
    typeof value === "object" &&
    value !== null &&
    "source" in value &&
    typeof value.source === "string" &&
    "declarations" in value &&
    typeof value.declarations === "string"
  )
}

process.once("message", async (message: unknown) => {
  if (!isCompilerRequest(message)) {
    process.exitCode = 1
    process.disconnect()
    return
  }

  const result = await compileFunctionInProcess(message)
  if (process.send) {
    process.send(result, undefined, {}, () => process.disconnect())
  }
})
