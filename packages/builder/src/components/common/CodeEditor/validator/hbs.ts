/* global hbs */
import Handlebars from "handlebars"
import { EditorView } from "@codemirror/view"
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

export async function validateHbsTemplate(
  editor: EditorView,
  template: string,
  validations: CodeValidator
): Promise<Diagnostic[]> {
  const diagnostics: Diagnostic[] = []

  try {
    const ast = Handlebars.parse(template, {})

    function traverseNodes(
      nodes: hbs.AST.Statement[],
      options?: {
        ignoreMissing?: boolean
      }
    ) {
      const ignoreMissing = options?.ignoreMissing || false
      nodes.forEach(node => {
        if (isMustacheStatement(node) && isPathExpression(node.path)) {
          const helperName = node.path.original

          const from =
            editor.state.doc.line(node.loc.start.line).from +
            node.loc.start.column
          const to =
            editor.state.doc.line(node.loc.end.line).from + node.loc.end.column

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
          }

          const providedParams = node.params

          if (providedParams.length !== expectedArguments.length) {
            diagnostics.push({
              from,
              to,
              severity: "error",
              message: `Helper "${helperName}" expects ${
                expectedArguments.length
              } parameters (${expectedArguments.join(", ")}), but got ${
                providedParams.length
              }.`,
            })
          }
        }

        if (isBlockStatement(node)) {
          traverseNodes(node.program.body, { ignoreMissing: true })
        }
      })
    }

    traverseNodes(ast.body)
  } catch (e: any) {
    diagnostics.push({
      from: 0,
      to: template.length,
      severity: "error",
      message: `Syntax error: ${e.message}`,
    })
  }

  return diagnostics
}
