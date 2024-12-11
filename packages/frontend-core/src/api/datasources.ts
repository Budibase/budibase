import {
  BuildSchemaFromSourceRequest,
  BuildSchemaFromSourceResponse,
  CreateDatasourceRequest,
  CreateDatasourceResponse,
  Datasource,
  DeleteDatasourceResponse,
  FetchDatasourceInfoRequest,
  FetchDatasourceInfoResponse,
  FetchExternalSchemaResponse,
  UpdateDatasourceRequest,
  UpdateDatasourceResponse,
  VerifyDatasourceRequest,
  VerifyDatasourceResponse,
} from "@budibase/types"
import { BaseAPIClient } from "./types"

export interface DatasourceEndpoints {
  getDatasources: () => Promise<Datasource[]>
  buildDatasourceSchema: (
    datasourceId: string,
    tablesFilter?: string[]
  ) => Promise<BuildSchemaFromSourceResponse>
  createDatasource: (
    data: CreateDatasourceRequest
  ) => Promise<CreateDatasourceResponse>
  updateDatasource: (
    datasource: Datasource
  ) => Promise<UpdateDatasourceResponse>
  deleteDatasource: (
    id: string,
    rev: string
  ) => Promise<DeleteDatasourceResponse>
  validateDatasource: (
    datasource: Datasource
  ) => Promise<VerifyDatasourceResponse>
  fetchInfoForDatasource: (
    datasource: Datasource
  ) => Promise<FetchDatasourceInfoResponse>
  fetchExternalSchema: (
    datasourceId: string
  ) => Promise<FetchExternalSchemaResponse>
}

export const buildDatasourceEndpoints = (
  API: BaseAPIClient
): DatasourceEndpoints => ({
  /**
   * Gets a list of datasources.
   */
  getDatasources: async () => {
    return await API.get({
      url: "/api/datasources",
    })
  },

  /**
   * Prompts the server to build the schema for a datasource.
   */
  buildDatasourceSchema: async (datasourceId, tablesFilter?) => {
    return await API.post<
      BuildSchemaFromSourceRequest,
      BuildSchemaFromSourceResponse
    >({
      url: `/api/datasources/${datasourceId}/schema`,
      body: {
        tablesFilter,
      },
    })
  },

  /**
   * Creates a datasource
   */
  createDatasource: async data => {
    return await API.post({
      url: "/api/datasources",
      body: data,
    })
  },

  /**
   * Updates a datasource
   */
  updateDatasource: async datasource => {
    return await API.put<UpdateDatasourceRequest, UpdateDatasourceResponse>({
      url: `/api/datasources/${datasource._id}`,
      body: datasource,
    })
  },

  /**
   * Deletes a datasource.
   */
  deleteDatasource: async (id: string, rev: string) => {
    return await API.delete({
      url: `/api/datasources/${id}/${rev}`,
    })
  },

  /**
   * Validate a datasource configuration
   */
  validateDatasource: async (datasource: Datasource) => {
    return await API.post<VerifyDatasourceRequest, VerifyDatasourceResponse>({
      url: `/api/datasources/verify`,
      body: { datasource },
    })
  },

  /**
   * Fetch table names available within the datasource, for filtering out undesired tables
   */
  fetchInfoForDatasource: async (datasource: Datasource) => {
    return await API.post<
      FetchDatasourceInfoRequest,
      FetchDatasourceInfoResponse
    >({
      url: `/api/datasources/info`,
      body: { datasource },
    })
  },

  /**
   * Fetches the external schema of a datasource
   */
  fetchExternalSchema: async (datasourceId: string) => {
    return await API.get({
      url: `/api/datasources/${datasourceId}/schema/external`,
    })
  },
})
