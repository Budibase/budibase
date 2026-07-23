import type { FunctionBuildDiagnostic } from "@budibase/types"

export interface FunctionCompilerRequest {
  source: string
  declarations: string
}

export interface FunctionCompilerOutput {
  compiledJavaScript: string
  sourceMap?: string
}

export interface FunctionCompilerResult {
  diagnostics: FunctionBuildDiagnostic[]
  output?: FunctionCompilerOutput
}
