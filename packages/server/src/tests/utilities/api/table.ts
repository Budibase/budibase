import {
  BulkImportRequest,
  BulkImportResponse,
  CsvToJsonRequest,
  CsvToJsonResponse,
  MigrateTableRequest,
  MigrateTableResponse,
  SaveTableRequest,
  SaveTableResponse,
  Table,
  ValidateNewTableImportRequest,
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
    data: MigrateTableRequest,
    expectations?: Expectations
  ): Promise<MigrateTableResponse> => {
    return await this._post<MigrateTableResponse>(
      `/api/tables/${tableId}/migrate`,
      {
        body: data,
        expectations,
      }
    )
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
    body: ValidateNewTableImportRequest,
    expectations?: Expectations
  ): Promise<ValidateTableImportResponse> => {
    return await this._post<ValidateTableImportResponse>(
      `/api/tables/validateNewTableImport`,
      {
        body,
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

  csvToJson = async (
    body: CsvToJsonRequest,
    expectations?: Expectations
  ): Promise<CsvToJsonResponse> => {
    return await this._post<CsvToJsonResponse>(`/api/convert/csvToJson`, {
      body,
      expectations,
    })
  }
}
