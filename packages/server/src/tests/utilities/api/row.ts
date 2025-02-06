import {
  PatchRowRequest,
  SaveRowRequest,
  Row,
  ValidateRowResponse,
  ExportRowsRequest,
  BulkImportRequest,
  BulkImportResponse,
  SearchRowResponse,
  DeleteRows,
  DeleteRow,
  PaginatedSearchRowResponse,
  RowExportFormat,
  SearchRowRequest,
} from "@budibase/types"
import { Expectations, TestAPI } from "./base"

export class RowAPI extends TestAPI {
  get = async (
    sourceId: string,
    rowId: string,
    expectations?: Expectations
  ) => {
    return await this._get<Row>(`/api/${sourceId}/rows/${rowId}`, {
      expectations,
    })
  }

  getEnriched = async (
    sourceId: string,
    rowId: string,
    expectations?: Expectations
  ) => {
    return await this._get<Row>(`/api/${sourceId}/${rowId}/enrich`, {
      expectations,
    })
  }

  save = async (
    tableId: string,
    row: SaveRowRequest,
    expectations?: Expectations
  ): Promise<Row> => {
    return await this._post<Row>(`/api/${tableId}/rows`, {
      body: row,
      expectations,
    })
  }

  validate = async (
    sourceId: string,
    row: SaveRowRequest,
    expectations?: Expectations
  ): Promise<ValidateRowResponse> => {
    return await this._post<ValidateRowResponse>(
      `/api/${sourceId}/rows/validate`,
      {
        body: row,
        expectations,
      }
    )
  }

  patch = async (
    sourceId: string,
    row: PatchRowRequest,
    expectations?: Expectations
  ): Promise<Row> => {
    return await this._patch<Row>(`/api/${sourceId}/rows`, {
      body: row,
      expectations,
    })
  }

  delete = async (
    sourceId: string,
    row: DeleteRow,
    expectations?: Expectations
  ) => {
    return await this._delete<Row>(`/api/${sourceId}/rows`, {
      body: row,
      expectations,
    })
  }

  bulkDelete = async (
    sourceId: string,
    body: DeleteRows,
    expectations?: Expectations
  ) => {
    return await this._delete<Row[]>(`/api/${sourceId}/rows`, {
      body,
      expectations,
    })
  }

  fetch = async (
    sourceId: string,
    expectations?: Expectations
  ): Promise<Row[]> => {
    return await this._get<Row[]>(`/api/${sourceId}/rows`, {
      expectations,
    })
  }

  exportRows = async (
    tableId: string,
    body?: ExportRowsRequest,
    format: RowExportFormat = RowExportFormat.JSON,
    expectations?: Expectations
  ) => {
    const response = await this._requestRaw(
      "post",
      `/api/${tableId}/rows/exportRows`,
      {
        body,
        query: { format },
        expectations,
      }
    )
    this._checkResponse(response, expectations)
    return response.text
  }

  bulkImport = async (
    tableId: string,
    body: BulkImportRequest,
    expectations?: Expectations
  ): Promise<BulkImportResponse> => {
    return await this._post<BulkImportResponse>(
      `/api/tables/${tableId}/import`,
      {
        body,
        expectations,
      }
    )
  }

  search = async <T extends SearchRowRequest>(
    sourceId: string,
    params?: T,
    expectations?: Expectations
  ): Promise<
    T extends { paginate: true }
      ? PaginatedSearchRowResponse
      : SearchRowResponse
  > => {
    return await this._post<
      T extends { paginate: true }
        ? PaginatedSearchRowResponse
        : SearchRowResponse
    >(`/api/${sourceId}/search`, {
      body: params,
      expectations,
    })
  }
}
