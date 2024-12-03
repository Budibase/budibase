import {
  ExecuteQueryRequest,
  ExecuteQueryResponse,
  PreviewQueryRequest,
  PreviewQueryResponse,
  Query,
} from "@budibase/types"
import { BaseAPIClient } from "./types"

export interface QueryEndpoints {
  executeQuery: (
    queryId: string,
    opts?: ExecuteQueryRequest
  ) => Promise<ExecuteQueryResponse | Record<string, any>[]>
  fetchQueryDefinition: (queryId: string) => Promise<Query>
  getQueries: () => Promise<Query[]>
  saveQuery: (query: Query) => Promise<Query>
  deleteQuery: (id: string, rev: string) => Promise<void>
  previewQuery: (query: PreviewQueryRequest) => Promise<PreviewQueryResponse>

  // Missing request or response types
  importQueries: (datasourceId: string, data: any) => Promise<any>
}

export const buildQueryEndpoints = (API: BaseAPIClient): QueryEndpoints => ({
  /**
   * Executes a query against an external data connector.
   * @param queryId the ID of the query to execute
   * @param pagination pagination info for the query
   * @param parameters parameters for the query
   */
  executeQuery: async (queryId, { pagination, parameters } = {}) => {
    return await API.post<
      ExecuteQueryRequest,
      ExecuteQueryResponse | Record<string, any>[]
    >({
      url: `/api/v2/queries/${queryId}`,
      body: {
        parameters,
        pagination,
      },
    })
  },

  /**
   * Fetches the definition of an external query.
   * @param queryId the ID of thr query to fetch the definition of
   */
  fetchQueryDefinition: async queryId => {
    return await API.get({
      url: `/api/queries/${queryId}`,
      cache: true,
    })
  },

  /**
   * Gets a list of queries
   */
  getQueries: async () => {
    return await API.get({
      url: "/api/queries",
    })
  },

  /**
   * Saves a query.
   * @param query the query to save
   */
  saveQuery: async query => {
    return await API.post({
      url: "/api/queries",
      body: query,
    })
  },

  /**
   * Deletes a query
   * @param id the ID of the query to delete
   * @param rev the rev of the query to delete
   */
  deleteQuery: async (id, rev) => {
    return await API.delete({
      url: `/api/queries/${id}/${rev}`,
    })
  },

  /**
   * Imports a set of queries into a certain datasource
   * @param datasourceId the datasource ID to import queries into
   * @param data the data string of the content to import
   */
  importQueries: async (datasourceId, data) => {
    return await API.post({
      url: "/api/queries/import",
      body: {
        datasourceId,
        data,
      },
    })
  },

  /**
   * Runs a query with test parameters to see the result.
   * @param query the query to run
   */
  previewQuery: async query => {
    return await API.post({
      url: "/api/queries/preview",
      body: query,
    })
  },
})
