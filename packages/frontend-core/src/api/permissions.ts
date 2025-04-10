import {
  AddPermissionResponse,
  GetDependantResourcesResponse,
  GetResourcePermsResponse,
  PermissionLevel,
  RemovePermissionResponse,
} from "@budibase/types"
import { BaseAPIClient } from "./types"

export interface PermissionEndpoints {
  getPermissionForResource: (
    resourceId: string
  ) => Promise<GetResourcePermsResponse>
  updatePermissionForResource: (
    resourceId: string,
    roleId: string,
    level: PermissionLevel
  ) => Promise<AddPermissionResponse>
  removePermissionFromResource: (
    resourceId: string,
    roleId: string,
    level: PermissionLevel
  ) => Promise<RemovePermissionResponse>
  getDependants: (resourceId: string) => Promise<GetDependantResourcesResponse>
}

export const buildPermissionsEndpoints = (
  API: BaseAPIClient
): PermissionEndpoints => ({
  /**
   * Gets the permission required to access a specific resource
   * @param resourceId the resource ID to check
   */
  getPermissionForResource: async resourceId => {
    return await API.get({
      url: `/api/permission/${resourceId}`,
    })
  },

  /**
   * Updates the permissions for a certain resource
   * @param resourceId the ID of the resource to update
   * @param roleId the ID of the role to update the permissions of
   * @param level the level to assign the role for this resource
   */
  updatePermissionForResource: async (resourceId, roleId, level) => {
    return await API.post({
      url: `/api/permission/${roleId}/${resourceId}/${level}`,
    })
  },

  /**
   * Remove the the permissions for a certain resource
   * @param resourceId the ID of the resource to update
   * @param roleId the ID of the role to update the permissions of
   * @param level the level to remove the role for this resource
   */
  removePermissionFromResource: async (resourceId, roleId, level) => {
    return await API.delete({
      url: `/api/permission/${roleId}/${resourceId}/${level}`,
    })
  },

  /**
   * Gets info about the resources that depend on this resource permissions
   * @param resourceId the resource ID to check
   */
  getDependants: async resourceId => {
    return await API.get({
      url: `/api/permission/${resourceId}/dependants`,
    })
  },
})
