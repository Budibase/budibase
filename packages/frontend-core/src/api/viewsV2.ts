import {
  CreateViewRequest,
  CreateViewResponse,
  PaginatedSearchRowResponse,
  SearchRowResponse,
  SearchViewRowRequest,
  UpdateViewRequest,
  UpdateViewResponse,
  ViewResponseEnriched,
} from "@budibase/types"
import { BaseAPIClient } from "./types"

export interface ViewV2Endpoints {
  fetchDefinition: (viewId: string) => Promise<ViewResponseEnriched>
  create: (view: CreateViewRequest) => Promise<CreateViewResponse>
  update: (view: UpdateViewRequest) => Promise<UpdateViewResponse>
  fetch: <T extends SearchViewRowRequest>(
    viewId: string,
    opts: T
  ) => Promise<
    T extends { paginate: true }
      ? PaginatedSearchRowResponse
      : SearchRowResponse
  >
  delete: (viewId: string) => Promise<void>
}

export const buildViewV2Endpoints = (API: BaseAPIClient): ViewV2Endpoints => ({
  /**
   * Fetches the definition of a view
   * @param viewId the ID of the view to fetch
   */
  fetchDefinition: async viewId => {
    return await API.get({
      url: `/api/v2/views/${encodeURIComponent(viewId)}`,
      cache: true,
    })
  },

  /**
   * Create a new view
   * @param view the view object
   */
  create: async view => {
    return await API.post({
      url: `/api/v2/views`,
      body: view,
    })
  },

  /**
   * Updates a view
   * @param view the view object
   */
  update: async view => {
    return await API.put({
      url: `/api/v2/views/${encodeURIComponent(view.id)}`,
      body: view,
    })
  },

  /**
   * Fetches all rows in a view
   * @param viewId the id of the view
   * @param opts the search options
   */
  fetch: async (viewId, opts: SearchViewRowRequest) => {
    return await API.post({
      url: `/api/v2/views/${encodeURIComponent(viewId)}/search`,
      body: opts,
    })
  },

  /**
   * Delete a view
   * @param viewId the id of the view
   */
  delete: async viewId => {
    return await API.delete({
      url: `/api/v2/views/${encodeURIComponent(viewId)}`,
    })
  },
})
