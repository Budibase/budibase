import { writable, get } from "svelte/store"
import { API } from "api"
import { auth, users } from "stores/portal"

export function createGroupsStore() {
  const store = writable([])

  const actions = {
    init: async () => {
      // only init if these is a groups license, just to be sure but the feature will be blocked
      // on the backend anyway
      if (get(auth).groupsEnabled) {
        const groups = await API.getGroups()
        store.set(groups)
      }
    },

    save: async group => {
      const response = await API.saveGroup(group)
      group._id = response._id
      group._rev = response._rev
      store.update(state => {
        const currentIdx = state.findIndex(gr => gr._id === response._id)
        if (currentIdx >= 0) {
          state.splice(currentIdx, 1, group)
        } else {
          state.push(group)
        }
        return state
      })
      return group
    },

    delete: async group => {
      await API.deleteGroup({
        id: group._id,
        rev: group._rev,
      })
      store.update(state => {
        state = state.filter(state => state._id !== group._id)
        return state
      })
    },

    addUser: async (groupId, userId) => {
      // Sanity check
      const user = await users.get(userId)
      const group = get(store).find(x => x._id === groupId)
      if (!group?._id || !user?._id) {
        return
      }

      // Check we haven't already been added
      if (group.users?.find(x => x._id === userId)) {
        return
      }

      // Update user
      let userGroups = user.userGroups || []
      userGroups.push(groupId)
      await users.save({
        ...user,
        userGroups,
      })
    },

    removeUser: async (groupId, userId) => {
      // Sanity check
      const user = await users.get(userId)
      const group = get(store).find(x => x._id === groupId)
      if (!group?._id || !user?._id) {
        return
      }

      // Update user
      await users.save({
        ...user,
        userGroups: user.userGroups.filter(x => x !== groupId),
      })
    },
  }

  return {
    subscribe: store.subscribe,
    actions,
  }
}

export const groups = createGroupsStore()
