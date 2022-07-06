import { writable } from "svelte/store"
import { API } from "api"

export function createGroupsStore() {
  const DEFAULT_CONFIG = {
    name: "",
    icon: "",
    color: "",
    users: [],
    apps: [],
  }

  const store = writable([DEFAULT_CONFIG])

  const actions = {
    init: async () => {
      const users = await API.getGroups()
      store.set(users)
    },

    save: async group => {
      console.log(group)
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
  }

  return {
    subscribe: store.subscribe,
    actions,
  }
}

export const groups = createGroupsStore()
