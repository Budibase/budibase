import { getFunctionInputError } from "@budibase/shared-core"
import { findHBSBlocks } from "@budibase/string-templates"
import type { FunctionInputDefinition, JSONValue } from "@budibase/types"

interface ParsedFunctionInput {
  value?: JSONValue
  error?: string
}

export const parseFunctionInputValue = ({
  input,
  text,
}: {
  input: FunctionInputDefinition
  text?: string
}): ParsedFunctionInput => {
  if (text === undefined || text === "") {
    return {}
  }
  if (input.type === "string" || findHBSBlocks(text).length) {
    return { value: text }
  }
  try {
    const value: JSONValue = JSON.parse(text)
    const error = getFunctionInputError({
      inputSchema: [input],
      inputs: { [input.name]: value },
    })
    return { value, error }
  } catch {
    return { error: `Input "${input.name}" must be of type ${input.type}.` }
  }
}
