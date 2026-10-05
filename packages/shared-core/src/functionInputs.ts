import type {
  FunctionInputDefinition,
  FunctionInputType,
  JSONValue,
} from "@budibase/types"

export const FUNCTION_INPUT_TYPES: FunctionInputType[] = [
  "string",
  "number",
  "boolean",
  "object",
  "array",
]
export const MAX_FUNCTION_INPUTS = 100
export const MAX_FUNCTION_INPUT_NAME_LENGTH = 128
export const MAX_FUNCTION_INPUT_DESCRIPTION_LENGTH = 1024

export const validateFunctionInputSchema = (
  inputSchema: readonly FunctionInputDefinition[]
): string[] => {
  const errors: string[] = []
  const names = new Set<string>()
  if (inputSchema.length > MAX_FUNCTION_INPUTS) {
    errors.push(`Functions support up to ${MAX_FUNCTION_INPUTS} inputs.`)
  }
  inputSchema.forEach((input, index) => {
    const label = `Input ${index + 1}`
    if (
      !/^[A-Za-z_$][A-Za-z0-9_$]*$/.test(input.name) ||
      input.name.length > MAX_FUNCTION_INPUT_NAME_LENGTH
    ) {
      errors.push(
        `${label}: use a valid identifier of up to ${MAX_FUNCTION_INPUT_NAME_LENGTH} characters.`
      )
    }
    if (names.has(input.name)) {
      errors.push(`${label}: input names must be unique.`)
    }
    names.add(input.name)
    if (!FUNCTION_INPUT_TYPES.includes(input.type)) {
      errors.push(`${label}: select a supported type.`)
    }
    if (
      input.description &&
      input.description.length > MAX_FUNCTION_INPUT_DESCRIPTION_LENGTH
    ) {
      errors.push(
        `${label}: descriptions cannot exceed ${MAX_FUNCTION_INPUT_DESCRIPTION_LENGTH} characters.`
      )
    }
  })
  return errors
}

export const getFunctionInputError = ({
  inputSchema = [],
  inputs,
}: {
  inputSchema?: readonly FunctionInputDefinition[]
  inputs: Record<string, JSONValue>
}): string | undefined => {
  for (const input of inputSchema) {
    const present = Object.prototype.hasOwnProperty.call(inputs, input.name)
    if (!present) {
      continue
    }
    const value = inputs[input.name]
    if (value === null) {
      continue
    }
    let valid: boolean
    if (input.type === "array") {
      valid = Array.isArray(value)
    } else if (input.type === "object") {
      valid =
        value !== null && typeof value === "object" && !Array.isArray(value)
    } else {
      valid = typeof value === input.type
    }
    if (!valid) {
      return `Input "${input.name}" must be of type ${input.type}.`
    }
  }
}
