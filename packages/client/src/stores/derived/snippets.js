import { derived } from "svelte/store"
import { appStore } from "../app.js"
import { builderStore } from "../builder.js"

export const snippets = derived(
  [appStore, builderStore],
  ([$appStore, $builderStore]) => {
    return $builderStore?.snippets || $appStore?.application?.snippets || []
  }
)
