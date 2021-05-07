import { writable } from "svelte/store"
import api from "builderStore/api"

export function createUsersStore() {
  const { subscribe, set } = writable({})

  async function init() {
    try {
      const response = await api.get(`/api/admin/users`)
      const json = await response.json()
      set(json)
    } catch (error) {
      console.log(error)
    }
  }

  return {
    subscribe,
    // save: async config => {
    //   try {
    //     await api.post("/api/admin/configs", { type: "settings", config })
    //     await init()
    //     return { status: 200 }
    //   } catch (error) {
    //     return { error }
    //   }
    // },
    init,
  }
}

export const users = createUsersStore()
