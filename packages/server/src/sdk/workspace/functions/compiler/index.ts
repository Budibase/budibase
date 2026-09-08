import { fork } from "child_process"
import { join } from "path"
import {
  DEFAULT_FUNCTION_LIMITS,
  type FunctionBuildDiagnostic,
} from "@budibase/types"
import env from "../../../../environment"
import { compileFunctionInProcess } from "./compile"
import type { FunctionCompilerRequest, FunctionCompilerResult } from "./types"

interface CompilerProcessOptions {
  memoryLimitMb?: number
  timeoutMs?: number
  workerPath?: string
}

const compilerFailure = (
  code: string,
  message: string
): FunctionCompilerResult => ({
  diagnostics: [{ code, message }],
})

const isFunctionBuildDiagnostic = (
  value: unknown
): value is FunctionBuildDiagnostic => {
  if (typeof value !== "object" || value === null) {
    return false
  }

  if (
    !("code" in value) ||
    typeof value.code !== "string" ||
    !("message" in value) ||
    typeof value.message !== "string"
  ) {
    return false
  }

  const validLine =
    !("line" in value) ||
    value.line === undefined ||
    typeof value.line === "number"
  const validColumn =
    !("column" in value) ||
    value.column === undefined ||
    typeof value.column === "number"

  return validLine && validColumn
}

const isCompilerResult = (value: unknown): value is FunctionCompilerResult => {
  if (
    typeof value !== "object" ||
    value === null ||
    !("diagnostics" in value) ||
    !Array.isArray(value.diagnostics) ||
    !value.diagnostics.every(isFunctionBuildDiagnostic)
  ) {
    return false
  }
  if (!("output" in value) || value.output === undefined) {
    return true
  }
  return (
    typeof value.output === "object" &&
    value.output !== null &&
    "compiledJavaScript" in value.output &&
    typeof value.output.compiledJavaScript === "string" &&
    (!("sourceMap" in value.output) ||
      value.output.sourceMap === undefined ||
      typeof value.output.sourceMap === "string")
  )
}

const getWorkerOptions = (memoryLimitMb: number) => {
  if (env.isDev()) {
    return {
      execArgv: [
        `--max-old-space-size=${memoryLimitMb}`,
        "-r",
        require.resolve("ts-node/register/transpile-only"),
        "-r",
        require.resolve("tsconfig-paths/register"),
      ],
      workerPath: join(__dirname, "../../../../threads/functionCompiler.ts"),
    }
  }
  return {
    execArgv: [`--max-old-space-size=${memoryLimitMb}`],
    workerPath: join(__dirname, "functionCompiler.js"),
  }
}

export const runFunctionCompilerProcess = async (
  request: FunctionCompilerRequest,
  options: CompilerProcessOptions = {}
): Promise<FunctionCompilerResult> => {
  const timeoutMs =
    options.timeoutMs ?? DEFAULT_FUNCTION_LIMITS.compile.timeoutMs
  const memoryLimitMb =
    options.memoryLimitMb ?? DEFAULT_FUNCTION_LIMITS.compile.memoryLimitMb
  const workerOptions = getWorkerOptions(memoryLimitMb)

  return await new Promise(resolve => {
    const child = fork(options.workerPath || workerOptions.workerPath, [], {
      env: {
        NODE_ENV: process.env.NODE_ENV || "production",
      },
      execArgv: options.workerPath
        ? [`--max-old-space-size=${memoryLimitMb}`]
        : workerOptions.execArgv,
      stdio: ["ignore", "ignore", "ignore", "ipc"],
    })
    let settled = false

    const finish = (result: FunctionCompilerResult) => {
      if (settled) {
        return
      }
      settled = true
      clearTimeout(timer)
      if (child.connected) {
        child.disconnect()
      }
      if (!child.killed) {
        child.kill("SIGKILL")
      }
      resolve(result)
    }

    const timer = setTimeout(() => {
      child.kill("SIGKILL")
      finish(
        compilerFailure(
          "FUNCTION_COMPILE_TIMEOUT",
          `Function compilation exceeded the ${timeoutMs}ms limit.`
        )
      )
    }, timeoutMs)

    child.once("message", (message: unknown) => {
      if (!isCompilerResult(message)) {
        finish(
          compilerFailure(
            "FUNCTION_COMPILE_ERROR",
            "The Function compiler returned an invalid response."
          )
        )
        return
      }
      finish(message)
    })
    child.once("error", () => {
      finish(
        compilerFailure(
          "FUNCTION_COMPILE_ERROR",
          "The Function compiler process could not be started."
        )
      )
    })
    child.once("exit", () => {
      if (!settled) {
        finish(
          compilerFailure(
            "FUNCTION_COMPILE_ERROR",
            "The Function compiler process terminated unexpectedly."
          )
        )
      }
    })
    child.send(request)
  })
}

export const compileFunction = async (request: FunctionCompilerRequest) => {
  if (env.isTest()) {
    return await compileFunctionInProcess(request)
  }
  return await runFunctionCompilerProcess(request)
}

export type {
  FunctionCompilerOutput,
  FunctionCompilerRequest,
  FunctionCompilerResult,
} from "./types"
