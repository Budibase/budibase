import { writable } from "svelte/store"
import { API } from "api"
import { update } from "lodash"
import { licensing } from "."
import { sdk } from "@budibase/shared-core"

export function createUsersStore() {
  const { subscribe, set } = writable({})

  // opts can contain page and search params
  async function search(opts = {}) {
    const paged = await API.searchUsers(opts)
    set({
      ...paged,
      ...opts,
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
  const fetch = async () => {
    return await API.getUsers()
  }

  // One or more users.
  async function onboard(payload) {
    return await API.onboardUsers(payload)
  }

  async function invite(payload) {
    return API.inviteUsers(payload)
  }

  async function acceptInvite(inviteCode, password, firstName, lastName) {
    return API.acceptInvite({
      inviteCode,
      password,
      firstName,
      lastName: !lastName?.trim() ? undefined : lastName,
    })
  }

  async function fetchInvite(inviteCode) {
    return API.getUserInvite(inviteCode)
  }

  async function getInvites() {
    return API.getUserInvites()
  }

  async function updateInvite(invite) {
    return API.updateUserInvite(invite)
  }

  async function create(data) {
    let mappedUsers = data.users.map(user => {
      const body = {
        email: user.email,
        password: user.password,
        roles: {},
      }
      if (user.forceResetPassword) {
        body.forceResetPassword = user.forceResetPassword
      }

      switch (user.role) {
        case "appUser":
          body.builder = { global: false }
          body.admin = { global: false }
          break
        case "developer":
          body.builder = { global: true }
          break
        case "admin":
          body.admin = { global: true }
          body.builder = { global: true }
          break
      }

      return body
    })
    const response = await API.createUsers({
      users: mappedUsers,
      groups: data.groups,
    })

    // re-search from first page
    await search()
    return response
  }

  async function del(id) {
    await API.deleteUser(id)
    update(users => users.filter(user => user._id !== id))
  }

  async function getUserCountByApp({ appId }) {
    return await API.getUserCountByApp({ appId })
  }

  async function bulkDelete(userIds) {
    return API.deleteUsers(userIds)
  }

  async function save(user) {
    return await API.saveUser(user)
  }

  async function addAppBuilder(userId, appId) {
    return await API.addAppBuilder({ userId, appId })
  }

  async function removeAppBuilder(userId, appId) {
    return await API.removeAppBuilder({ userId, appId })
  }

  const getUserRole = user =>
    sdk.users.isAdmin(user)
      ? "admin"
      : sdk.users.isBuilder(user)
      ? "developer"
      : "appUser"
  const refreshUsage =
    fn =>
    async (...args) => {
      const response = await fn(...args)
      await licensing.setQuotaUsage()
      return response
    }

  return {
    subscribe,
    search,
    get,
    getUserRole,
    fetch,
    invite,
    onboard,
    fetchInvite,
    getInvites,
    updateInvite,
    getUserCountByApp,
    addAppBuilder,
    removeAppBuilder,
    // any operation that adds or deletes users
    acceptInvite,
    create: refreshUsage(create),
    save: refreshUsage(save),
    bulkDelete: refreshUsage(bulkDelete),
    delete: refreshUsage(del),
  }
}

export const users = createUsersStore()
