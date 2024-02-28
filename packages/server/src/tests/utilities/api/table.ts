import {
  MigrateRequest,
  MigrateResponse,
  SaveTableRequest,
  SaveTableResponse,
  Table,
} from "@budibase/types"
import { TestAPI, TestAPIOpts } from "./base"

export class TableAPI extends TestAPI {
  save = async (
    data: SaveTableRequest,
    opts?: TestAPIOpts
  ): Promise<SaveTableResponse> => {
    return await this._post<SaveTableResponse>("/api/tables", data, opts)
  }

  fetch = async (opts?: TestAPIOpts): Promise<Table[]> => {
    return await this._get<Table[]>("/api/tables", opts)
  }

  get = async (tableId: string, opts?: TestAPIOpts): Promise<Table> => {
    return await this._get<Table>(`/api/tables/${tableId}`, opts)
  }

  migrate = async (
    tableId: string,
    data: MigrateRequest,
    opts?: TestAPIOpts
  ): Promise<MigrateResponse> => {
    return await this._post<MigrateResponse>(
      `/api/tables/${tableId}/migrate`,
      data,
      opts
    )
  }
}
