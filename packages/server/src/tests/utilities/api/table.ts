import {
  BulkImportRequest,
  BulkImportResponse,
  MigrateRequest,
  MigrateResponse,
  Row,
  SaveTableRequest,
  SaveTableResponse,
  Table,
  TableSchema,
  ValidateTableImportRequest,
  ValidateTableImportResponse,
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

  get = async (
    tableId: string,
    expectations?: Expectations
  ): Promise<Table> => {
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

  import = async (
    tableId: string,
    data: BulkImportRequest,
    expectations?: Expectations
  ): Promise<BulkImportResponse> => {
    return await this._post<BulkImportResponse>(
      `/api/tables/${tableId}/import`,
      {
        body: data,
        expectations,
      }
    )
  }

  destroy = async (
    tableId: string,
    revId: string,
    expectations?: Expectations
  ): Promise<void> => {
    return await this._delete(`/api/tables/${tableId}/${revId}`, {
      expectations,
    })
  }

  validateNewTableImport = async (
    rows: Row[],
    schema: TableSchema,
    expectations?: Expectations
  ): Promise<ValidateTableImportResponse> => {
    return await this._post<ValidateTableImportResponse>(
      `/api/tables/validateNewTableImport`,
      {
        body: {
          rows,
          schema,
        },
        expectations,
      }
    )
  }

  validateExistingTableImport = async (
    body: ValidateTableImportRequest,
    expectations?: Expectations
  ): Promise<ValidateTableImportResponse> => {
    return await this._post<ValidateTableImportResponse>(
      `/api/tables/validateExistingTableImport`,
      {
        body,
        expectations,
      }
    )
  }
}
