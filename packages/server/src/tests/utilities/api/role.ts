import {
  AccessibleRolesResponse,
  FetchRolesResponse,
  FindRoleResponse,
  SaveRoleRequest,
  SaveRoleResponse,
  Role,
} from "@budibase/types"
import { Expectations, TestAPI } from "./base"

export class RoleAPI extends TestAPI {
  fetch = async (expectations?: Expectations) => {
    return await this._get<FetchRolesResponse>(`/api/roles`, {
      expectations,
    })
  }

  find = async (roleId: string, expectations?: Expectations) => {
    return await this._get<FindRoleResponse>(`/api/roles/${roleId}`, {
      expectations,
    })
  }

  save = async (body: SaveRoleRequest, expectations?: Expectations) => {
    return await this._post<SaveRoleResponse>(`/api/roles`, {
      body,
      expectations,
    })
  }

  destroy = async (role: Role, expectations?: Expectations) => {
    return await this._delete(`/api/roles/${role._id}/${role._rev}`, {
      expectations,
    })
  }

  accessible = async (expectations?: Expectations) => {
    return await this._get<AccessibleRolesResponse>(`/api/roles/accessible`, {
      expectations,
    })
  }
}
