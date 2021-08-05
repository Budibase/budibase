import { writable } from "svelte/store"

const initialState = {
  showPeek: false,
  url: null,
  href: null,
  external: false,
}

const createPeekStore = () => {
  const store = writable(initialState)

  const showPeek = url => {
    let href = url
    let external = !url.startsWith("/")
    if (!external) {
      href = `${window.location.href.split("#")[0]}#${url}?peek=true`
    }
    store.set({
      showPeek: true,
      url,
      href,
      external,
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
