import type {
  FunctionInputDefinition,
  FunctionQueryCapability,
  FunctionQueryCatalogEntry,
  FunctionQueryResponseFieldType,
} from "@budibase/types"

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
    return {
      ...capability,
      parameterNames: query?.parameters.map(parameter => parameter.name) || [],
      responseSchema: query?.responseSchema,
    }
  })
}

const responseFieldTypes: Record<FunctionQueryResponseFieldType, string> = {
  string: "string",
  number: "number",
  boolean: "boolean",
  json: "JsonValue",
  array: "JsonValue[]",
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
    .map(item => ({
      label: item.queryAlias,
      parameterNames: item.parameterNames,
      ...(item.responseSchema && {
        info: `Returns rows under data with optional, nullable fields:\n${item.responseSchema.fields
          .map(
            field =>
              `${JSON.stringify(field.name)}?: ${responseFieldTypes[field.type]} | null`
          )
          .join("\n")}`,
      }),
    }))

export const getFunctionInputCompletions = (
  inputSchema: readonly FunctionInputDefinition[]
) =>
  inputSchema.map(input => ({
    label: input.name,
    type: "property",
    detail: `${input.type} | null`,
  }))
