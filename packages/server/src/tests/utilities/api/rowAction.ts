import { CreateRowActionRequest, Row, RowAction } from "@budibase/types"
import { Expectations, TestAPI } from "./base"

export class RowActionAPI extends TestAPI {
  save = async (
    tableId: string,
    rowAction: CreateRowActionRequest,
    expectations?: Expectations,
    config?: { publicUser?: boolean }
  ): Promise<Row> => {
    return await this._post<RowAction>(`/api/tables/${tableId}/actions`, {
      body: rowAction,
      expectations,
      ...config,
    })
  }
}
