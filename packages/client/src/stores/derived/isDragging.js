import { derived } from "svelte/store"
import { dndStore } from "../dnd"
import { builderStore } from "../builder.js"

// Derive whether we are dragging or not
export const isDragging = derived(
  [dndStore, builderStore],
  ([$dndStore, $builderStore]) =>
    $dndStore.source != null || $builderStore.draggingNewComponent
)
