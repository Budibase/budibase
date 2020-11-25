import { writable } from "svelte/store"

const createBuilderStore = () => {
  const initialState = {
    inBuilder: false,
    page: null,
    screen: null,
  }
  return writable(initialState)
}

export const builderStore = createBuilderStore()
