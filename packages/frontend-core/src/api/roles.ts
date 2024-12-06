import {
  AccessibleRolesResponse,
  DeleteRoleResponse,
  FetchRolesResponse,
  SaveRoleRequest,
  SaveRoleResponse,
} from "@budibase/types"
import { BaseAPIClient } from "./types"

export interface RoleEndpoints {
  deleteRole: (id: string, rev: string) => Promise<DeleteRoleResponse>
  saveRole: (role: SaveRoleRequest) => Promise<SaveRoleResponse>
  getRoles: () => Promise<FetchRolesResponse>
  getRolesForApp: (appId: string) => Promise<any>
  getAccessibleRoles: () => Promise<AccessibleRolesResponse>
}

export const buildRoleEndpoints = (API: BaseAPIClient): RoleEndpoints => ({
  /**
   * Deletes a role.
   * @param id the ID of the role to delete
   * @param rev the rev of the role to delete
   */
  deleteRole: async (id, rev) => {
    return await API.delete({
      url: `/api/roles/${id}/${rev}`,
    })
  },

  /**
   * Saves a role.
   * @param role the role to save
   */
  saveRole: async role => {
    return await API.post({
      url: "/api/roles",
      body: role,
    })
  },

  /**
   * Gets a list of roles.
   */
  getRoles: async () => {
    return await API.get({
      url: "/api/roles",
    })
  },

  /**
   * Gets a list of roles within a specified app.
   */
  getRolesForApp: async appId => {
    return await API.get({
      url: `/api/global/roles/${appId}`,
    })
  },

  /**
   * For the logged in user and current app - retrieves accessible roles.
   */
  getAccessibleRoles: async () => {
    return await API.get({
      url: `/api/roles/accessible`,
    })
  },
})
