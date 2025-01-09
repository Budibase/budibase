import { get } from "svelte/store"
import { API } from "@/api"
import { licensing } from "@/stores/portal"
import { UserGroup } from "@budibase/types"
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
    // Only init if there is a groups license, just to be sure but the feature will be blocked
    // on the backend anyway
    if (get(licensing).groupsEnabled) {
      const groups = await API.getGroups()
      this.set(groups)
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

  async addApp(groupId: string, appId: string, roleId: string) {
    await API.addAppsToGroup(groupId, [{ appId, roleId }])
    await this.refreshGroup(groupId)
  }

  async removeApp(groupId: string, appId: string) {
    await API.removeAppsFromGroup(groupId, [{ appId }])
    await this.refreshGroup(groupId)
  }

  getGroupAppIds(group: UserGroup) {
    let groupAppIds = Object.keys(group?.roles || {})
    if (group?.builder?.apps) {
      groupAppIds = groupAppIds.concat(group.builder.apps)
    }
    return groupAppIds
  }

  async addGroupAppBuilder(groupId: string, appId: string) {
    return await API.addGroupAppBuilder(groupId, appId)
  }

  async removeGroupAppBuilder(groupId: string, appId: string) {
    return await API.removeGroupAppBuilder(groupId, appId)
  }
}

export const groups = new GroupStore()
