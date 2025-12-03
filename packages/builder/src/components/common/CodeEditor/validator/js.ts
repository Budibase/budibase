import { Parser } from "acorn"
import * as walk from "acorn-walk"

import type * as acorn from "acorn"
import type { Diagnostic } from "@codemirror/lint"
import type { CodeValidator } from "@/types"

const FUNCTION_NODE_TYPES = [
  "FunctionDeclaration",
  "FunctionExpression",
  "ArrowFunctionExpression",
  "MethodDefinition",
] as const

type FunctionNodeType = (typeof FUNCTION_NODE_TYPES)[number]

type FunctionLikeNode = Extract<acorn.AnyNode, { type: FunctionNodeType }>

const isFunctionNode = (node?: acorn.Node | null): node is FunctionLikeNode =>
  !!node && FUNCTION_NODE_TYPES.includes(node.type as FunctionNodeType)

const isProgramNode = (node?: acorn.Node | null): node is acorn.Program =>
  node?.type === "Program"

const isBlockStatement = (
  node?: acorn.Node | null
): node is acorn.BlockStatement => node?.type === "BlockStatement"

const isIfStatement = (node?: acorn.Node | null): node is acorn.IfStatement =>
  node?.type === "IfStatement"

const getHelperFunctionName = (callee: acorn.Expression | acorn.Super) => {
  if (
    callee.type !== "MemberExpression" ||
    callee.object.type !== "Identifier" ||
    callee.object.name !== "helpers"
  ) {
    return undefined
  }

  if (callee.property.type === "Identifier") {
    return callee.property.name
  }

  if (
    callee.property.type === "Literal" &&
    typeof callee.property.value === "string"
  ) {
    return callee.property.value
  }

  return undefined
}

export function validateJsTemplate(
  code: string,
  validations: CodeValidator
): Diagnostic[] {
  const diagnostics: Diagnostic[] = []

  try {
    const ast = Parser.parse(code, {
      ecmaVersion: "latest",
      locations: true,
      allowReturnOutsideFunction: true,
    })

    const lineOffsets: number[] = []
    let offset = 0
    for (const line of code.split("\n")) {
      lineOffsets.push(offset)
      offset += line.length + 1 // +1 for newline character
    }

    const isTopLevelReturn = (ancestors: acorn.Node[]) =>
      ancestors.length === 2 && isProgramNode(ancestors[0])

    const isReturnInTopLevelPlainElse = (ancestors: acorn.Node[]) => {
      if (ancestors.length < 2) {
        return false
      }

      let index = ancestors.length - 2
      let child: acorn.Node | undefined = ancestors[index + 1]
      let seenPlainElse = false

      while (index >= 0) {
        const parent = ancestors[index]

        if (isBlockStatement(parent)) {
          child = parent
          index -= 1
          continue
        }

        if (!isIfStatement(parent) || parent.alternate !== child) {
          break
        }

        if (!seenPlainElse) {
          if (isIfStatement(parent.alternate)) {
            return false
          }
          seenPlainElse = true
        }

        child = parent
        index -= 1
      }

      return seenPlainElse && index === 0 && isProgramNode(ancestors[0])
    }

    let hasReturnStatement = false
    walk.ancestor(ast, {
      ReturnStatement(node, _state, ancestors) {
        if (!node.argument) {
          return
        }

        const isInsideFunction = ancestors
          .slice(0, -1)
          .some(ancestor => isFunctionNode(ancestor))

        if (
          !isInsideFunction &&
          (isTopLevelReturn(ancestors) ||
            isReturnInTopLevelPlainElse(ancestors))
        ) {
          hasReturnStatement = true
        }
      },
      CallExpression(node) {
        if (!node.loc) {
          return
        }

        const functionName = getHelperFunctionName(node.callee)
        if (!functionName) {
          return
        }

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
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error"
    diagnostics.push({
      from: 0,
      to: code.length,
      severity: "error",
      message: `Syntax error: ${message}`,
    })
  }

  return diagnostics
}
