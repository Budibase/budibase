import {
  DeleteRowRequest,
  ExportRowsRequest,
  FindRowResponse,
  PatchRowRequest,
  PatchRowResponse,
  Row,
  SaveRowRequest,
  SaveRowResponse,
} from "@budibase/types"
import { BaseAPIClient } from "./types"

export interface RowEndpoints {
  fetchRow: (tableId: string, rowId: string) => Promise<FindRowResponse>
  saveRow: (
    row: SaveRowRequest,
    suppressErrors?: boolean
  ) => Promise<SaveRowResponse>
  patchRow: (
    row: PatchRowRequest,
    suppressErrors?: boolean
  ) => Promise<PatchRowResponse>
  deleteRow: (sourceId: string, id: string) => Promise<void>
  deleteRows: (sourceId: string, rows: (Row | string)[]) => Promise<void>
  exportRows: (
    tableId: string,
    format: string,
    data: ExportRowsRequest
  ) => Promise<string>
}

export const buildRowEndpoints = (API: BaseAPIClient): RowEndpoints => ({
  /**
   * Fetches data about a certain row in a data source.
   * @param sourceId the ID of the table or view to fetch from
   * @param rowId the ID of the row to fetch
   */
  fetchRow: async (sourceId, rowId) => {
    return await API.get({
      url: `/api/${sourceId}/rows/${rowId}`,
    })
  },

  /**
   * Creates or updates a row in a table.
   * @param row the row to save
   * @param suppressErrors whether or not to suppress error notifications
   */
  saveRow: async (row, suppressErrors = false) => {
    const sourceId = row._viewId || row.tableId
    return await API.post({
      url: `/api/${sourceId}/rows`,
      body: row,
      suppressErrors,
    })
  },

  /**
   * Patches a row in a table.
   * @param row the row to patch
   * @param suppressErrors whether or not to suppress error notifications
   */
  patchRow: async (row, suppressErrors = false) => {
    const sourceId = row._viewId || row.tableId
    return await API.patch({
      url: `/api/${sourceId}/rows`,
      body: row,
      suppressErrors,
    })
  },

  /**
   * Deletes a row from a table.
   * @param sourceId the ID of the table or view to delete from
   * @param rowId the ID of the row to delete
   */
  deleteRow: async (sourceId, rowId) => {
    return await API.delete<DeleteRowRequest>({
      url: `/api/${sourceId}/rows`,
      body: {
        _id: rowId,
      },
    })
  },

  /**
   * Deletes multiple rows from a table.
   * @param sourceId the table or view ID to delete the rows from
   * @param rows the array of rows to delete
   */
  deleteRows: async (sourceId, rows) => {
    rows.forEach(row => {
      if (typeof row === "object") {
        delete row?._viewId
      }
    })
    return await API.delete<DeleteRowRequest>({
      url: `/api/${sourceId}/rows`,
      body: {
        rows,
      },
    })
  },

  /**
   * Exports rows.
   * @param tableId the table ID to export the rows from
   * @param format the format to export (csv or json)
   * @param data the export options
   */
  exportRows: async (tableId, format, data) => {
    return await API.post({
      url: `/api/${tableId}/rows/exportRows?format=${format}`,
      body: data,
      parseResponse: async response => {
        return await response.text()
      },
    })
  },
})
