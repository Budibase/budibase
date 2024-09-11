import { derived, writable } from "svelte/store"
import { API } from "api"
import { RoleUtils } from "@budibase/frontend-core"

export function createRolesStore() {
  const store = writable([])
  const enriched = derived(store, $store => {
    return $store.map(role => ({
      ...role,

      // Ensure we have new metadata for all roles
      displayName: role.displayName || role.name,
      color: role.color || "var(--spectrum-global-color-magenta-400)",
      description: role.description || "Custom role",
    }))
  })

  function setRoles(roles) {
    store.set(
      roles.sort((a, b) => {
        const priorityA = RoleUtils.getRolePriority(a._id)
        const priorityB = RoleUtils.getRolePriority(b._id)
        return priorityA > priorityB ? -1 : 1
      })
    )
  }

  const actions = {
    fetch: async () => {
      const roles = await API.getRoles()
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

      // When saving a role we get back an _id prefixed by role_, but the API does not want this
      // in future requests
      return {
        ...savedRole,
        _id: savedRole._id.replace("role_", ""),
      }
    },
  }

  return {
    subscribe: enriched.subscribe,
    ...actions,
  }
}

export const roles = createRolesStore()
