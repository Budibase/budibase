import { writable } from "svelte/store"
import api from "builderStore/api"

export function createUsersStore() {
  const { subscribe, set } = writable([])

  async function init() {
    try {
      const response = await api.get(`/api/admin/users`)
      const json = await response.json()
      set(json)
    } catch (error) {
      console.log(error)
    }
  }

  async function invite(email) {
    try {
      const response = await api.post(`/api/admin/users/invite`, { email })
      return await response.json()
    } catch (error) {
      return error
    }
  }

  async function create({ email, password }) {
    const response = await api.post("/api/admin/users", { email, password, roles: {} })
    init()
    return await response.json()
  }

  async function del(id) {
    const response = await api.delete(`/api/admin/users/${id}`)
    init()
    return await response.json()
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
    invite,
    create,
    del
  }
}

export const users = createUsersStore()
