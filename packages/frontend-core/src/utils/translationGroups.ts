import { getContext } from "svelte"
import { derived, readable, type Readable } from "svelte/store"
import {
  resolveTranslationGroup,
  resolveWorkspaceTranslations,
  type TranslationCategory,
  type TranslationGroup,
} from "@budibase/shared-core"

interface WorkspaceTranslationStore extends Readable<TranslationGroup> {}

interface CreateWorkspaceTranslationStoreOptions {
  appStore?: Readable<any> | null
}

export const createWorkspaceTranslationStore = (
  category: TranslationCategory,
  options?: CreateWorkspaceTranslationStoreOptions
): WorkspaceTranslationStore => {
  const sdk = (getContext("sdk") as any) ?? {}
  const contextStore = sdk?.appStore
  const providedStore = options?.appStore ?? contextStore

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
