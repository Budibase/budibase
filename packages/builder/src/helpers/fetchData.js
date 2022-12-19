import { writable } from "svelte/store"
import { API } from "api"

export default function (url) {
  const store = writable({ status: "LOADING", data: {}, error: {} })

  async function get() {
    store.update(u => ({ ...u, status: "LOADING" }))
    try {
      const data = await API.get({ url })
      store.set({ data, status: "SUCCESS" })
    } catch (e) {
      store.set({ data: {}, error: e, status: "ERROR" })
    }
  }

  get()

  return { subscribe: store.subscribe, refresh: get }
}
