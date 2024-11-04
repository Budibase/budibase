import {
  CreateRowActionRequest,
  RowActionPermissionsResponse,
  RowActionResponse,
  RowActionsResponse,
  RowActionTriggerRequest,
} from "@budibase/types"
import { Expectations, TestAPI } from "./base"

export class RowActionAPI extends TestAPI {
  save = async (
    tableId: string,
    rowAction: CreateRowActionRequest,
    expectations?: Expectations,
    config?: { publicUser?: boolean }
  ) => {
    return await this._post<RowActionResponse>(
      `/api/tables/${tableId}/actions`,
      {
        body: rowAction,
        expectations: {
          status: 201,
          ...expectations,
        },
        ...config,
      }
    )
  }

  find = async (
    tableId: string,
    expectations?: Expectations,
    config?: { publicUser?: boolean }
  ) => {
    return await this._get<RowActionsResponse>(
      `/api/tables/${tableId}/actions`,
      {
        expectations,
        ...config,
      }
    )
  }

  delete = async (
    tableId: string,
    rowActionId: string,
    expectations?: Expectations,
    config?: { publicUser?: boolean }
  ) => {
    return await this._delete<RowActionResponse>(
      `/api/tables/${tableId}/actions/${rowActionId}`,
      {
        expectations,
        ...config,
      }
    )
  }

  setTablePermission = async (
    tableId: string,
    rowActionId: string,
    expectations?: Expectations,
    config?: { publicUser?: boolean }
  ) => {
    return await this._post<RowActionPermissionsResponse>(
      `/api/tables/${tableId}/actions/${rowActionId}/permissions`,
      {
        expectations: {
          status: 200,
          ...expectations,
        },
        ...config,
      }
    )
  }

  unsetTablePermission = async (
    tableId: string,
    rowActionId: string,
    expectations?: Expectations,
    config?: { publicUser?: boolean }
  ) => {
    return await this._delete<RowActionPermissionsResponse>(
      `/api/tables/${tableId}/actions/${rowActionId}/permissions`,
      {
        expectations: {
          status: 200,
          ...expectations,
        },
        ...config,
      }
    )
  }

  setViewPermission = async (
    tableId: string,
    viewId: string,
    rowActionId: string,
    expectations?: Expectations,
    config?: { publicUser?: boolean }
  ) => {
    return await this._post<RowActionPermissionsResponse>(
      `/api/tables/${tableId}/actions/${rowActionId}/permissions/${viewId}`,
      {
        expectations: {
          status: 200,
          ...expectations,
        },
        ...config,
      }
    )
  }

  unsetViewPermission = async (
    tableId: string,
    viewId: string,
    rowActionId: string,
    expectations?: Expectations,
    config?: { publicUser?: boolean }
  ) => {
    return await this._delete<RowActionPermissionsResponse>(
      `/api/tables/${tableId}/actions/${rowActionId}/permissions/${viewId}`,
      {
        expectations: {
          status: 200,
          ...expectations,
        },
        ...config,
      }
    )
  }

  trigger = async (
    tableId: string,
    rowActionId: string,
    body: RowActionTriggerRequest,
    expectations?: Expectations,
    config?: { publicUser?: boolean; useProdApp?: boolean }
  ) => {
    return await this._post<RowActionResponse>(
      `/api/tables/${tableId}/actions/${rowActionId}/trigger`,
      {
        body,
        expectations,
        ...{ ...config, useProdApp: config?.useProdApp ?? true },
      }
    )
  }
}
