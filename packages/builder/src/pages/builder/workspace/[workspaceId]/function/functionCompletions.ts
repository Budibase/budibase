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
    detail: `${input.type}${input.required ? "" : " | null (optional)"}`,
    info: input.description,
  }))
