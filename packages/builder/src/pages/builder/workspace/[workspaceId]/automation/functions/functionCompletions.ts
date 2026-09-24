import type { FunctionQueryCapability } from "@budibase/types"

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
