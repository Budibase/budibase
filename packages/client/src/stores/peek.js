import { writable, get } from "svelte/store"
import { stateStore } from "./state.js"

const initialState = {
  showPeek: false,
  url: null,
  href: null,
  external: false,
  fullscreenText: "Full screen",
  closeText: "Close",
}

const createPeekStore = () => {
  const store = writable(initialState)

  const showPeek = (url, options) => {
    let href = url
    let external = !url.startsWith("/")
    if (!external) {
      const state = get(stateStore)
      const serialised = encodeURIComponent(btoa(JSON.stringify(state)))
      const query = `peek=true&state=${serialised}`
      href = `${window.location.href.split("#")[0]}#${url}?${query}`
    }
    store.set({
      showPeek: true,
      url,
      href,
      external,
      fullscreenText: options?.fullscreenText || "Full screen",
      closeText: options?.closeText || "Close",
    })
  }
  const hidePeek = () => {
    store.set(initialState)
  }

  return {
    subscribe: store.subscribe,
    actions: { showPeek, hidePeek },
  }
}

export const peekStore = createPeekStore()
