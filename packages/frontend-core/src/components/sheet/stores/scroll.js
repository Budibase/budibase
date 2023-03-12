import { writable } from "svelte/store"

export const createScrollStores = () => {
  const scroll = writable({
    left: 0,
    top: 0,
  })
  return {
    scroll,
  }
}
