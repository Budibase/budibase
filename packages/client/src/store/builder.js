import { writable } from "svelte/store"

const createBuilderStore = () => {
  const initialState = {
    inBuilder: false,
    layout: null,
    screen: null,
    selectedComponentId: null,
    previewId: null,
  }
  return writable(initialState)
}

export const builderStore = createBuilderStore()
