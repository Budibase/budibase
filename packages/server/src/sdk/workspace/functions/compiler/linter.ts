import ts from "typescript"
import type { FunctionBuildDiagnostic } from "@budibase/types"
import {
  FUNCTION_VIRTUAL_MODULE,
  FUNCTION_VIRTUAL_SOURCE_FILE,
} from "./constants"
import {
  createBuildDiagnostic,
  getDiagnosticLocation,
  limitDiagnostics,
} from "./diagnostics"

export const lintFunctionSource = (
  source: string
): FunctionBuildDiagnostic[] => {
  const sourceFile = ts.createSourceFile(
    FUNCTION_VIRTUAL_SOURCE_FILE,
    source,
    ts.ScriptTarget.ES2022,
    true,
    ts.ScriptKind.TS
  )
  const diagnostics: FunctionBuildDiagnostic[] = []
  let defaultEntrypoints = 0

  const addNodeDiagnostic = (code: string, message: string, node: ts.Node) => {
    const location = getDiagnosticLocation(
      sourceFile,
      node.getStart(sourceFile)
    )
    diagnostics.push(
      createBuildDiagnostic(code, message, location.line, location.column)
    )
  }

  const visit = (node: ts.Node) => {
    if (ts.isImportDeclaration(node)) {
      const moduleName = ts.isStringLiteral(node.moduleSpecifier)
        ? node.moduleSpecifier.text
        : node.moduleSpecifier.getText(sourceFile)
      if (moduleName !== FUNCTION_VIRTUAL_MODULE) {
        addNodeDiagnostic(
          "FUNCTION_IMPORT_NOT_ALLOWED",
          `Importing '${moduleName}' is not allowed.`,
          node
        )
      }
    }

    if (ts.isExportDeclaration(node) && node.moduleSpecifier) {
      const moduleName = ts.isStringLiteral(node.moduleSpecifier)
        ? node.moduleSpecifier.text
        : node.moduleSpecifier.getText(sourceFile)
      addNodeDiagnostic(
        "FUNCTION_IMPORT_NOT_ALLOWED",
        `Re-exporting '${moduleName}' is not allowed.`,
        node
      )
    }

    if (ts.isImportEqualsDeclaration(node)) {
      addNodeDiagnostic(
        "FUNCTION_IMPORT_NOT_ALLOWED",
        "Import assignments are not allowed.",
        node
      )
    }

    if (
      ts.isCallExpression(node) &&
      node.expression.kind === ts.SyntaxKind.ImportKeyword
    ) {
      addNodeDiagnostic(
        "FUNCTION_DYNAMIC_IMPORT_NOT_ALLOWED",
        "Dynamic imports are not allowed.",
        node
      )
    }

    if (
      ts.isCallExpression(node) &&
      ts.isIdentifier(node.expression) &&
      node.expression.text === "require"
    ) {
      addNodeDiagnostic(
        "FUNCTION_IMPORT_NOT_ALLOWED",
        "CommonJS imports are not allowed.",
        node
      )
    }

    ts.forEachChild(node, visit)
  }

  for (const statement of sourceFile.statements) {
    const modifiers = ts.canHaveModifiers(statement)
      ? ts.getModifiers(statement)
      : undefined
    const isDefault = modifiers?.some(
      modifier => modifier.kind === ts.SyntaxKind.DefaultKeyword
    )

    if (isDefault) {
      defaultEntrypoints++
      const isAsyncFunction =
        ts.isFunctionDeclaration(statement) &&
        !statement.asteriskToken &&
        modifiers?.some(
          modifier => modifier.kind === ts.SyntaxKind.AsyncKeyword
        )
      if (!isAsyncFunction) {
        addNodeDiagnostic(
          "FUNCTION_ENTRYPOINT_INVALID",
          "The default export must be an async function declaration.",
          statement
        )
      }
    }

    if (ts.isExportAssignment(statement)) {
      defaultEntrypoints++
      const expression = statement.expression
      const modifiers = ts.canHaveModifiers(expression)
        ? ts.getModifiers(expression)
        : undefined
      const isAsyncFunction =
        (ts.isArrowFunction(expression) ||
          ts.isFunctionExpression(expression)) &&
        !(ts.isFunctionExpression(expression) && expression.asteriskToken) &&
        modifiers?.some(
          modifier => modifier.kind === ts.SyntaxKind.AsyncKeyword
        )
      if (!isAsyncFunction) {
        addNodeDiagnostic(
          "FUNCTION_ENTRYPOINT_INVALID",
          "The default export must be an async function.",
          statement
        )
      }
    }

    visit(statement)
  }

  if (defaultEntrypoints !== 1) {
    diagnostics.push(
      createBuildDiagnostic(
        "FUNCTION_ENTRYPOINT_INVALID",
        "A Function must have exactly one default async entrypoint."
      )
    )
  }

  return limitDiagnostics(diagnostics)
}
