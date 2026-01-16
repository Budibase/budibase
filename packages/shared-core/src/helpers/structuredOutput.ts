/**
 * Normalizes a JSON schema to be compatible with OpenAI structured output.
 * This is the strictest format, so schemas that pass OpenAI validation should hopefully work with other .
 * Fixes:
 * - Adds `additionalProperties: false` to all object schemas (required by OpenAI)
 * - Converts `required: true` boolean to proper array format
 * - Ensures top-level type is "object" (wraps arrays if needed)
 */

export function normalizeSchemaForStructuredOutput(
  schema: Record<string, unknown>
): Record<string, unknown> {
  function processSchema(s: Record<string, unknown>): Record<string, unknown> {
    if (typeof s !== "object" || s === null) {
      return s
    }

    const result: Record<string, unknown> = { ...s }

    if (result.type === "object") {
      result.additionalProperties = false

      if (
        result.properties &&
        typeof result.properties === "object" &&
        result.properties !== null
      ) {
        const props = result.properties as Record<string, unknown>
        const requiredFields: string[] = []
        const processedProps: Record<string, unknown> = {}

        for (const [key, value] of Object.entries(props)) {
          if (typeof value === "object" && value !== null) {
            const propSchema = value as Record<string, unknown>
            if (propSchema.required === true) {
              requiredFields.push(key)
              const { required: _, ...rest } = propSchema
              processedProps[key] = processSchema(rest)
            } else {
              processedProps[key] = processSchema(propSchema)
            }
          } else {
            processedProps[key] = value
          }
        }

        result.properties = processedProps

        const existingRequired = Array.isArray(result.required)
          ? result.required
          : []
        const allRequired = [
          ...new Set([...existingRequired, ...requiredFields]),
        ]
        if (allRequired.length > 0) {
          result.required = allRequired
        } else {
          result.required = Object.keys(processedProps)
        }
      }
    }

    if (result.type === "array" && result.items) {
      if (typeof result.items === "object" && result.items !== null) {
        result.items = processSchema(result.items as Record<string, unknown>)
      }
    }

    for (const keyword of ["anyOf", "oneOf", "allOf"]) {
      if (Array.isArray(result[keyword])) {
        result[keyword] = (result[keyword] as Record<string, unknown>[]).map(
          item => processSchema(item)
        )
      }
    }

    return result
  }

  let processed = processSchema(schema)

  if (processed.type === "array") {
    processed = {
      type: "object",
      properties: {
        items: processed,
      },
      required: ["items"],
      additionalProperties: false,
    }
  } else if (processed.type !== "object") {
    processed = {
      type: "object",
      properties: {
        value: processed,
      },
      required: ["value"],
      additionalProperties: false,
    }
  }

  return processed
}
