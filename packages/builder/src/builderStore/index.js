import getStore from "./store"

export const store = getStore()

export const initialise = async () => {
  try {
    setupRouter(store)
    await store.initialise()
  } catch (err) {
    console.log(err)
  }
}

const setupRouter = writable => {
  const pushState = history.pushState
  history.pushState = () => {
    pushState.apply(history, [writable])
    writable.initialise()
  }
  window.addEventListener("hashchange", () => {
    writable.initialise()
  })
}
