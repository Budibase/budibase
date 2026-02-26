import { derived } from "svelte/store"
import { appStore } from "../app"
import { builderStore } from "../builder"
import { embedHideDevToolsStore } from "../embedHideDevTools"

export const devToolsEnabled = derived(
  [appStore, builderStore, embedHideDevToolsStore],
  ([$appStore, $builderStore, $embedHideDevTools]) => {
    return (
      !$builderStore.inBuilder &&
      $appStore.isDevApp &&
      !$appStore.hideDevTools &&
      !$embedHideDevTools
    )
  }
)
