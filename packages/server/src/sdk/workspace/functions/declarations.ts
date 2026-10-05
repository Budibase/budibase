import { createHash } from "crypto"
import type {
  FunctionInputDefinition,
  FunctionInputType,
  FunctionQueryCapability,
} from "@budibase/types"

const property = (value: string) => JSON.stringify(value)

const renderParameters = (parameterNames: readonly string[]) => {
  if (!parameterNames.length) {
    return "()"
  }
  const properties = [...parameterNames]
    .sort((a, b) => a.localeCompare(b))
    .map(name => `          readonly ${property(name)}: string | null`)
    .join("\n")
  return `(parameters: Readonly<{\n${properties}\n        }>)`
}

const renderQueries = (capabilities: FunctionQueryCapability[]) => {
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
        .map(
          query =>
            `      readonly ${property(query.queryAlias)}: ${renderParameters(query.parameterNames)} => Promise<JsonValue>`
        )
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

const renderInputDescription = (description?: string) => {
  if (!description) {
    return ""
  }
  const text = description.replace(/\*\//g, "* /").replace(/[\r\n]/g, " ")
  return `    /** ${text} */\n`
}

const renderInputProperty = (input: FunctionInputDefinition) => {
  const name = property(input.name)
  const type = inputTypes[input.type]
  return `${renderInputDescription(input.description)}    readonly ${name}?: ${type} | null`
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

export const hashFunctionDeclarations = ({
  declarations,
  inputSchema = [],
}: {
  declarations: string
  inputSchema?: readonly FunctionInputDefinition[]
}) => {
  const hash = createHash("sha256").update(declarations)
  if (inputSchema.length) {
    hash.update(
      JSON.stringify(
        [...inputSchema]
          .sort((a, b) => a.name.localeCompare(b.name))
          .map(({ name, type, description }) => ({
            name,
            type,
            description: description || "",
          }))
      )
    )
  }
  return hash.digest("hex")
}
