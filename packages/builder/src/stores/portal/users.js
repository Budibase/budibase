import { writable } from "svelte/store"
import api, { post } from "builderStore/api"
import { update } from "lodash"

export function createUsersStore() {
  const { subscribe, set } = writable([])

  async function init() {
    const response = await api.get(`/api/admin/users`)
    const json = await response.json()
    set(json)
  }

  async function invite({ email, builder, admin }) {
    const body = { email, userInfo: {} }
    if (admin) {
      body.userInfo.admin = {
        global: true,
      }
    }
    if (builder) {
      body.userInfo.builder = {
        global: true,
      }
    }
    const response = await api.post(`/api/admin/users/invite`, body)
    return await response.json()
  }

  async function acceptInvite(inviteCode, password) {
    const response = await api.post("/api/admin/users/invite/accept", {
      inviteCode,
      password,
    })
    return await response.json()
  }

  async function create({ email, password, admin, builder }) {
    const body = {
      email,
      password,
      roles: {},
    }
    if (builder) {
      body.builder = { global: true }
    }
    if (admin) {
      body.admin = { global: true }
    }
    const response = await api.post("/api/admin/users", body)
    await init()
    return await response.json()
  }

  async function del(id) {
    const response = await api.delete(`/api/admin/users/${id}`)
    update(users => users.filter(user => user._id !== id))
    return await response.json()
  }

  async function save(data) {
    try {
      const res = await post(`/api/admin/users`, data)
      return await res.json()
    } catch (error) {
      console.log(error)
      return error
    }
  }

  return {
    subscribe,
    init,
    invite,
    acceptInvite,
    create,
    save,
    delete: del,
  }
}

export const users = createUsersStore()
