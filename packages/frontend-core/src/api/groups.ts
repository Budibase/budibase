import {
  SearchGroupResponse,
  SearchUserGroupResponse,
  UserGroup,
} from "@budibase/types"
import { BaseAPIClient } from "./types"

export interface GroupEndpoints {
  saveGroup: (group: UserGroup) => Promise<{ _id: string; _rev: string }>
  getGroups: () => Promise<UserGroup[]>
  getGroup: (id: string) => Promise<UserGroup>
  deleteGroup: (id: string, rev: string) => Promise<{ message: string }>
  getGroupUsers: (
    data: GetGroupUsersRequest
  ) => Promise<SearchUserGroupResponse>
  addUsersToGroup: (groupId: string, userIds: string[]) => Promise<void>
  removeUsersFromGroup: (groupId: string, userIds: string[]) => Promise<void>
  addAppsToGroup: (groupId: string, appArray: object[]) => Promise<void>
  removeAppsFromGroup: (groupId: string, appArray: object[]) => Promise<void>
  addGroupAppBuilder: (groupId: string, appId: string) => Promise<void>
  removeGroupAppBuilder: (groupId: string, appId: string) => Promise<void>
}

enum GroupResource {
  USERS = "users",
  APPS = "apps",
}

enum GroupOperation {
  ADD = "add",
  REMOVE = "remove",
}

type GetGroupUsersRequest = {
  id: string
  bookmark?: string
  emailSearch?: string
}

export const buildGroupsEndpoints = (API: BaseAPIClient): GroupEndpoints => {
  // Underlying functionality of adding/removing users/apps to groups
  async function updateGroupResource(
    groupId: string,
    resource: GroupResource,
    operation: GroupOperation,
    resources: string[] | object[]
  ) {
    return await API.post<{ [key in GroupOperation]?: string[] | object[] }>({
      url: `/api/global/groups/${groupId}/${resource}`,
      body: {
        [operation]: resources,
      },
    })
  }

  return {
    /**
     * Creates a user group.
     * @param group the new group to create
     */
    saveGroup: async group => {
      return await API.post({
        url: "/api/global/groups",
        body: group,
      })
    },
    /**
     * Gets all the user groups
     */
    getGroups: async () => {
      const res = await API.get<SearchGroupResponse>({
        url: "/api/global/groups",
      })
      return res.data
    },

    /**
     * Gets a group by ID
     */
    getGroup: async id => {
      return await API.get({
        url: `/api/global/groups/${id}`,
      })
    },

    /**
     * Deletes a user group
     * @param id the id of the config to delete
     * @param rev the revision of the config to delete
     */
    deleteGroup: async (id, rev) => {
      return await API.delete({
        url: `/api/global/groups/${id}/${rev}`,
      })
    },

    /**
     * Gets a group users by the group id
     */
    getGroupUsers: async ({ id, bookmark, emailSearch }) => {
      let url = `/api/global/groups/${id}/users?`
      if (bookmark) {
        url += `bookmark=${bookmark}&`
      }
      if (emailSearch) {
        url += `emailSearch=${emailSearch}`
      }
      return await API.get({
        url,
      })
    },

    /**
     * Adds users to a group
     * @param groupId The group to update
     * @param userIds The user IDs to be added
     */
    addUsersToGroup: async (groupId, userIds) => {
      return updateGroupResource(
        groupId,
        GroupResource.USERS,
        GroupOperation.ADD,
        userIds
      )
    },

    /**
     * Removes users from a group
     * @param groupId The group to update
     * @param userIds The user IDs to be removed
     */
    removeUsersFromGroup: async (groupId, userIds) => {
      return updateGroupResource(
        groupId,
        GroupResource.USERS,
        GroupOperation.REMOVE,
        userIds
      )
    },

    /**
     * Adds apps to a group
     * @param groupId The group to update
     * @param appArray Array of objects, containing the appId and roleId to be added
     */
    addAppsToGroup: async (groupId, appArray) => {
      return updateGroupResource(
        groupId,
        GroupResource.APPS,
        GroupOperation.ADD,
        appArray
      )
    },

    /**
     * Removes apps from a group
     * @param groupId The group to update
     * @param appArray Array of objects, containing the appId to be removed
     */
    removeAppsFromGroup: async (groupId, appArray) => {
      return updateGroupResource(
        groupId,
        GroupResource.APPS,
        GroupOperation.REMOVE,
        appArray
      )
    },

    /**
     * Add app builder to group
     * @param groupId The group to update
     * @param appId The app id where the builder will be added
     */
    addGroupAppBuilder: async (groupId, appId) => {
      return await API.post({
        url: `/api/global/groups/${groupId}/app/${appId}/builder`,
      })
    },

    /**
     * Remove app builder from group
     * @param groupId The group to update
     * @param appId The app id where the builder will be removed
     */
    removeGroupAppBuilder: async (groupId, appId) => {
      return await API.delete({
        url: `/api/global/groups/${groupId}/app/${appId}/builder`,
      })
    },
  }
}
