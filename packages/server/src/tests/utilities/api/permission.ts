import {
  AddPermissionRequest,
  AddPermissionResponse,
  GetResourcePermsResponse,
  RemovePermissionRequest,
  RemovePermissionResponse,
} from "@budibase/types"
import { Expectations, TestAPI } from "./base"

export class PermissionAPI extends TestAPI {
  get = async (resourceId: string, expectations?: Expectations) => {
    return await this._get<GetResourcePermsResponse>(
      `/api/permission/${resourceId}`,
      { expectations }
    )
  }

  add = async (
    request: AddPermissionRequest,
    expectations?: Expectations
  ): Promise<AddPermissionResponse> => {
    const { roleId, resourceId, level } = request
    return await this._post<AddPermissionResponse>(
      `/api/permission/${roleId}/${resourceId}/${level}`,
      { expectations }
    )
  }

  revoke = async (
    request: RemovePermissionRequest,
    expectations?: Expectations
  ) => {
    const { roleId, resourceId, level } = request
    return await this._delete<RemovePermissionResponse>(
      `/api/permission/${roleId}/${resourceId}/${level}`,
      { expectations }
    )
  }
}
