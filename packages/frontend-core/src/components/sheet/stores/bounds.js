import { writable } from "svelte/store"

export const createBoundsStores = () => {
  const bounds = writable({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
  })
  return { bounds }
}
