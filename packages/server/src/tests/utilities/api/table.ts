import {
  MigrateRequest,
  MigrateResponse,
  SaveTableRequest,
  SaveTableResponse,
  Table,
} from "@budibase/types"
import { Expectations, TestAPI } from "./base"

export class TableAPI extends TestAPI {
  save = async (
    data: SaveTableRequest,
    expectations?: Expectations
  ): Promise<SaveTableResponse> => {
    return await this._post<SaveTableResponse>("/api/tables", {
      body: data,
      expectations,
    })
  }

  fetch = async (expectations?: Expectations): Promise<Table[]> => {
    return await this._get<Table[]>("/api/tables", { expectations })
  }

  get = async (tableId: string, expectations: Expectations): Promise<Table> => {
    return await this._get<Table>(`/api/tables/${tableId}`, { expectations })
  }

  migrate = async (
    tableId: string,
    data: MigrateRequest,
    expectations?: Expectations
  ): Promise<MigrateResponse> => {
    return await this._post<MigrateResponse>(`/api/tables/${tableId}/migrate`, {
      body: data,
      expectations,
    })
  }
}
