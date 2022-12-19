import { derived } from "svelte/store"
import { findComponentPathById } from "utils/components.js"
import { dndParent } from "../dnd.js"
import { screenStore } from "../screens.js"

export const dndComponentPath = derived(
  [dndParent, screenStore],
  ([$dndParent, $screenStore]) => {
    const root = $screenStore.activeScreen?.props
    const path = findComponentPathById(root, $dndParent) || []
    return path?.map(component => component._id)
  }
)
