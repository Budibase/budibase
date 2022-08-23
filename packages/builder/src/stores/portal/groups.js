import { writable, get } from "svelte/store"
import { API } from "api"
import { auth } from "stores/portal"
import { Constants } from "@budibase/frontend-core"

export function createGroupsStore() {
  const store = writable([])

  const actions = {
    init: async () => {
      // only init if these is a groups license, just to be sure but the feature will be blocked
      // on the backend anyway
      if (
        get(auth).user.license.features.includes(Constants.Features.USER_GROUPS)
      ) {
        const users = await API.getGroups()
        store.set(users)
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
