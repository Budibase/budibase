import type {
  FunctionInputDefinition,
  FunctionInputType,
  FunctionQueryCapability,
  FunctionQueryResponseFieldType,
  FunctionQueryResponseSchema,
} from "@budibase/types"

const encoder = new TextEncoder()
const byteLength = (value: string) => encoder.encode(value).length

export const FUNCTION_QUERY_RESPONSE_LIMITS = {
  maxFields: 100,
  maxFieldNameLength: 256,
  maxTypeBytes: 16 * 1024,
  maxTotalTypeBytes: 64 * 1024,
} as const

const responseFieldTypes: Record<FunctionQueryResponseFieldType, string> = {
  string: "string",
  number: "number",
  boolean: "boolean",
  json: "JsonValue",
  array: "JsonValue[]",
}

const renderQueryResponseObjectType = (properties: string[]) =>
  `Record<string, JsonValue> & { data: { ${properties.join("; ")} }[] }`

export const renderQueryResponseFields = ({
  schema,
}: {
  schema?: FunctionQueryResponseSchema
}): string[] | undefined => {
  if (
    !schema?.fields.length ||
    schema.fields.length > FUNCTION_QUERY_RESPONSE_LIMITS.maxFields
  ) {
    return undefined
  }
  const names = new Set<string>()
  const properties: string[] = []
  let bytes = 0
  for (const field of [...schema.fields].sort((a, b) =>
    a.name.localeCompare(b.name)
  )) {
    if (
      typeof field.name !== "string" ||
      field.name.length > FUNCTION_QUERY_RESPONSE_LIMITS.maxFieldNameLength ||
      names.has(field.name) ||
      !Object.prototype.hasOwnProperty.call(responseFieldTypes, field.type)
    ) {
      return undefined
    }
    names.add(field.name)
    const property = `${JSON.stringify(field.name)}?: ${responseFieldTypes[field.type]} | null`
    bytes += byteLength(property)
    if (bytes > FUNCTION_QUERY_RESPONSE_LIMITS.maxTypeBytes) {
      return undefined
    }
    properties.push(property)
  }
  const type = renderQueryResponseObjectType(properties)
  return byteLength(type) > FUNCTION_QUERY_RESPONSE_LIMITS.maxTypeBytes
    ? undefined
    : properties
}

export const renderQueryResponseType = ({
  schema,
}: {
  schema?: FunctionQueryResponseSchema
}): string => {
  const properties = renderQueryResponseFields({ schema })
  return properties ? renderQueryResponseObjectType(properties) : "JsonValue"
}

const property = (value: string) => JSON.stringify(value)

const renderParameters = (parameterNames: readonly string[]) => {
  if (!parameterNames.length) {
    return "()"
  }
  const properties = [...parameterNames]
    .sort((a, b) => a.localeCompare(b))
    .map(name => `          readonly ${property(name)}?: string | null`)
    .join("\n")
  return `(parameters?: Readonly<{\n${properties}\n        }>)`
}

const renderQueries = (capabilities: FunctionQueryCapability[]) => {
  let responseTypeBytes = 0
  const grouped = new Map<string, FunctionQueryCapability[]>()
  for (const capability of capabilities) {
    const queries = grouped.get(capability.datasourceAlias) || []
    queries.push(capability)
    grouped.set(capability.datasourceAlias, queries)
  }

  return [...grouped.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([datasourceAlias, queries]) => {
      const renderedQueries = queries
        .sort((a, b) => a.queryAlias.localeCompare(b.queryAlias))
        .map(query => {
          let responseType = renderQueryResponseType({
            schema: query.responseSchema,
          })
          const bytes = byteLength(responseType)
          if (
            responseTypeBytes + bytes >
            FUNCTION_QUERY_RESPONSE_LIMITS.maxTotalTypeBytes
          ) {
            responseType = "JsonValue"
          } else {
            responseTypeBytes += bytes
          }
          return `      readonly ${property(query.queryAlias)}: ${renderParameters(query.parameterNames)} => Promise<${responseType}>`
        })
        .join("\n")
      return `    readonly ${property(datasourceAlias)}: Readonly<{\n${renderedQueries}\n    }>`
    })
    .join("\n")
}

const inputTypes: Record<FunctionInputType, string> = {
  string: "string",
  number: "number",
  boolean: "boolean",
  object: "Record<string, JsonValue>",
  array: "JsonValue[]",
}

const renderInputProperty = (input: FunctionInputDefinition) => {
  const name = property(input.name)
  const type = inputTypes[input.type]
  return `    readonly ${name}?: ${type} | null`
}

const renderInputs = (inputSchema: readonly FunctionInputDefinition[]) => {
  if (!inputSchema.length) {
    return "export const inputs: Readonly<Record<string, JsonValue>>"
  }
  const properties = [...inputSchema]
    .sort((a, b) => a.name.localeCompare(b.name))
    .map(renderInputProperty)
    .join("\n")
  return `export interface GeneratedInputs {
${properties}
  }

  export const inputs: Readonly<GeneratedInputs>`
}

export const generateFunctionDeclarations = ({
  capabilities,
  inputSchema = [],
}: {
  capabilities: FunctionQueryCapability[]
  inputSchema?: readonly FunctionInputDefinition[]
}) => {
  const queries = renderQueries(capabilities)
  return `declare module "@budibase/functions" {
  export type JsonValue =
    | string
    | number
    | boolean
    | null
    | JsonValue[]
    | { [key: string]: JsonValue }

  ${renderInputs(inputSchema)}
  export const queries: Readonly<{
${queries}
  }>

  export interface FunctionResult {
    output: Record<string, JsonValue>
    status?: "success" | "error" | "stopped"
  }
}
`
}
