import { writable, get } from "svelte/store"
import { API } from "api"
import { licensing } from "stores/portal"

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
      if (get(licensing).groupsEnabled) {
        const groups = await API.getGroups()
        store.set(groups.data)
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

    addApp: async (groupId, appId, roleId) => {
      await API.addAppsToGroup(groupId, [{ appId, roleId }])
      // refresh the group roles
      await getGroup(groupId)
    },

    removeApp: async (groupId, appId) => {
      await API.removeAppsFromGroup(groupId, [{ appId }])
      // refresh the group roles
      await getGroup(groupId)
    },

    getGroupAppIds: group => {
      let groupAppIds = Object.keys(group?.roles || {})
      if (group?.builder?.apps) {
        groupAppIds = groupAppIds.concat(group.builder.apps)
      }
      return groupAppIds
    },

    addGroupAppBuilder: async (groupId, appId) => {
      return await API.addGroupAppBuilder({ groupId, appId })
    },

    removeGroupAppBuilder: async (groupId, appId) => {
      return await API.removeGroupAppBuilder({ groupId, appId })
    },
  }

  return {
    subscribe: store.subscribe,
    actions,
  }
}

export const groups = createGroupsStore()
