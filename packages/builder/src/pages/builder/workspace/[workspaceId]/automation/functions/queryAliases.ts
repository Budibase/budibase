import type {
  FunctionQueryCapabilityInput,
  FunctionQueryCatalogEntry,
} from "@budibase/types"

const IDENTIFIER_PATTERN = /^[A-Za-z_$][A-Za-z0-9_$]*$/

export interface FunctionQueryAliasErrors {
  datasourceAlias?: string
  queryAlias?: string
}

const getIdentifierError = (alias: string) => {
  if (!alias) {
    return "Enter an alias."
  }
  if (alias.length > 128) {
    return "Aliases must be 128 characters or fewer."
  }
  if (!IDENTIFIER_PATTERN.test(alias)) {
    return "Use a JavaScript identifier, for example customerData."
  }
  return undefined
}

export const toFunctionQueryAlias = (name: string, fallback: string) => {
  const words = name.match(/[A-Za-z0-9_$]+/g) || []
  const alias = words
    .map((word, index) => {
      const normalised = word.replace(/^[0-9]+/, "")
      if (!normalised) {
        return ""
      }
      return index === 0
        ? normalised[0].toLowerCase() + normalised.slice(1)
        : normalised[0].toUpperCase() + normalised.slice(1)
    })
    .join("")
  return alias || fallback
}

export const validateFunctionQueryAliases = (
  capabilities: FunctionQueryCapabilityInput[],
  catalog: FunctionQueryCatalogEntry[]
): FunctionQueryAliasErrors[] => {
  const errors = capabilities.map(capability => ({
    datasourceAlias: getIdentifierError(capability.datasourceAlias),
    queryAlias: getIdentifierError(capability.queryAlias),
  }))
  const catalogByQueryId = new Map(catalog.map(entry => [entry.queryId, entry]))
  const datasourceByAlias = new Map<string, string>()
  const aliasByDatasource = new Map<string, string>()
  const queryAliases = new Map<string, number>()

  capabilities.forEach((capability, index) => {
    const entry = catalogByQueryId.get(capability.queryId)
    if (entry) {
      const existingDatasource = datasourceByAlias.get(
        capability.datasourceAlias
      )
      if (existingDatasource && existingDatasource !== entry.datasourceId) {
        errors[index].datasourceAlias =
          "This alias is already used by another datasource."
      } else {
        datasourceByAlias.set(capability.datasourceAlias, entry.datasourceId)
      }

      const existingAlias = aliasByDatasource.get(entry.datasourceId)
      if (existingAlias && existingAlias !== capability.datasourceAlias) {
        errors[index].datasourceAlias =
          "Use the same alias for every query from this datasource."
      } else {
        aliasByDatasource.set(entry.datasourceId, capability.datasourceAlias)
      }
    }

    const fullAlias = `${capability.datasourceAlias}.${capability.queryAlias}`
    const existingQueryIndex = queryAliases.get(fullAlias)
    if (existingQueryIndex !== undefined) {
      errors[index].queryAlias =
        "This query alias is already linked for this datasource."
      errors[existingQueryIndex].queryAlias =
        "This query alias is already linked for this datasource."
    } else {
      queryAliases.set(fullAlias, index)
    }
  })

  return errors
}

export const hasFunctionQueryAliasErrors = (
  errors: FunctionQueryAliasErrors[]
) => errors.some(error => !!error.datasourceAlias || !!error.queryAlias)
