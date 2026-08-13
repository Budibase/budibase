import type { CaretPositionFn, InsertAtPositionFn } from "@budibase/types"
import type { AgentTool } from "../../toolTypes"

export const insertOperationToolBinding = ({
  tool,
  instructions,
  getCaretPosition,
  insertAtPos,
}: {
  tool: AgentTool
  instructions: string
  getCaretPosition?: CaretPositionFn
  insertAtPos?: InsertAtPositionFn
}) => {
  if (!tool.readableBinding) {
    return instructions
  }

  const current = instructions || ""
  const caret = getCaretPosition?.() || {
    start: current.length,
    end: current.length,
  }
  const binding = `{{ ${tool.readableBinding} }}`
  const nextInstructions =
    current.slice(0, caret.start) + binding + current.slice(caret.end)

  insertAtPos?.({
    start: caret.start,
    end: caret.end,
    value: binding,
    cursor: { anchor: caret.start + binding.length },
  })

  return nextInstructions
}

export const removeOperationToolBinding = ({
  instructions,
  readableBinding,
}: {
  instructions: string
  readableBinding: string
}) =>
  (instructions || "")
    .replace(
      new RegExp(
        `\\{\\{\\s*${readableBinding.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*\\}\\}`,
        "g"
      ),
      ""
    )
    .replace(/\n{3,}/g, "\n\n")
