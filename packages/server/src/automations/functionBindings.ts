import { findHBSBlocks, processStringSync } from "@budibase/string-templates"
import type { ArrayHandling } from "@budibase/string-templates"
import type { FunctionInputDefinition, JSONValue } from "@budibase/types"

export const processFunctionBindings = ({
  inputs,
  inputSchema,
  context,
}: {
  inputs: Record<string, JSONValue>
  inputSchema: readonly FunctionInputDefinition[]
  context: object
}): Record<string, JSONValue> => {
  const processValue = ({
    value,
    arrayHandling,
  }: {
    value: JSONValue
    arrayHandling: ArrayHandling
  }): JSONValue => {
    if (typeof value === "string") {
      const bindings = findHBSBlocks(value)
      const standalone = bindings.length === 1 && bindings[0] === value.trim()
      return processStringSync(standalone ? value.trim() : value, context, {
        arrayHandling: standalone ? arrayHandling : "stringify",
      })
    }
    if (Array.isArray(value)) {
      return value.map(child =>
        processValue({ value: child, arrayHandling: "preserve" })
      )
    }
    if (value && typeof value === "object") {
      return Object.fromEntries(
        Object.entries(value).map(([key, child]) => [
          key,
          processValue({ value: child, arrayHandling: "preserve" }),
        ])
      )
    }
    return value
  }

  return Object.fromEntries(
    Object.entries(inputs).map(([key, value]) => {
      const input = inputSchema.find(input => input.name === key)
      return [
        key,
        processValue({
          value,
          arrayHandling: input?.type === "string" ? "stringify" : "preserve",
        }),
      ]
    })
  )
}
