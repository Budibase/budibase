import ts from "typescript"
import {
  createDefaultMapFromNodeModules,
  createSystem,
  createVirtualCompilerHost,
} from "@typescript/vfs"
import type { FunctionBuildDiagnostic } from "@budibase/types"
import {
  FUNCTION_DECLARATIONS_FILE,
  FUNCTION_VIRTUAL_SOURCE_FILE,
} from "./constants"
import {
  createBuildDiagnostic,
  getDiagnosticLocation,
  limitDiagnostics,
} from "./diagnostics"

const COMPILER_OPTIONS: ts.CompilerOptions = {
  lib: ["lib.es2022.d.ts"],
  module: ts.ModuleKind.ESNext,
  moduleResolution: ts.ModuleResolutionKind.Bundler,
  noEmit: true,
  strict: true,
  target: ts.ScriptTarget.ES2022,
  types: [],
}
const TYPE_FILES = createDefaultMapFromNodeModules(COMPILER_OPTIONS, ts)

export const typecheckFunction = (
  source: string,
  declarations: string
): FunctionBuildDiagnostic[] => {
  const files = new Map(TYPE_FILES)
  files.set(FUNCTION_VIRTUAL_SOURCE_FILE, source)
  files.set(FUNCTION_DECLARATIONS_FILE, declarations)
  const system = createSystem(files)
  const { compilerHost } = createVirtualCompilerHost(
    system,
    COMPILER_OPTIONS,
    ts
  )
  const program = ts.createProgram(
    [FUNCTION_VIRTUAL_SOURCE_FILE, FUNCTION_DECLARATIONS_FILE],
    COMPILER_OPTIONS,
    compilerHost
  )
  const diagnostics = ts.getPreEmitDiagnostics(program).map(item => {
    const location =
      item.file && item.start !== undefined
        ? getDiagnosticLocation(item.file, item.start)
        : undefined
    return createBuildDiagnostic(
      `TS${item.code}`,
      ts.flattenDiagnosticMessageText(item.messageText, "\n"),
      location?.line,
      location?.column
    )
  })
  return limitDiagnostics(diagnostics)
}
