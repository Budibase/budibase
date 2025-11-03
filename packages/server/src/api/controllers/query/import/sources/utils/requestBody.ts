import type { OpenAPIV2, OpenAPIV3 } from "openapi-types"

type SchemaObject =
  | OpenAPIV3.SchemaObject
  | (OpenAPIV2.SchemaObject & { properties?: Record<string, any>; items?: any })

const MAX_DEPTH = 5

const sanitizeSegment = (segment: string): string => {
  return segment.replace(/[^A-Za-z0-9_]/g, "_")
}

const buildBindingName = (path: string[]): string => {
  const sanitized = path
    .map(segment => sanitizeSegment(segment))
    .filter(Boolean)
    .join("_")
  return sanitized || "value"
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

const primitiveFromSchema = (
  schema: SchemaObject | undefined,
  path: string[]
): any => {
  if (!schema) {
    return `{{${buildBindingName(path)}}}`
  }

  const candidate = (schema as any).example ?? (schema as any).default
  if (candidate !== undefined) {
    return candidate
  }

  const enumValues = (schema as any).enum
  if (Array.isArray(enumValues) && enumValues.length > 0) {
    return enumValues[0]
  }

  return `{{${buildBindingName(path)}}}`
}

const buildFromSchema = (
  schema: SchemaObject | undefined,
  path: string[],
  depth: number,
  seen: Set<SchemaObject>
): any => {
  const resolved = pickSchema(schema)
  if (!resolved) {
    return undefined
  }

  if (seen.has(resolved)) {
    return `{{${buildBindingName(path)}}}`
  }

  if (depth > MAX_DEPTH) {
    return `{{${buildBindingName(path)}}}`
  }

  seen.add(resolved)

  const type = getSchemaType(resolved)

  let result: any

  if (type === "object") {
    const properties = getProperties(resolved)
    let required = getRequiredProperties(resolved)
    if (required.length === 0) {
      required = Object.keys(properties).slice(0, 1)
    }

    if (required.length === 0) {
      result = {}
      seen.delete(resolved)
      return result
    }

    const objectValue: Record<string, any> = {}

    for (const property of required) {
      const propertySchema = pickSchema(properties[property])
      const value = buildFromSchema(
        propertySchema,
        [...path, property],
        depth + 1,
        seen
      )
      objectValue[property] =
        value === undefined ? `{{${buildBindingName([...path, property])}}}` : value
    }

    result = objectValue
    seen.delete(resolved)
    return result
  }

  if (type === "array") {
    const itemSchema = getItemsSchema(resolved)
    const itemValue = buildFromSchema(
      itemSchema,
      [...path, "item"],
      depth + 1,
      seen
    )
    result = itemValue === undefined ? [] : [itemValue]
    seen.delete(resolved)
    return result
  }

  if (type === "boolean") {
    const primitive = primitiveFromSchema(resolved, path)
    if (typeof primitive === "boolean") {
      result = primitive
      seen.delete(resolved)
      return result
    }
    result = primitive === undefined ? false : primitive
    seen.delete(resolved)
    return result
  }

  if (type === "integer" || type === "number") {
    const primitive = primitiveFromSchema(resolved, path)
    if (typeof primitive === "number") {
      result = primitive
      seen.delete(resolved)
      return result
    }
    result = primitive
    seen.delete(resolved)
    return result
  }

  result = primitiveFromSchema(resolved, path)
  seen.delete(resolved)
  return result
}

export const generateRequestBodyFromSchema = (
  schema: SchemaObject | undefined,
  rootName = "body"
): any => {
  const seen = new Set<SchemaObject>()
  const value = buildFromSchema(schema, [rootName], 0, seen)
  if (value === undefined) {
    return undefined
  }
  return value
}
