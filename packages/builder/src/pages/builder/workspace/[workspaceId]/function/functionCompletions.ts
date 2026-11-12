import { renderQueryResponseFields } from "@budibase/shared-core"
import type {
  FunctionInputDefinition,
  FunctionQueryCapability,
  FunctionQueryCatalogEntry,
} from "@budibase/types"

interface FunctionQueryCompletion {
  label: string
  parameterNames: readonly string[]
  info?: string
}

export const getFunctionEditorCapabilities = ({
  capabilities,
  catalog,
}: {
  capabilities: FunctionQueryCapability[]
  catalog: FunctionQueryCatalogEntry[]
}): FunctionQueryCapability[] => {
  const queries = new Map(catalog.map(query => [query.queryId, query]))
  return capabilities.map(capability => {
    const query = queries.get(capability.queryId)
    if (!query) {
      return capability
    }
    return {
      ...capability,
      parameterNames: query.parameters.map(parameter => parameter.name),
      responseSchema: query.responseSchema,
    }
  })
}

export const getFunctionDatasourceCompletions = (
  capabilities: FunctionQueryCapability[]
) => [...new Set(capabilities.map(item => item.datasourceAlias))]

export const getFunctionQueryCompletions = (
  capabilities: FunctionQueryCapability[],
  datasourceAlias: string
) =>
  capabilities
    .filter(item => item.datasourceAlias === datasourceAlias)
    .map((item): FunctionQueryCompletion => {
      const completion = {
        label: item.queryAlias,
        parameterNames: item.parameterNames,
      }
      if (!item.responseSchema) {
        return completion
      }
      const fields = renderQueryResponseFields({ schema: item.responseSchema })
      return {
        ...completion,
        info: fields
          ? `Returns rows under data with optional, nullable fields:\n${fields.join("\n")}`
          : "Returns JsonValue",
      }
    })

export const getFunctionInputCompletions = (
  inputSchema: readonly FunctionInputDefinition[]
) =>
  inputSchema.map(input => ({
    label: input.name,
    type: "property",
    detail: `${input.type} | null`,
  }))

export const getFunctionReferenceCompletions = ({
  inputSchema,
  capabilities,
}: {
  inputSchema: readonly FunctionInputDefinition[]
  capabilities: FunctionQueryCapability[]
}) => [
  { label: "inputs", type: "variable", detail: "Function inputs" },
  { label: "queries", type: "variable", detail: "Linked queries" },
  ...getFunctionInputCompletions(inputSchema).map(input => ({
    ...input,
    displayLabel: `inputs.${input.label}`,
    apply: `inputs.${input.label}`,
  })),
  ...getFunctionDatasourceCompletions(capabilities).map(datasourceAlias => ({
    label: datasourceAlias,
    displayLabel: `queries.${datasourceAlias}`,
    apply: `queries.${datasourceAlias}`,
    type: "property",
  })),
  ...capabilities.map(capability => ({
    label: capability.queryAlias,
    displayLabel: `queries.${capability.datasourceAlias}.${capability.queryAlias}`,
    apply: `queries.${capability.datasourceAlias}.${capability.queryAlias}`,
    type: "function",
    detail: `(${capability.parameterNames.join(", ")})`,
  })),
]
