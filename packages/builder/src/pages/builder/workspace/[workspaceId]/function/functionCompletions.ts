import type {
  FunctionInputDefinition,
  FunctionQueryCapability,
} from "@budibase/types"

export const getFunctionDatasourceCompletions = (
  capabilities: FunctionQueryCapability[]
) => [...new Set(capabilities.map(item => item.datasourceAlias))]

export const getFunctionQueryCompletions = (
  capabilities: FunctionQueryCapability[],
  datasourceAlias: string
) =>
  capabilities
    .filter(item => item.datasourceAlias === datasourceAlias)
    .map(item => ({
      label: item.queryAlias,
      parameterNames: item.parameterNames,
    }))

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
