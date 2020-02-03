import { createPackage } from "./createPackage"
import getStore from "./store"

export const store = getStore()

export const createNewPackage = () => createPackage(packageInfo, store)

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
    pushState.apply(history, arguments)
    //fireEvents('pushState', arguments);
    writable.initialise()
  }
  window.addEventListener("hashchange", () => {
    writable.initialise()
  })
}
