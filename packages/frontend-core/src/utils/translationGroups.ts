import { getContext } from "svelte"
import { derived, readable, type Readable } from "svelte/store"
import {
  resolveTranslationGroup,
  resolveWorkspaceTranslations,
  type TranslationCategory,
  type TranslationOverrides,
} from "@budibase/shared-core"

type TranslationGroup = Record<string, string>

interface WorkspaceTranslationStore extends Readable<TranslationGroup> {}

type TranslationStoreValue = {
  translationOverrides?: TranslationOverrides | null
  application?: { translationOverrides?: TranslationOverrides | null } | null
}

interface CreateWorkspaceTranslationStoreOptions {
  appStore?: Readable<TranslationStoreValue> | null
}

export const createWorkspaceTranslationStore = (
  category: TranslationCategory,
  options?: CreateWorkspaceTranslationStoreOptions
): WorkspaceTranslationStore => {
  const sdk = (getContext("sdk") as any) ?? {}
  const contextStore = sdk?.appStore as
    | Readable<TranslationStoreValue>
    | undefined
  const providedStore = (options?.appStore ?? contextStore) as
    | Readable<TranslationStoreValue>
    | null
    | undefined

  if (providedStore && typeof providedStore.subscribe === "function") {
    return derived(providedStore, value => {
      const overrides = resolveWorkspaceTranslations(
        value?.translationOverrides ?? value?.application?.translationOverrides
      )
      return resolveTranslationGroup(category, overrides)
    })
  }

  return readable(resolveTranslationGroup(category))
}
