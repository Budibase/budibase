import { getStore } from "./store"
import { getBackendUiStore } from "./store/backend"
import LogRocket from "logrocket"

export const store = getStore()
export const backendUiStore = getBackendUiStore()

export const initialise = async () => {
  try {
    if (process.env.NODE_ENV === "production") {
      LogRocket.init("knlald/budibase")
    }
  } catch (err) {
    console.log(err)
  }
}
