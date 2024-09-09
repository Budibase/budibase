import { writable } from "svelte/store"
import { API } from "api"
import { RoleUtils } from "@budibase/frontend-core"
import { Roles } from "constants/backend"

const ROLE_NAMES = {
  [Roles.ADMIN]: "App admin",
  [Roles.POWER]: "App power user",
  [Roles.BASIC]: "App user",
  [Roles.PUBLIC]: "Public user",
}

export function createRolesStore() {
  const { subscribe, update, set } = writable([])

  function setRoles(roles) {
    set(
      roles.sort((a, b) => {
        const priorityA = RoleUtils.getRolePriority(a._id)
        const priorityB = RoleUtils.getRolePriority(b._id)
        return priorityA > priorityB ? -1 : 1
      })
    )
  }

  const actions = {
    fetch: async () => {
      let roles = await API.getRoles()

      // Update labels
      for (let [roleId, name] of Object.entries(ROLE_NAMES)) {
        const idx = roles.findIndex(x => x._id === roleId)
        if (idx !== -1) {
          roles[idx].name = name
        }
      }

      setRoles(roles)
    },
    fetchByAppId: async appId => {
      const { roles } = await API.getRolesForApp(appId)
      setRoles(roles)
    },
    delete: async role => {
      await API.deleteRole({
        roleId: role?._id,
        roleRev: role?._rev,
      })
      update(state => state.filter(existing => existing._id !== role._id))
    },
    save: async role => {
      const savedRole = await API.saveRole(role)
      await actions.fetch()
      return savedRole
    },
  }

  return {
    subscribe,
    ...actions,
  }
}

export const roles = createRolesStore()
