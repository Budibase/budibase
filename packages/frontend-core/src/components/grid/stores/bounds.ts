import { derived, Readable, Writable, writable } from "svelte/store"

interface BoundsStore {
  bounds: Writable<{
    left: number
    top: number
    width: number
    height: number
  }>
  height: Readable<number>
  width: Readable<number>
}

export type Store = BoundsStore

export const createStores = (): BoundsStore => {
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
