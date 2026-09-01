import { API } from "@/api"
import { auth, licensing } from "@/stores/portal"
import { sdk } from "@budibase/shared-core"
import { UserGroup } from "@budibase/types"
import { get } from "svelte/store"
import { BudiStore } from "../BudiStore"

class GroupStore extends BudiStore<UserGroup[]> {
  constructor() {
    super([])
  }

  updateStore = (group: UserGroup) => {
    this.update(state => {
      const currentIdx = state.findIndex(gr => gr._id === group._id)
      if (currentIdx >= 0) {
        state.splice(currentIdx, 1, group)
      } else {
        state.push(group)
      }
      return state
    })
  }

  async init() {
    // Only init if there is a groups license and the user is a builder or
    // admin - the endpoint 403s for end users
    const user = get(auth).user
    const canReadGroups =
      sdk.users.hasBuilderPermissions(user) ||
      sdk.users.hasAdminPermissions(user)
    if (get(licensing).groupsEnabled && canReadGroups) {
      try {
        const groups = await API.getGroups()
        this.set(groups)
      } catch (error) {
        console.error("Error fetching user groups", error)
      }
    } else {
      this.set([])
    }
  }

  private async refreshGroup(groupId: string) {
    const group = await API.getGroup(groupId)
    this.updateStore(group)
  }

  async save(group: UserGroup) {
    const { ...dataToSave } = group
    delete dataToSave.scimInfo
    const response = await API.saveGroup(dataToSave)
    group._id = response._id
    group._rev = response._rev

    // Setting a default group has side effects on other groups, so refresh all.
    if (group.isDefault) {
      const latestGroups = await API.getGroups()
      this.set(latestGroups)
      const savedGroup = latestGroups.find(g => g._id === group._id)
      if (!savedGroup) {
        throw new Error("Failed to refresh saved group")
      }
      return savedGroup
    }

    this.updateStore(group)
    return group
  }

  async delete(group: UserGroup) {
    await API.deleteGroup(group._id!, group._rev!)
    this.update(groups => {
      const index = groups.findIndex(g => g._id === group._id)
      if (index !== -1) {
        groups.splice(index, 1)
      }
      return groups
    })
  }

  async addUser(groupId: string, userId: string) {
    await API.addUsersToGroup(groupId, [userId])
    await this.refreshGroup(groupId)
  }

  async removeUser(groupId: string, userId: string) {
    await API.removeUsersFromGroup(groupId, [userId])
    await this.refreshGroup(groupId)
  }

  async addWorkspace(groupId: string, workspaceId: string, roleId: string) {
    await API.addWorkspacesToGroup(groupId, [{ workspaceId, roleId }])
    await this.refreshGroup(groupId)
  }

  async addWorkspaces(groupId: string, workspaceIds: string[], roleId: string) {
    if (!workspaceIds.length) {
      return
    }
    await API.addWorkspacesToGroup(
      groupId,
      workspaceIds.map(workspaceId => ({ workspaceId, roleId }))
    )
    await this.refreshGroup(groupId)
  }

  async removeWorkspace(groupId: string, workspaceId: string) {
    await API.removeWorkspacesFromGroup(groupId, [{ workspaceId }])
    await this.refreshGroup(groupId)
  }

  async removeWorkspaces(groupId: string, workspaceIds: string[]) {
    await API.removeWorkspacesFromGroup(
      groupId,
      workspaceIds.map(workspaceId => ({ workspaceId }))
    )
    await this.refreshGroup(groupId)
  }

  getGroupWorkspaceIds(group: UserGroup) {
    let groupWorkspaceIds = Object.keys(group?.roles || {})
    if (group?.builder?.apps) {
      groupWorkspaceIds = groupWorkspaceIds.concat(group.builder.apps)
    }
    return groupWorkspaceIds
  }

  async bulkAddUsersFromCsv(groupId: string, csvContent: string) {
    const result = await API.bulkAddUsersFromCsv(groupId, csvContent)
    await this.refreshGroup(groupId)
    return result
  }
}

export const groups = new GroupStore()
