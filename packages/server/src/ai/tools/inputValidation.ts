import { asSchema, type FlexibleSchema } from "@ai-sdk/provider-utils"
import type { JSONSchema7, JSONSchema7Definition } from "json-schema"

interface NormalizedInput {
  changed: boolean
  value: unknown
}

const unwrapBackticks = (value: string) => {
  if (value.length < 3 || !value.startsWith("`") || !value.endsWith("`")) {
    return value
  }
  return value.slice(1, -1)
}

const asJsonSchema = (
  definition: JSONSchema7Definition | undefined
): JSONSchema7 | undefined =>
  definition && typeof definition === "object" ? definition : undefined

const normalizeValue = (
  value: unknown,
  schema?: JSONSchema7
): NormalizedInput => {
  if (Array.isArray(value)) {
    const itemSchema = Array.isArray(schema?.items)
      ? undefined
      : asJsonSchema(schema?.items)
    const normalizedItems = value.map(item => normalizeValue(item, itemSchema))
    return {
      changed: normalizedItems.some(item => item.changed),
      value: normalizedItems.map(item => item.value),
    }
  }
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return { changed: false, value }
  }

  const properties = schema?.properties ?? {}
  let changed = false
  const normalized = Object.fromEntries(
    Object.entries(value).map(([key, child]) => {
      const unwrapped = unwrapBackticks(key)
      const canonicalKey =
        unwrapped !== key && unwrapped in properties && !(unwrapped in value)
          ? unwrapped
          : key
      if (canonicalKey !== key) {
        changed = true
      }
      const childSchema = asJsonSchema(properties[canonicalKey])
      const normalizedChild = normalizeValue(child, childSchema)
      changed ||= normalizedChild.changed
      return [canonicalKey, normalizedChild.value]
    })
  )
  return { changed, value: normalized }
}

export const normalizeToolInputKeys = (
  value: unknown,
  schema: JSONSchema7
): NormalizedInput => normalizeValue(value, schema)

export const normalizeToolInputForSchema = async (
  value: unknown,
  schema: FlexibleSchema
) => normalizeToolInputKeys(value, await asSchema(schema).jsonSchema)
