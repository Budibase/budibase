import { userMenuTranslations } from "./userMenu"
import { profileModalTranslations } from "./profileModal"
import { passwordModalTranslations } from "./passwordModal"
import { pickerTranslations } from "./picker"
import type {
  TranslationCategory,
  TranslationDefinition,
  TranslationOverrides,
} from "./types"

export * from "./types"
export {
  userMenuTranslations,
  profileModalTranslations,
  passwordModalTranslations,
  pickerTranslations,
}

// Central export of all translation definitions across modules.
// Add new translation modules to this list.
export const translations: TranslationDefinition[] = [
  ...userMenuTranslations,
  ...profileModalTranslations,
  ...passwordModalTranslations,
  ...pickerTranslations,
]

// Build a category -> translation[] lookup for efficient access.
const translationsByCategory = translations.reduce(
  (acc, definition) => {
    if (!acc[definition.category]) {
      acc[definition.category] = []
    }
    acc[definition.category].push(definition)
    return acc
  },
  {} as Record<TranslationCategory, TranslationDefinition[]>
)

const translationLookup = translations.reduce((acc, definition) => {
  acc.set(definition.fullKey, definition)
  return acc
}, new Map<string, TranslationDefinition>())

export const UI_TRANSLATIONS = translations

// Filter out invalid overrides: must be strings and correspond to known keys.
export const filterValidTranslationOverrides = (
  source?: TranslationOverrides | null
): TranslationOverrides => {
  if (!source) {
    return {}
  }

  return Object.entries(source).reduce((acc, [key, value]) => {
    if (typeof value !== "string") {
      return acc
    }
    if (!translationLookup.has(key)) {
      return acc
    }

    acc[key] = value
    return acc
  }, {} as TranslationOverrides)
}

export const resolveWorkspaceTranslations = (
  source?: TranslationOverrides | null
): TranslationOverrides => {
  return filterValidTranslationOverrides(source)
}

export const resolveTranslationGroup = (
  category: TranslationCategory,
  overrides?: TranslationOverrides | null
): Record<string, string> => {
  const definitionsForCategory = translationsByCategory[category] || []
  const safeOverrides = (() => {
    if (!overrides) {
      return {}
    }
    const isSanitized = Object.entries(overrides).every(([key, value]) => {
      return translationLookup.has(key) && typeof value === "string"
    })
    return isSanitized ? overrides : filterValidTranslationOverrides(overrides)
  })()

  return definitionsForCategory.reduce(
    (acc, definition) => {
      const override = safeOverrides[definition.fullKey]
      acc[definition.key] = override ?? definition.defaultValue
      return acc
    },
    {} as Record<string, string>
  )
}
