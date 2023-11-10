import { derived, writable } from "svelte/store"

export const createStores = () => {
  const bounds = writable({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
  })

  // Derive height and width as primitives to avoid wasted computation
  const width = derived(bounds, $bounds => $bounds.width, 0)
  const height = derived(bounds, $bounds => $bounds.height, 0)

  return { bounds, height, width }
}
