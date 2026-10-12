import { z } from "zod"
import { compileFunctionInProcess } from "../sdk/workspace/functions/compiler/compile"
import type { FunctionCompilerRequest } from "../sdk/workspace/functions/compiler/types"

const functionQueryCapabilitySchema = z.object({
  capabilityId: z.string(),
  queryId: z.string(),
  datasourceAlias: z.string(),
  queryAlias: z.string(),
  parameterNames: z.array(z.string()),
})

const compilerRequestSchema: z.ZodType<FunctionCompilerRequest> = z.object({
  source: z.string(),
  declarations: z.string(),
  capabilities: z.array(functionQueryCapabilitySchema),
})

const isCompilerRequest = (value: unknown): value is FunctionCompilerRequest =>
  compilerRequestSchema.safeParse(value).success

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
