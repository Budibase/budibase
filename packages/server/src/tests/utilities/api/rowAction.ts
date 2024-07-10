import {
  CreateRowActionRequest,
  RowAction,
  RowActionsResponse,
} from "@budibase/types"
import { Expectations, TestAPI } from "./base"

export class RowActionAPI extends TestAPI {
  save = async (
    tableId: string,
    rowAction: CreateRowActionRequest,
    expectations?: Expectations,
    config?: { publicUser?: boolean }
  ) => {
    return await this._post<RowAction>(`/api/tables/${tableId}/actions`, {
      body: rowAction,
      expectations,
      ...config,
    })
  }

  find = async (
    tableId: string,
    rowAction: CreateRowActionRequest,
    expectations?: Expectations,
    config?: { publicUser?: boolean }
  ) => {
    return await this._get<RowActionsResponse>(
      `/api/tables/${tableId}/actions`,
      {
        body: rowAction,
        expectations,
        ...config,
      }
    )
  }
}
