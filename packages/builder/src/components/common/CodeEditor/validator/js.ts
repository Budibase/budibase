import { Parser } from "acorn"
import { simple as walk } from "acorn-walk"

import { iifeWrapper } from "@budibase/string-templates"
import type { Diagnostic } from "@codemirror/lint"
import { CodeValidator } from "@/types"

export function validateJsTemplate(
  code: string,
  validations: CodeValidator
): Diagnostic[] {
  const diagnostics: Diagnostic[] = []

  try {
    // const helperUsages = new RegExp(/\bhelpers\.(\w)+\b/).exec(code)
    const ast = Parser.parse(iifeWrapper(code), {
      ecmaVersion: "latest",
      locations: true,
    })

    const lineOffsets: number[] = [0]
    let offset = 0
    for (const line of code.split("\n")) {
      lineOffsets.push(offset)
      offset += line.length + 1 // +1 for newline character
    }

    let hasReturnStatement = false
    walk(ast, {
      ReturnStatement(node) {
        hasReturnStatement = !!node.argument
      },
      CallExpression(node) {
        const callee: any = node.callee
        if (
          node.type === "CallExpression" &&
          callee.object?.name === "helpers" &&
          node.loc
        ) {
          const functionName = callee.property.name
          const from =
            lineOffsets[node.loc.start.line - 1] + node.loc.start.column
          const to = lineOffsets[node.loc.end.line - 1] + node.loc.end.column

          if (!(functionName in validations)) {
            diagnostics.push({
              from,
              to,
              severity: "warning",
              message: `"${functionName}" function does not exist.`,
            })
            return
          }

          const { arguments: expectedArguments } = validations[functionName]
          if (
            expectedArguments &&
            node.arguments.length !== expectedArguments.length
          ) {
            diagnostics.push({
              from,
              to,
              severity: "error",
              message: `Function "${functionName}" expects ${
                expectedArguments.length
              } parameters (${expectedArguments.join(", ")}), but got ${
                node.arguments.length
              }.`,
            })
          }
        }
      },
    })

    if (!hasReturnStatement) {
      diagnostics.push({
        from: 0,
        to: code.length,
        severity: "error",
        message: "Your code must return a value.",
      })
    }
  } catch (e: any) {
    diagnostics.push({
      from: 0,
      to: code.length,
      severity: "error",
      message: `Syntax error: ${e.message}`,
    })
  }

  return diagnostics
}
