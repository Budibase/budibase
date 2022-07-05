import { writable } from "svelte/store"
import { API } from "api"
import { update } from "lodash"

export function createUsersStore() {
  const store = writable([])

  async function init() {
    const users = await API.getUsers()
    store.set(users)
  }

  async function invite({ emails, builder, admin }) {
    return API.inviteUsers({
      emails,
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
    await init()
  }

  async function del(id) {
    await API.deleteUser(id)
    update(users => users.filter(user => user._id !== id))
  }

  async function save(user) {
    const response = await API.saveUser(user)
    user._id = response._id
    user._rev = response._rev
    store.update(state => {
      const currentIdx = state.findIndex(user => user._id === user._id)
      if (currentIdx >= 0) {
        state.splice(currentIdx, 1, user)
      } else {
        state.push(user)
      }
      return state
    })
  }

  return {
    subscribe: store.subscribe,
    init,
    invite,
    acceptInvite,
    create,
    save,
    delete: del,
  }
}

export const users = createUsersStore()
