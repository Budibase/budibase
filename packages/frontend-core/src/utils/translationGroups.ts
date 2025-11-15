import { getContext } from "svelte"
import { get, type Readable } from "svelte/store"
import {
  resolveTranslationGroup,
  resolveWorkspaceTranslations,
  type TranslationCategory,
  type TranslationOverrides,
} from "@budibase/shared-core"

type TranslationStoreValue = {
  translationOverrides?: TranslationOverrides | null
  application?: { translationOverrides?: TranslationOverrides | null } | null
}

interface LoadTranslationsByGroupOptions {
  appStore?: Readable<TranslationStoreValue> | null
  overrides?: TranslationOverrides | null
}

interface SDKContext {
  appStore?: Readable<TranslationStoreValue> | null
}

export const loadTranslationsByGroup = (
  category: TranslationCategory,
  options?: LoadTranslationsByGroupOptions
): Record<string, string> => {
  const sdk = getContext<SDKContext | undefined>("sdk")
  const appStore = options?.appStore ?? sdk?.appStore
  const storeValue = appStore ? get(appStore) : undefined

  const overrides = options?.overrides
    ? resolveWorkspaceTranslations(options.overrides)
    : resolveWorkspaceTranslations(
        storeValue?.translationOverrides ??
          storeValue?.application?.translationOverrides
      )

  return resolveTranslationGroup(category, overrides)
}
