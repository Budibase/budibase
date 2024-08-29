import {
  CreateRowActionRequest,
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

  update = async (
    tableId: string,
    rowActionId: string,
    rowAction: CreateRowActionRequest,
    expectations?: Expectations,
    config?: { publicUser?: boolean }
  ) => {
    return await this._put<RowActionResponse>(
      `/api/tables/${tableId}/actions/${rowActionId}`,
      {
        body: rowAction,
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

  setViewPermission = async (
    tableId: string,
    viewId: string,
    rowActionId: string,
    expectations?: Expectations,
    config?: { publicUser?: boolean }
  ) => {
    return await this._post<RowActionResponse>(
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
    return await this._delete<RowActionResponse>(
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
