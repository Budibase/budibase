import { writable, get } from "svelte/store"
import { API } from "api"
import { auth } from "stores/portal"

export function createGroupsStore() {
  const store = writable([])

  const updateStore = group => {
    store.update(state => {
      const currentIdx = state.findIndex(gr => gr._id === group._id)
      if (currentIdx >= 0) {
        state.splice(currentIdx, 1, group)
      } else {
        state.push(group)
      }
      return state
    })
  }

  const getGroup = async groupId => {
    const group = await API.getGroup(groupId)
    updateStore(group)
  }

  const actions = {
    init: async () => {
      // only init if there is a groups license, just to be sure but the feature will be blocked
      // on the backend anyway
      if (get(auth).groupsEnabled) {
        const groups = await API.getGroups()
        store.set(groups)
      }
    },

    get: getGroup,

    save: async group => {
      const response = await API.saveGroup(group)
      group._id = response._id
      group._rev = response._rev
      updateStore(group)
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
      await API.addUsersToGroup(groupId, userId)
      // refresh the group enrichment
      await getGroup(groupId)
    },

    removeUser: async (groupId, userId) => {
      await API.removeUsersFromGroup(groupId, userId)
      // refresh the group enrichment
      await getGroup(groupId)
    },
  }

  return {
    subscribe: store.subscribe,
    actions,
  }
}

export const groups = createGroupsStore()
