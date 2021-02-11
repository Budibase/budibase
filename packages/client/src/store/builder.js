import { writable } from "svelte/store"

const createBuilderStore = () => {
  const initialState = {
    inBuilder: false,
    appId: null,
    layout: null,
    screen: null,
    selectedComponentId: null,
    previewId: null,
    previewType: null,
  }
  const store = writable(initialState)
  const actions = {
    selectComponent: id => {
      if (id) {
        window.dispatchEvent(
          new CustomEvent("bb-select-component", { detail: id })
        )
      }
    },
  }
  return {
    ...store,
    actions,
  }
}

export const builderStore = createBuilderStore()
