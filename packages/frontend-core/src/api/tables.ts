import {
  BulkImportRequest,
  BulkImportResponse,
  CsvToJsonRequest,
  CsvToJsonResponse,
  FetchTablesResponse,
  Row,
  SaveTableRequest,
  SaveTableResponse,
  SearchRowRequest,
  PaginatedSearchRowResponse,
  TableSchema,
  ValidateNewTableImportRequest,
  ValidateTableImportRequest,
  ValidateTableImportResponse,
  FindTableResponse,
  FetchRowsResponse,
  MigrateTableResponse,
  MigrateTableRequest,
  DeleteTableResponse,
} from "@budibase/types"
import { BaseAPIClient } from "./types"

export interface TableEndpoints {
  fetchTableDefinition: (tableId: string) => Promise<FindTableResponse>
  fetchTableData: (tableId: string) => Promise<FetchRowsResponse>
  searchTable: (
    sourceId: string,
    opts: SearchRowRequest
  ) => Promise<PaginatedSearchRowResponse>
  importTableData: (
    tableId: string,
    rows: Row[],
    identifierFields?: string[]
  ) => Promise<BulkImportResponse>
  csvToJson: (csvString: string) => Promise<CsvToJsonResponse>
  getTables: () => Promise<FetchTablesResponse>
  getTable: (tableId: string) => Promise<FindTableResponse>
  saveTable: (table: SaveTableRequest) => Promise<SaveTableResponse>
  deleteTable: (id: string, rev: string) => Promise<DeleteTableResponse>
  validateNewTableImport: (
    rows: Row[],
    schema: TableSchema
  ) => Promise<ValidateTableImportResponse>
  validateExistingTableImport: (
    rows: Row[],
    tableId?: string
  ) => Promise<ValidateTableImportResponse>
  migrateColumn: (
    tableId: string,
    oldColumn: string,
    newColumn: string
  ) => Promise<MigrateTableResponse>
}

export const buildTableEndpoints = (API: BaseAPIClient): TableEndpoints => ({
  /**
   * Fetches a table definition.
   * Since definitions cannot change at runtime, the result is cached.
   * @param tableId the ID of the table to fetch
   */
  fetchTableDefinition: async tableId => {
    return await API.get({
      url: `/api/tables/${tableId}`,
      cache: true,
    })
  },

  /**
   * Fetches all rows from a table.
   * @param sourceId the ID of the table to fetch
   */
  fetchTableData: async sourceId => {
    return await API.get({ url: `/api/${sourceId}/rows` })
  },

  /**
   * Searches a table using Lucene.
   * @param sourceId the ID of the table to search
   * @param opts the search opts
   */
  searchTable: async (sourceId, opts) => {
    return await API.post({
      url: `/api/${sourceId}/search`,
      body: opts,
    })
  },

  /**
   * Imports data into an existing table
   * @param tableId the table ID to import to
   * @param rows the data import object
   * @param identifierFields column names to be used as keys for overwriting existing rows
   */
  importTableData: async (tableId, rows, identifierFields) => {
    return await API.post<BulkImportRequest, BulkImportResponse>({
      url: `/api/tables/${tableId}/import`,
      body: {
        rows,
        identifierFields,
      },
    })
  },

  /**
   * Converts a CSV string to JSON
   * @param csvString the CSV string
   */
  csvToJson: async csvString => {
    return await API.post<CsvToJsonRequest, CsvToJsonResponse>({
      url: "/api/convert/csvToJson",
      body: {
        csvString,
      },
    })
  },

  /**
   * Gets a list of tables.
   */
  getTables: async () => {
    return await API.get({
      url: "/api/tables",
    })
  },

  /**
   * Get a single table based on table ID.
   * Dupe of fetchTableDefinition but not cached?
   */
  getTable: async tableId => {
    return await API.get({
      url: `/api/tables/${tableId}`,
    })
  },

  /**
   * Saves a table.
   * @param table the table to save
   */
  saveTable: async table => {
    return await API.post({
      url: "/api/tables",
      body: table,
    })
  },

  /**
   * Deletes a table.
   * @param id the ID of the table to delete
   * @param rev the rev of the table to delete
   */
  deleteTable: async (id, rev) => {
    return await API.delete({
      url: `/api/tables/${id}/${rev}`,
    })
  },

  validateNewTableImport: async (rows, schema) => {
    return await API.post<
      ValidateNewTableImportRequest,
      ValidateTableImportResponse
    >({
      url: "/api/tables/validateNewTableImport",
      body: {
        rows,
        schema,
      },
    })
  },
  validateExistingTableImport: async (rows, tableId) => {
    return await API.post<
      ValidateTableImportRequest,
      ValidateTableImportResponse
    >({
      url: "/api/tables/validateExistingTableImport",
      body: {
        rows,
        tableId,
      },
    })
  },
  migrateColumn: async (tableId, oldColumn, newColumn) => {
    return await API.post<MigrateTableRequest, MigrateTableResponse>({
      url: `/api/tables/${tableId}/migrate`,
      body: {
        oldColumn,
        newColumn,
      },
    })
  },
})
