import getStore from "./store"
import LogRocket from "logrocket";

export const store = getStore()

export const initialise = async () => {
  try {
    if (process.env.NODE_ENV === "production") {
      LogRocket.init("knlald/budibase");
    }
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
