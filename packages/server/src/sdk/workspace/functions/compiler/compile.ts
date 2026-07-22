import { bundleFunction } from "./bundle"
import { limitDiagnostics } from "./diagnostics"
import { lintFunctionSource } from "./linter"
import { typecheckFunction } from "./typecheck"
import type { FunctionCompilerRequest, FunctionCompilerResult } from "./types"

export const compileFunctionInProcess = async (
  request: FunctionCompilerRequest
): Promise<FunctionCompilerResult> => {
  const diagnostics = limitDiagnostics([
    ...lintFunctionSource(request.source),
    ...typecheckFunction(request.source, request.declarations),
  ])
  if (diagnostics.length) {
    return { diagnostics }
  }

  return await bundleFunction(request.source)
}
