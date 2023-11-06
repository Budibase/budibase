import { writable, get } from "svelte/store"

const INITIAL_PREVIEW_STATE = {
  previewDevice: "desktop",
  previewEventHandler: null,
  showPreview: false,
}

export const createPreviewStore = () => {
  const store = writable({
    ...INITIAL_PREVIEW_STATE,
  })

  const setDevice = device => {
    store.update(state => {
      state.previewDevice = device
      return state
    })
  }

  // Potential evt names "eject-block", "dragging-new-component"
  const sendEvent = (name, payload) => {
    const { previewEventHandler } = get(store)
    previewEventHandler?.(name, payload)
  }

  const registerEventHandler = handler => {
    store.update(state => {
      state.previewEventHandler = handler
      return state
    })
  }

  const startDrag = component => {
    sendEvent("dragging-new-component", {
      dragging: true,
      component,
    })
  }

  const stopDrag = () => {
    sendEvent("dragging-new-component", {
      dragging: false,
    })
  }

  //load preview?
  const showPreview = isVisible => {
    store.update(state => {
      state.showPreview = isVisible
      return state
    })
  }

  return {
    subscribe: store.subscribe,
    setDevice,
    sendEvent, //may not be required
    registerEventHandler,
    startDrag,
    stopDrag,
    showPreview,
  }
}

export const previewStore = createPreviewStore()
