import type { OpenAPIV2, OpenAPIV3 } from "openapi-types"

type SchemaObject =
  | OpenAPIV3.SchemaObject
  | (OpenAPIV2.SchemaObject & { properties?: Record<string, any>; items?: any })

type BindingPrimitiveType = "string" | "integer" | "number" | "boolean"

export interface GeneratedRequestBody {
  body: any
  bindings: Record<string, string>
}

const MAX_DEPTH = 5
const BINDING_TOKEN_PREFIX = "__BUDIBASE_BINDING__"
const BINDING_TOKEN_REGEX = new RegExp(
  `"${BINDING_TOKEN_PREFIX}(string|integer|number|boolean)__([A-Za-z0-9_]+)__"`,
  "g"
)

const sanitizeSegment = (segment: string): string => {
  return segment.replace(/[^A-Za-z0-9_]/g, "_")
}

const buildBindingName = (path: string[]): string => {
  const sanitized = path
    .slice(1)
    .map(segment => sanitizeSegment(segment))
    .filter(segment => segment && segment !== "item")

  if (sanitized.length === 0) {
    const last = path[path.length - 1] ?? "value"
    sanitized.push(sanitizeSegment(last) || "value")
  }

  const joined = sanitized.join("_") || "value"
  if (/^[0-9]/.test(joined)) {
    return `_${joined}`
  }
  return joined
}

const createBindingPlaceholder = (
  key: string,
  type: BindingPrimitiveType
): { toJSON: () => string } => {
  return {
    toJSON() {
      return `${BINDING_TOKEN_PREFIX}${type}__${key}__`
    },
  }
}

const defaultValueForType = (type: BindingPrimitiveType): string => {
  switch (type) {
    case "boolean":
      return "false"
    case "integer":
    case "number":
      return "0"
    default:
      return ""
  }
}

const asArray = <T>(value: T | T[] | undefined): T[] => {
  if (!value) {
    return []
  }
  return Array.isArray(value) ? value : [value]
}

const pickSchema = (schema: SchemaObject | undefined): SchemaObject | undefined => {
  if (!schema) {
    return undefined
  }
  if (Array.isArray((schema as OpenAPIV3.SchemaObject).allOf)) {
    const merged = (schema as OpenAPIV3.SchemaObject).allOf?.reduce(
      (acc: SchemaObject | undefined, current) => {
        const resolved = pickSchema(current as SchemaObject)
        if (!resolved) {
          return acc
        }
        if (!acc) {
          return { ...resolved }
        }
        const next: any = { ...acc }
        if (resolved.properties) {
          next.properties = { ...(next.properties || {}), ...resolved.properties }
        }
        if (resolved.required) {
          next.required = Array.from(
            new Set([...(next.required || []), ...resolved.required])
          )
        }
        if (resolved.type && !next.type) {
          next.type = resolved.type
        }
        if (resolved.items && !next.items) {
          next.items = resolved.items
        }
        return next
      },
      undefined
    )
    if (merged) {
      return merged
    }
  }
  if (Array.isArray((schema as OpenAPIV3.SchemaObject).oneOf)) {
    const [first] = asArray((schema as OpenAPIV3.SchemaObject).oneOf)
    if (first) {
      return pickSchema(first as SchemaObject)
    }
  }
  if (Array.isArray((schema as OpenAPIV3.SchemaObject).anyOf)) {
    const [first] = asArray((schema as OpenAPIV3.SchemaObject).anyOf)
    if (first) {
      return pickSchema(first as SchemaObject)
    }
  }
  return schema
}

const getSchemaType = (schema: SchemaObject | undefined): string | undefined => {
  if (!schema) {
    return undefined
  }
  const type = (schema as any).type
  if (Array.isArray(type)) {
    return type[0]
  }
  if (!type) {
    if ((schema as any).properties) {
      return "object"
    }
    if ((schema as any).items) {
      return "array"
    }
  }
  return type
}

const getRequiredProperties = (schema: SchemaObject | undefined): string[] => {
  if (!schema) {
    return []
  }
  const required = (schema as any).required
  return Array.isArray(required) ? required : []
}

const getProperties = (
  schema: SchemaObject | undefined
): Record<string, SchemaObject> => {
  if (!schema) {
    return {}
  }
  const properties = (schema as any).properties
  if (!properties || typeof properties !== "object") {
    return {}
  }
  return properties as Record<string, SchemaObject>
}

const getItemsSchema = (schema: SchemaObject | undefined): SchemaObject | undefined => {
  if (!schema) {
    return undefined
  }
  const items = (schema as any).items
  if (!items) {
    return undefined
  }
  if (Array.isArray(items)) {
    return pickSchema(items[0] as SchemaObject)
  }
  return pickSchema(items as SchemaObject)
}

const normalisePrimitiveType = (type: string | undefined): BindingPrimitiveType => {
  if (type === "integer" || type === "number" || type === "boolean") {
    return type
  }
  return "string"
}

const getPrimitiveDefaultFromSchema = (
  schema: SchemaObject | undefined,
  type: BindingPrimitiveType
): string => {
  if (schema) {
    const candidate = (schema as any).example ?? (schema as any).default
    if (candidate !== undefined && candidate !== null) {
      return String(candidate)
    }
    const enumValues = (schema as any).enum
    if (Array.isArray(enumValues) && enumValues.length > 0) {
      const [first] = enumValues
      if (first !== undefined && first !== null) {
        return String(first)
      }
    }
  }
  return defaultValueForType(type)
}

interface BuildResult {
  value: any
  bindings: Record<string, string>
}

const mergeBindings = (
  target: Record<string, string>,
  source: Record<string, string>
) => {
  for (const [key, value] of Object.entries(source)) {
    if (!(key in target)) {
      target[key] = value
    }
  }
}

const createPrimitiveBindingResult = (
  path: string[],
  type: BindingPrimitiveType,
  defaultValue: string
): BuildResult => {
  const key = buildBindingName(path)
  return {
    value: createBindingPlaceholder(key, type),
    bindings: { [key]: defaultValue },
  }
}

const buildFromSchema = (
  schema: SchemaObject | undefined,
  path: string[],
  depth: number,
  seen: Set<SchemaObject>
): BuildResult => {
  const resolved = pickSchema(schema)
  if (!resolved) {
    const type = normalisePrimitiveType(undefined)
    return createPrimitiveBindingResult(path, type, defaultValueForType(type))
  }

  if (seen.has(resolved)) {
    const type = normalisePrimitiveType(getSchemaType(resolved))
    return createPrimitiveBindingResult(
      path,
      type,
      getPrimitiveDefaultFromSchema(resolved, type)
    )
  }

  if (depth > MAX_DEPTH) {
    const type = normalisePrimitiveType(getSchemaType(resolved))
    return createPrimitiveBindingResult(
      path,
      type,
      getPrimitiveDefaultFromSchema(resolved, type)
    )
  }

  seen.add(resolved)

  const type = getSchemaType(resolved)

  if (type === "object") {
    const properties = getProperties(resolved)
    const propertyNames = Object.keys(properties)
    const includeOptional = propertyNames.length > 0 && propertyNames.length <= 10

    let selectedProperties = includeOptional
      ? propertyNames
      : getRequiredProperties(resolved).filter(property =>
          propertyNames.includes(property)
        )

    if (selectedProperties.length === 0) {
      selectedProperties = propertyNames.slice(0, 1)
    }

    if (selectedProperties.length === 0) {
      seen.delete(resolved)
      return { value: {}, bindings: {} }
    }

    const objectValue: Record<string, any> = {}
    const bindings: Record<string, string> = {}

    for (const property of selectedProperties) {
      const propertySchema = pickSchema(properties[property])
      const child = buildFromSchema(
        propertySchema,
        [...path, property],
        depth + 1,
        seen
      )
      if (child.value === undefined) {
        const fallback = createPrimitiveBindingResult(
          [...path, property],
          "string",
          defaultValueForType("string")
        )
        objectValue[property] = fallback.value
        mergeBindings(bindings, fallback.bindings)
      } else {
        objectValue[property] = child.value
        mergeBindings(bindings, child.bindings)
      }
    }

    seen.delete(resolved)
    return { value: objectValue, bindings }
  }

  if (type === "array") {
    const itemSchema = getItemsSchema(resolved)
    const child = buildFromSchema(
      itemSchema,
      [...path, "item"],
      depth + 1,
      seen
    )
    const arrayValue = child.value === undefined ? [] : [child.value]
    seen.delete(resolved)
    return { value: arrayValue, bindings: child.bindings }
  }

  const primitiveType = normalisePrimitiveType(type)
  const result = createPrimitiveBindingResult(
    path,
    primitiveType,
    getPrimitiveDefaultFromSchema(resolved, primitiveType)
  )
  seen.delete(resolved)
  return result
}

const buildFromExample = (
  example: unknown,
  path: string[],
  depth: number,
  seen: WeakSet<object>
): BuildResult => {
  if (depth > MAX_DEPTH) {
    return createPrimitiveBindingResult(
      path,
      "string",
      defaultValueForType("string")
    )
  }

  if (
    example === null ||
    example === undefined ||
    typeof example === "bigint" ||
    typeof example === "symbol" ||
    typeof example === "function"
  ) {
    return { value: example, bindings: {} }
  }

  if (typeof example === "string") {
    return createPrimitiveBindingResult(path, "string", example)
  }

  if (typeof example === "number") {
    return createPrimitiveBindingResult(path, "number", String(example))
  }

  if (typeof example === "boolean") {
    return createPrimitiveBindingResult(path, "boolean", example ? "true" : "false")
  }

  if (typeof example !== "object") {
    return { value: example, bindings: {} }
  }

  if (seen.has(example as object)) {
    return createPrimitiveBindingResult(
      path,
      "string",
      defaultValueForType("string")
    )
  }

  seen.add(example as object)

  if (Array.isArray(example)) {
    if (example.length === 0) {
      seen.delete(example as object)
      return { value: [], bindings: {} }
    }
    const child = buildFromExample(example[0], [...path, "item"], depth + 1, seen)
    seen.delete(example as object)
    return {
      value: child.value === undefined ? [] : [child.value],
      bindings: child.bindings,
    }
  }

  const objectValue: Record<string, any> = {}
  const bindings: Record<string, string> = {}

  for (const [key, value] of Object.entries(example as Record<string, any>)) {
    const child = buildFromExample(value, [...path, key], depth + 1, seen)
    if (child.value !== undefined) {
      objectValue[key] = child.value
    } else {
      objectValue[key] = value
    }
    mergeBindings(bindings, child.bindings)
  }

  seen.delete(example as object)
  return { value: objectValue, bindings }
}

export const generateRequestBodyFromSchema = (
  schema: SchemaObject | undefined,
  rootName = "body"
): GeneratedRequestBody | undefined => {
  if (!schema) {
    return undefined
  }
  const seen = new Set<SchemaObject>()
  const result = buildFromSchema(schema, [rootName], 0, seen)
  if (result.value === undefined) {
    return undefined
  }
  return { body: result.value, bindings: result.bindings }
}

export const generateRequestBodyFromExample = (
  example: unknown,
  rootName = "body"
): GeneratedRequestBody | undefined => {
  if (example === undefined) {
    return undefined
  }
  const seen = new WeakSet<object>()
  const result = buildFromExample(example, [rootName], 0, seen)
  if (result.value === undefined) {
    return undefined
  }
  return { body: result.value, bindings: result.bindings }
}

export const serialiseRequestBody = (body: unknown): string | undefined => {
  if (body === undefined) {
    return undefined
  }
  if (typeof body === "string") {
    return body
  }
  const json = JSON.stringify(body, null, 2)
  if (typeof json !== "string") {
    return undefined
  }
  return json.replace(BINDING_TOKEN_REGEX, (_match, type, key) => {
    const binding = `{{ ${key} }}`
    if (type === "string") {
      return `"${binding}"`
    }
    return binding
  })
}
