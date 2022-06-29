import { writable } from "svelte/store"
import { API } from "api"
import { update } from "lodash"

export function createUsersStore() {
  const { subscribe, set } = writable({})

  async function fetch(page) {
    const paged = await API.getUsers(page)
    set({
      ...paged,
      page,
    })
    return paged
  }

  async function get(userId) {
    try {
      return await API.getUser(userId)
    } catch (err) {
      return null
    }
  }

  async function invite({ email, builder, admin }) {
    return API.inviteUser({
      email,
      builder,
      admin,
    })
  }

  async function acceptInvite(inviteCode, password) {
    return API.acceptInvite({
      inviteCode,
      password,
    })
  }

  async function create({
    email,
    password,
    admin,
    builder,
    forceResetPassword,
  }) {
    const body = {
      email,
      password,
      roles: {},
    }
    if (forceResetPassword) {
      body.forceResetPassword = forceResetPassword
    }
    if (builder) {
      body.builder = { global: true }
    }
    if (admin) {
      body.admin = { global: true }
    }
    await API.saveUser(body)
    // re-fetch from first page
    await fetch()
  }

  async function del(id) {
    await API.deleteUser(id)
    update(users => users.filter(user => user._id !== id))
  }

  async function save(data) {
    await API.saveUser(data)
  }

  return {
    subscribe,
    fetch,
    get,
    invite,
    acceptInvite,
    create,
    save,
    delete: del,
  }
}

export const users = createUsersStore()
