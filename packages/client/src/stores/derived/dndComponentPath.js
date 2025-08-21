import { derived } from "svelte/store"
import { findComponentPathById } from "@/utils/components"
import { dndParent } from "../dnd.ts"
import { screenStore } from "../screens"

export const dndComponentPath = derived(
  [dndParent, screenStore],
  ([$dndParent, $screenStore]) => {
    const root = $screenStore.activeScreen?.props
    const path = findComponentPathById(root, $dndParent) || []
    return path?.map(component => component._id)
  }
)
