import { createHash } from "crypto"
import type { FunctionQueryCapability } from "@budibase/types"

const property = (value: string) => JSON.stringify(value)

const renderParameters = (parameterNames: string[]) => {
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

export const generateFunctionDeclarations = (
  capabilities: FunctionQueryCapability[]
) => {
  const queries = renderQueries(capabilities)
  return `declare module "@budibase/functions" {
  export type JsonValue =
    | string
    | number
    | boolean
    | null
    | JsonValue[]
    | { [key: string]: JsonValue }

  export const inputs: Readonly<Record<string, JsonValue>>
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

export const hashFunctionDeclarations = (declarations: string) => {
  return createHash("sha256").update(declarations).digest("hex")
}
