import { derived, get, type Writable } from "svelte/store"
import { API } from "@/api"
import { RoleUtils } from "@budibase/frontend-core"
import { DerivedBudiStore } from "../BudiStore"
import { Role } from "@budibase/types"

export class RoleStore extends DerivedBudiStore<Role[], Role[]> {
  constructor() {
    const makeDerivedStore = (store: Writable<Role[]>) =>
      derived(store, $store => {
        return $store.map((role: Role) => ({
          ...role,
          // Ensure we have new metadata for all roles
          uiMetadata: {
            displayName: role.uiMetadata?.displayName || role.name,
            color:
              role.uiMetadata?.color ||
              "var(--spectrum-global-color-magenta-400)",
            description: role.uiMetadata?.description || "Custom role",
          },
        }))
      })

    super([], makeDerivedStore)
  }

  setRoles = (roles: Role[]) => {
    this.set(
      roles.sort((a, b) => {
        // Ensure we have valid IDs for priority comparison
        const priorityA = RoleUtils.getRolePriority(a._id)
        const priorityB = RoleUtils.getRolePriority(b._id)
        if (priorityA !== priorityB) {
          return priorityA > priorityB ? -1 : 1
        }
        const nameA = a.uiMetadata?.displayName || a.name
        const nameB = b.uiMetadata?.displayName || b.name
        return nameA < nameB ? -1 : 1
      })
    )
  }

  fetch = async () => {
    const roles = await API.getRoles()
    this.setRoles(roles)
  }

  fetchByAppId = async (appId: string) => {
    const { roles } = await API.getRolesForApp(appId)
    this.setRoles(roles)
  }

  delete = async (role: Role) => {
    if (!role._id || !role._rev) {
      return
    }
    await API.deleteRole(role._id, role._rev)
    await this.fetch()
  }

  save = async (role: Role) => {
    const savedRole = await API.saveRole(role)
    await this.fetch()
    return savedRole
  }

  replace = (roleId: string, role?: Role) => {
    // Handles external updates of roles
    if (!roleId) {
      return
    }

    // Handle deletion
    if (!role) {
      this.update(state => state.filter(x => x._id !== roleId))
      return
    }

    // Add new role
    const index = get(this).findIndex(x => x._id === role._id)
    if (index === -1) {
      this.update(state => [...state, role])
    }
    // Update existing role
    else if (role) {
      this.update(state => {
        state[index] = role
        return [...state]
      })
    }
  }
}

export const roles = new RoleStore()
