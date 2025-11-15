export type TranslationCategory =
  | "userMenu"
  | "profileModal"
  | "passwordModal"
  | "picker"

export interface TranslationDefinitionInput {
  key: string
  name: string
  defaultValue: string
  fullKey?: string
}

export interface TranslationDefinition
  extends Omit<TranslationDefinitionInput, "fullKey"> {
  category: TranslationCategory
  fullKey: string
}

export type TranslationOverrides = Record<string, string>

/**
 * Converts raw translation definitions into fully-qualified definitions
 * by adding category and resolving `fullKey`. If `fullKey` already exists,
 * it is reused; otherwise, it's generated as `category.key`.
 */
export const createTranslationDefinitions = (
  category: TranslationCategory,
  definitions: ReadonlyArray<TranslationDefinitionInput>
): TranslationDefinition[] => {
  return definitions.map(definition => {
    const fullKey =
      definition.fullKey ??
      (definition.key.includes(".")
        ? definition.key
        : `${category}.${definition.key}`)

    return {
      key: definition.key,
      name: definition.name,
      defaultValue: definition.defaultValue,
      category,
      fullKey,
    }
  })
}
