import ts from "typescript"
import type { FunctionBuildDiagnostic } from "@budibase/types"
import {
  MAX_FUNCTION_BUILD_DIAGNOSTICS,
  MAX_FUNCTION_BUILD_DIAGNOSTIC_MESSAGE_LENGTH,
} from "./constants"

export const createBuildDiagnostic = (
  code: string,
  message: string,
  line?: number,
  column?: number
): FunctionBuildDiagnostic => ({
  code,
  message: message.slice(0, MAX_FUNCTION_BUILD_DIAGNOSTIC_MESSAGE_LENGTH),
  line,
  column,
})

export const getDiagnosticLocation = (
  sourceFile: ts.SourceFile,
  position: number
) => {
  const location = sourceFile.getLineAndCharacterOfPosition(position)
  return {
    line: location.line + 1,
    column: location.character + 1,
  }
}

export const limitDiagnostics = (diagnostics: FunctionBuildDiagnostic[]) =>
  diagnostics.slice(0, MAX_FUNCTION_BUILD_DIAGNOSTICS)
