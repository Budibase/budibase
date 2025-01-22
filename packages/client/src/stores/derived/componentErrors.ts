import { derived } from "svelte/store"
import { builderStore } from "../builder.js"

export const componentErrors = derived([builderStore], ([$builderStore]) => {
  return $builderStore.componentErrors || {}
})
