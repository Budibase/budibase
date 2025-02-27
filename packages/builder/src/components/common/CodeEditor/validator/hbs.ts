/* global hbs */
import Handlebars from "handlebars"
import type { Diagnostic } from "@codemirror/lint"
import { CodeValidator } from "@/types"

function isMustacheStatement(
  node: hbs.AST.Statement
): node is hbs.AST.MustacheStatement {
  return node.type === "MustacheStatement"
}

function isBlockStatement(
  node: hbs.AST.Statement
): node is hbs.AST.BlockStatement {
  return node.type === "BlockStatement"
}

function isPathExpression(
  node: hbs.AST.Statement
): node is hbs.AST.PathExpression {
  return node.type === "PathExpression"
}

export function validateHbsTemplate(
  text: string,
  validations: CodeValidator
): Diagnostic[] {
  const diagnostics: Diagnostic[] = []

  try {
    const ast = Handlebars.parse(text, {})

    const lineOffsets: number[] = []
    let offset = 0
    for (const line of text.split("\n")) {
      lineOffsets.push(offset)
      offset += line.length + 1 // +1 for newline character
    }

    function traverseNodes(
      nodes: hbs.AST.Statement[],
      options?: {
        ignoreMissing?: boolean
      }
    ) {
      const ignoreMissing = options?.ignoreMissing || false
      nodes.forEach(node => {
        if (
          (isMustacheStatement(node) || isBlockStatement(node)) &&
          isPathExpression(node.path)
        ) {
          const helperName = node.path.original

          const from =
            lineOffsets[node.loc.start.line - 1] + node.loc.start.column
          const to = lineOffsets[node.loc.end.line - 1] + node.loc.end.column

          if (!(helperName in validations)) {
            if (!ignoreMissing) {
              diagnostics.push({
                from,
                to,
                severity: "warning",
                message: `"${helperName}" handler does not exist.`,
              })
            }
            return
          }

          const { arguments: expectedArguments = [], requiresBlock } =
            validations[helperName]

          if (requiresBlock && !isBlockStatement(node)) {
            diagnostics.push({
              from,
              to,
              severity: "error",
              message: `Helper "${helperName}" requires a body:\n{{#${helperName} ...}} [body] {{/${helperName}}}`,
            })
            return
          } else if (!requiresBlock && isBlockStatement(node)) {
            diagnostics.push({
              from,
              to,
              severity: "error",
              message: `Helper "${helperName}" should not contain a body.`,
            })
            return
          }

          let providedParamsCount = node.params.length
          if (isBlockStatement(node)) {
            // Block body counts as a parameter
            providedParamsCount++
          }

          const optionalArgMatcher = new RegExp(/^\[(.+)\]$/)
          const optionalArgs = expectedArguments.filter(a =>
            optionalArgMatcher.test(a)
          )

          if (
            !optionalArgs.length &&
            providedParamsCount !== expectedArguments.length
          ) {
            diagnostics.push({
              from,
              to,
              severity: "error",
              message: `Helper "${helperName}" expects ${
                expectedArguments.length
              } parameters (${expectedArguments.join(
                ", "
              )}), but got ${providedParamsCount}.`,
            })
          } else if (optionalArgs.length) {
            const maxArgs = expectedArguments.length
            const minArgs = maxArgs - optionalArgs.length
            if (
              minArgs > providedParamsCount ||
              maxArgs < providedParamsCount
            ) {
              const parameters = expectedArguments
                .map(a => {
                  const test = optionalArgMatcher.exec(a)
                  if (!test?.[1]) {
                    return a
                  }
                  return `${test[1]} (optional)`
                })
                .join(", ")
              diagnostics.push({
                from,
                to,
                severity: "error",
                message: `Helper "${helperName}" expects between ${minArgs} to ${expectedArguments.length} parameters (${parameters}), but got ${providedParamsCount}.`,
              })
            }
          }
        }

        if (isBlockStatement(node)) {
          traverseNodes(node.program.body, { ignoreMissing: true })
        }
      })
    }

    traverseNodes(ast.body, { ignoreMissing: true })
  } catch (e: any) {
    diagnostics.push({
      from: 0,
      to: text.length,
      severity: "error",
      message: `The handlebars code is not valid:\n${e.message}`,
    })
  }

  return diagnostics
}
