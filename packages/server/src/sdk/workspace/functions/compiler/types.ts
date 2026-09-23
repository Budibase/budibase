import type {
  FunctionBuildDiagnostic,
  FunctionQueryCapability,
} from "@budibase/types"

export interface FunctionCompilerRequest {
  source: string
  declarations: string
  capabilities: FunctionQueryCapability[]
}

export interface FunctionCompilerOutput {
  compiledJavaScript: string
  sourceMap?: string
}

export interface FunctionCompilerResult {
  diagnostics: FunctionBuildDiagnostic[]
  output?: FunctionCompilerOutput
}
