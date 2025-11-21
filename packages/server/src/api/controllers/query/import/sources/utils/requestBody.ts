import type { OpenAPIV2, OpenAPIV3 } from "openapi-types"

type ReferenceObject = OpenAPIV3.ReferenceObject | OpenAPIV2.ReferenceObject

type SchemaObject =
  | (OpenAPIV3.SchemaObject & SchemaAugmentations)
  | (OpenAPIV2.SchemaObject & SchemaAugmentations)

interface SchemaAugmentations {
  properties?: Record<string, SchemaObject | ReferenceObject>
  items?: SchemaItems
  allOf?: Array<SchemaObject | ReferenceObject>
  oneOf?: Array<SchemaObject | ReferenceObject>
  anyOf?: Array<SchemaObject | ReferenceObject>
}

type SchemaItems =
  | SchemaObject
  | ReferenceObject
  | Array<SchemaObject | ReferenceObject>

type BindingPrimitiveType = "string" | "integer" | "number" | "boolean"

interface BindingPlaceholder {
  toJSON: () => string
}

export interface GeneratedRequestBody {
  body: unknown
  bindings: Record<string, string>
}

export type FormDataParameter = OpenAPIV2.ParameterObject & {
  in: "formData"
  name: string
}

const MAX_DEPTH = 5
export const BINDING_TOKEN_PREFIX = "__BUDIBASE_BINDING__"
const BINDING_TOKEN_REGEX = new RegExp(
  `"${BINDING_TOKEN_PREFIX}(string|integer|number|boolean)__([A-Za-z0-9_]+)__"`,
  "g"
)

const BINDING_VALUE_REGEX = new RegExp(
  `${BINDING_TOKEN_PREFIX}(string|integer|number|boolean)__([A-Za-z0-9_]+)__`
)

const sanitizeSegment = (segment: string): string => {
  return segment.replace(/[^A-Za-z0-9_]/g, "_")
}

const isReferenceObject = (value: unknown): value is ReferenceObject => {
  if (!value || typeof value !== "object") {
    return false
  }
  return "$ref" in (value as Record<string, unknown>)
}

const toSchemaObject = (
  value: SchemaObject | ReferenceObject | undefined
): SchemaObject | undefined => {
  if (!value || isReferenceObject(value)) {
    return undefined
  }
  return value
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
): BindingPlaceholder => {
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

const pickSchema = (
  schema: SchemaObject | ReferenceObject | undefined
): SchemaObject | undefined => {
  const resolvedSchema = toSchemaObject(schema)
  if (!resolvedSchema) {
    return undefined
  }

  if (Array.isArray(resolvedSchema.allOf) && resolvedSchema.allOf.length > 0) {
    const merged = resolvedSchema.allOf.reduce<SchemaObject | undefined>(
      (accumulator, current) => {
        const candidate = pickSchema(current)
        if (!candidate) {
          return accumulator
        }
        if (!accumulator) {
          return { ...candidate }
        }

        const next: SchemaObject = { ...accumulator }

        const mergedProperties = {
          ...getProperties(accumulator),
          ...getProperties(candidate),
        }
        if (Object.keys(mergedProperties).length > 0) {
          next.properties = mergedProperties as SchemaObject["properties"]
        }

        const accumulatorRequired = accumulator.required ?? []
        const candidateRequired = candidate.required ?? []
        const mergedRequired = new Set([
          ...accumulatorRequired,
          ...candidateRequired,
        ])
        if (mergedRequired.size > 0) {
          next.required = Array.from(mergedRequired)
        }

        if (!next.type && candidate.type) {
          next.type = candidate.type
        }
        if (next.items === undefined && candidate.items !== undefined) {
          next.items = candidate.items
        }
        return next
      },
      undefined
    )
    if (merged) {
      return merged
    }
  }

  if (Array.isArray(resolvedSchema.oneOf)) {
    const [first] = resolvedSchema.oneOf
    if (first) {
      return pickSchema(first)
    }
  }

  if (Array.isArray(resolvedSchema.anyOf)) {
    const [first] = resolvedSchema.anyOf
    if (first) {
      return pickSchema(first)
    }
  }

  return resolvedSchema
}

const getSchemaType = (
  schema: SchemaObject | undefined
): string | undefined => {
  if (!schema) {
    return undefined
  }
  const { type } = schema
  if (Array.isArray(type)) {
    return type[0]
  }
  if (!type) {
    if (Object.keys(getProperties(schema)).length > 0) {
      return "object"
    }
    if (getItemsSchema(schema)) {
      return "array"
    }
  }
  return typeof type === "string" ? type : undefined
}

const getRequiredProperties = (schema: SchemaObject | undefined): string[] => {
  if (!schema?.required) {
    return []
  }
  return Array.isArray(schema.required) ? [...schema.required] : []
}

const getProperties = (
  schema: SchemaObject | undefined
): Record<string, SchemaObject> => {
  if (!schema?.properties) {
    return {}
  }
  const entries = Object.entries(schema.properties)
  const result: Record<string, SchemaObject> = {}
  for (const [key, value] of entries) {
    const propertySchema = toSchemaObject(value)
    if (propertySchema) {
      result[key] = propertySchema
    }
  }
  return result
}

const getItemsSchema = (
  schema: SchemaObject | undefined
): SchemaObject | undefined => {
  if (!schema) {
    return undefined
  }
  const items = schema.items
  if (!items) {
    return undefined
  }
  if (Array.isArray(items)) {
    const candidates = items as Array<SchemaObject | ReferenceObject>
    for (const item of candidates) {
      const schemaItem = pickSchema(item)
      if (schemaItem) {
        return schemaItem
      }
    }
    return undefined
  }
  return pickSchema(items as SchemaObject | ReferenceObject)
}

const normalisePrimitiveType = (
  type: string | undefined
): BindingPrimitiveType => {
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
    if (schema.example !== undefined && schema.example !== null) {
      return String(schema.example)
    }
    if (schema.default !== undefined && schema.default !== null) {
      return String(schema.default)
    }
    const enumValues = schema.enum
    if (Array.isArray(enumValues) && enumValues.length > 0) {
      const [first] = enumValues
      if (first !== undefined && first !== null) {
        return String(first)
      }
    }
  }
  return defaultValueForType(type)
}

interface BuildOptions {
  totalLimit?: number
}

interface BuildResult {
  value: unknown
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
  seen: Set<SchemaObject>,
  options: BuildOptions
): BuildResult => {
  const { totalLimit = 12 } = options
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
    if (propertyNames.length === 0) {
      seen.delete(resolved)
      return { value: {}, bindings: {} }
    }

    const requiredProperties = getRequiredProperties(resolved).filter(
      property => propertyNames.includes(property)
    )

    const optionalProperties = propertyNames.filter(
      property => !requiredProperties.includes(property)
    )

    let optionalSelection: string[] = []
    if (optionalProperties.length > 0) {
      const remainingCapacity = Math.max(
        totalLimit - requiredProperties.length,
        0
      )
      if (remainingCapacity > 0) {
        optionalSelection = optionalProperties.slice(0, remainingCapacity)
      }
    }

    let selectedProperties = [...requiredProperties, ...optionalSelection]

    const uniqueSelected = new Set(selectedProperties)
    selectedProperties = Array.from(uniqueSelected)

    if (selectedProperties.length === 0) {
      selectedProperties = propertyNames.slice(0, 1)
    }

    const objectValue: Record<string, unknown> = {}
    const bindings: Record<string, string> = {}

    for (const property of selectedProperties) {
      const propertySchema = pickSchema(properties[property])
      const child = buildFromSchema(
        propertySchema,
        [...path, property],
        depth + 1,
        seen,
        options
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
      seen,
      options
    )
    const arrayValue: unknown[] = child.value === undefined ? [] : [child.value]
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
    return createPrimitiveBindingResult(
      path,
      "boolean",
      example ? "true" : "false"
    )
  }

  if (typeof example !== "object") {
    return { value: example, bindings: {} }
  }

  const exampleObject = example as object
  if (seen.has(exampleObject)) {
    return createPrimitiveBindingResult(
      path,
      "string",
      defaultValueForType("string")
    )
  }

  seen.add(exampleObject)

  if (Array.isArray(example)) {
    if (example.length === 0) {
      seen.delete(exampleObject)
      return { value: [], bindings: {} }
    }
    const child = buildFromExample(
      example[0],
      [...path, "item"],
      depth + 1,
      seen
    )
    seen.delete(exampleObject)
    return {
      value: child.value === undefined ? [] : [child.value],
      bindings: child.bindings,
    }
  }

  const objectValue: Record<string, unknown> = {}
  const bindings: Record<string, string> = {}

  const exampleRecord = example as Record<string, unknown>
  for (const [key, value] of Object.entries(exampleRecord)) {
    const child = buildFromExample(value, [...path, key], depth + 1, seen)
    if (child.value !== undefined) {
      objectValue[key] = child.value
    } else {
      objectValue[key] = value
    }
    mergeBindings(bindings, child.bindings)
  }

  seen.delete(exampleObject)
  return { value: objectValue, bindings }
}

export const generateRequestBodyFromSchema = (
  schema:
    | OpenAPIV2.SchemaObject
    | OpenAPIV3.SchemaObject
    | SchemaObject
    | undefined,
  rootName = "body",
  options: BuildOptions = {}
): GeneratedRequestBody | undefined => {
  const resolvedSchema = pickSchema(
    schema as SchemaObject | ReferenceObject | undefined
  )
  if (!resolvedSchema) {
    return undefined
  }
  const seen = new Set<SchemaObject>()
  const buildOptions: BuildOptions = {
    totalLimit: options.totalLimit ?? 12,
  }
  const result = buildFromSchema(
    resolvedSchema,
    [rootName],
    0,
    seen,
    buildOptions
  )
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

const cloneSerializableRequestBody = (value: unknown): unknown => {
  if (value == null) {
    return value
  }

  if (Array.isArray(value)) {
    return value.map(item => cloneSerializableRequestBody(item))
  }

  if (typeof value === "object") {
    const binding = extractBindingFromPlaceholder(value)
    if (binding) {
      return `{{ ${binding} }}`
    }
    return Object.entries(value as Record<string, unknown>).reduce(
      (acc, [key, child]) => {
        acc[key] = cloneSerializableRequestBody(child)
        return acc
      },
      {} as Record<string, unknown>
    )
  }

  return value
}

export const buildSerializableRequestBody = (body: unknown): unknown => {
  if (body === undefined) {
    return undefined
  }
  return cloneSerializableRequestBody(body)
}

const extractBindingFromPlaceholder = (value: unknown): string | undefined => {
  if (!value || typeof value !== "object") {
    return undefined
  }
  const candidate = value as { toJSON?: () => unknown }
  if (typeof candidate.toJSON !== "function") {
    return undefined
  }
  const token = candidate.toJSON()
  if (typeof token !== "string") {
    return undefined
  }
  const match = token.match(BINDING_VALUE_REGEX)
  if (!match) {
    return undefined
  }
  return match[2]
}

const buildFormKey = (path: string[]): string => {
  if (path.length === 0) {
    return ""
  }
  const [first, ...rest] = path
  let key = first
  for (const segment of rest) {
    if (segment === "item") {
      key += "[]"
      continue
    }
    key += `[${segment}]`
  }
  return key
}

const collectKeyValuePairs = (
  value: unknown,
  path: string[],
  accumulator: Record<string, string>
) => {
  if (value === undefined || value === null) {
    return
  }

  if (Array.isArray(value)) {
    value.forEach(item =>
      collectKeyValuePairs(item, [...path, "item"], accumulator)
    )
    return
  }

  const binding = extractBindingFromPlaceholder(value)
  if (binding) {
    const key = buildFormKey(path)
    if (key) {
      accumulator[key] = `{{ ${binding} }}`
    }
    return
  }

  if (typeof value === "object") {
    for (const [childKey, childValue] of Object.entries(
      value as Record<string, unknown>
    )) {
      collectKeyValuePairs(childValue, [...path, childKey], accumulator)
    }
    return
  }

  const key = buildFormKey(path)
  if (key) {
    accumulator[key] = String(value)
  }
}

export const buildKeyValueRequestBody = (
  body: unknown
): Record<string, string> | undefined => {
  if (!body || typeof body !== "object") {
    return undefined
  }

  const accumulator: Record<string, string> = {}
  for (const [key, value] of Object.entries(body as Record<string, unknown>)) {
    collectKeyValuePairs(value, [key], accumulator)
  }

  if (Object.keys(accumulator).length === 0) {
    return undefined
  }

  return accumulator
}

const toFormDataParameter = (param: FormDataParameter): FormDataParameter => {
  if (param.type) {
    return param
  }
  return {
    ...param,
    type: "string",
  }
}

export const buildRequestBodyFromFormDataParameters = (
  params: FormDataParameter[]
): GeneratedRequestBody | undefined => {
  if (!Array.isArray(params) || params.length === 0) {
    return undefined
  }

  const body: Record<string, unknown> = {}
  const bindings: Record<string, string> = {}

  for (const param of params) {
    const normalized = toFormDataParameter(param)
    if (!normalized?.name) {
      continue
    }
    const type = normalisePrimitiveType(normalized.type)
    const defaultValue = normalized.default
      ? String(normalized.default)
      : defaultValueForType(type)
    const { value, bindings: paramBindings } = createPrimitiveBindingResult(
      ["form", normalized.name],
      type,
      defaultValue
    )
    body[normalized.name] = value
    mergeBindings(bindings, paramBindings)
  }

  if (Object.keys(body).length === 0) {
    return undefined
  }

  return { body, bindings }
}
