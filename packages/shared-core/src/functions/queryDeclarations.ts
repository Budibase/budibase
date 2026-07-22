import { FieldType, Query, QuerySchema } from "@budibase/types"

/**
 * Best-effort translation of a saved query's response schema into TypeScript
 * declarations, used to improve linked-query completions inside Functions
 * (Functions Alpha, spec O2).
 *
 * This is intentionally conservative: any schema that is missing, ambiguous,
 * unsupported, too deep, too wide or too large falls back to `JsonValue`. A
 * fallback is always a sound over-approximation, so it can never make an
 * unsupported response shape look typed. Runtime response validation and
 * capability limits are unaffected by anything in this module.
 */

// The JsonValue alias that every generated declaration bundle can rely on as a
// safe fallback. Emitted once alongside the query declarations.
export const JSON_VALUE_DECLARATION = `type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue }`

export const JSON_VALUE = "JsonValue"

export interface DeclarationLimits {
  // Maximum number of fields translated per object before falling back.
  maxFields: number
  // Maximum nesting depth for JSON/nested schemas before falling back.
  maxDepth: number
  // Maximum size, in characters, of a single query's response type.
  maxChars: number
}

export const DEFAULT_LIMITS: DeclarationLimits = {
  maxFields: 100,
  maxDepth: 4,
  maxChars: 8000,
}

export interface QueryResponseDeclaration {
  // TypeScript type for the resolved response value of the query.
  type: string
  // True when the whole type, or any part of it, fell back to JsonValue.
  fallback: boolean
}

const normaliseField = (field: QuerySchema | string): QuerySchema =>
  typeof field === "string" ? { type: field } : field

// Primitive field types that translate to a single, sound TypeScript primitive.
const PRIMITIVE_TYPES: Partial<Record<FieldType, string>> = {
  [FieldType.STRING]: "string",
  [FieldType.LONGFORM]: "string",
  [FieldType.OPTIONS]: "string",
  [FieldType.BARCODEQR]: "string",
  [FieldType.BIGINT]: "string",
  [FieldType.DATETIME]: "string",
  [FieldType.NUMBER]: "number",
  [FieldType.BOOLEAN]: "boolean",
}

// Field types that are reliably arrays of strings.
const STRING_ARRAY_TYPES = new Set<FieldType>([
  FieldType.ARRAY,
  FieldType.BB_REFERENCE,
])

interface TranslateContext {
  limits: DeclarationLimits
  nestedSchemaFields: Query["nestedSchemaFields"]
  // Set when any fallback occurs during translation.
  fellBack: boolean
}

const fieldToType = (
  fieldName: string,
  field: QuerySchema,
  depth: number,
  ctx: TranslateContext
): string => {
  const type = field.type as FieldType

  const primitive = PRIMITIVE_TYPES[type]
  if (primitive) {
    return primitive
  }

  if (STRING_ARRAY_TYPES.has(type)) {
    return "string[]"
  }

  if (type === FieldType.JSON) {
    const nested = ctx.nestedSchemaFields?.[fieldName]
    if (nested && depth < ctx.limits.maxDepth) {
      return objectType(nested, depth + 1, ctx)
    }
    // Missing nested metadata, or too deep: fall back.
    ctx.fellBack = true
    return JSON_VALUE
  }

  // Unsupported / ambiguous / complex types (link, formula, ai, attachments,
  // auto, etc.) are not safe to narrow.
  ctx.fellBack = true
  return JSON_VALUE
}

const objectType = (
  schema: Record<string, QuerySchema | string>,
  depth: number,
  ctx: TranslateContext
): string => {
  const entries = Object.entries(schema)
  if (entries.length === 0 || entries.length > ctx.limits.maxFields) {
    ctx.fellBack = true
    return JSON_VALUE
  }

  const members = entries.map(([name, rawField]) => {
    const field = normaliseField(rawField)
    const tsType = fieldToType(name, field, depth, ctx)
    return `${JSON.stringify(name)}: ${tsType}`
  })

  return `{ ${members.join("; ")} }`
}

/**
 * Translate a saved query into the TypeScript type of its resolved response.
 * Queries return an array of rows, so the happy path is `Array<{ ... }>`.
 */
export const queryResponseType = (
  query: Pick<Query, "schema" | "nestedSchemaFields">,
  limits: DeclarationLimits = DEFAULT_LIMITS
): QueryResponseDeclaration => {
  if (!query.schema || Object.keys(query.schema).length === 0) {
    return { type: `${JSON_VALUE}`, fallback: true }
  }

  const ctx: TranslateContext = {
    limits,
    nestedSchemaFields: query.nestedSchemaFields,
    fellBack: false,
  }

  const rowType = objectType(query.schema, 1, ctx)
  const type = `Array<${rowType}>`

  // Bound total complexity/compiler cost: oversized types fall back wholesale.
  if (type.length > limits.maxChars) {
    return { type: JSON_VALUE, fallback: true }
  }

  return { type, fallback: ctx.fellBack }
}

/**
 * The full async declaration a Function author sees for a linked query, e.g.
 * `(params?: Record<string, JsonValue>) => Promise<Array<{ ... }>>`.
 * Always a valid `Promise<...>` (and specifically `Promise<JsonValue>` on
 * fallback).
 */
export const queryFunctionDeclaration = (
  query: Pick<Query, "schema" | "nestedSchemaFields">,
  limits: DeclarationLimits = DEFAULT_LIMITS
): QueryResponseDeclaration => {
  const response = queryResponseType(query, limits)
  return {
    type: `(params?: Record<string, ${JSON_VALUE}>) => Promise<${response.type}>`,
    fallback: response.fallback,
  }
}

// Deterministic 32-bit FNV-1a hash, rendered as hex. Used to fold the effective
// response declarations into a Function's declarationsHash so that a query
// schema change flips affected Functions to "Build required".
export const hashDeclarations = (declarations: string[]): string => {
  let hash = 0x811c9dc5
  const input = declarations.join("\u0000")
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i)
    hash = Math.imul(hash, 0x01000193)
  }
  return (hash >>> 0).toString(16).padStart(8, "0")
}
