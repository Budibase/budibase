import { Row } from "@budibase/types"
import { BaseAPIClient } from "./types"

export interface ViewEndpoints {
  // Missing request or response types
  fetchViewData: (
    name: string,
    opts: {
      calculation?: string
      field?: string
      groupBy?: string
      tableId: string
    }
  ) => Promise<Row[]>
  exportView: (name: string, format: string) => Promise<any>
  saveView: (view: any) => Promise<any>
  deleteView: (name: string) => Promise<any>
}

export const buildViewEndpoints = (API: BaseAPIClient): ViewEndpoints => ({
  /**
   * Fetches all rows in a view
   * @param name the name of the view
   * @param field the field to perform the calculation on
   * @param groupBy the field to group by
   * @param calculation the calculation to perform
   */
  fetchViewData: async (name, { field, groupBy, calculation }) => {
    const params = new URLSearchParams()
    if (calculation) {
      if (field) {
        params.set("field", field)
      }
      params.set("calculation", calculation)
    }
    if (groupBy) {
      params.set("group", groupBy)
    }
    const QUERY_VIEW_URL = field
      ? `/api/views/${encodeURIComponent(name)}?${params}`
      : `/api/views/${encodeURIComponent(name)}`
    return await API.get({ url: QUERY_VIEW_URL })
  },

  /**
   * Exports a view for download
   * @param name the view to export
   * @param format the format to download
   */
  exportView: async (name, format) => {
    const safeViewName = encodeURIComponent(name)
    return await API.get({
      url: `/api/views/export?view=${safeViewName}&format=${format}`,
      parseResponse: async response => {
        return await response.text()
      },
    })
  },

  /**
   * Saves a view.
   * @param view the view to save
   */
  saveView: async view => {
    return await API.post({
      url: "/api/views",
      body: view,
    })
  },

  /**
   * Deletes a view.
   * @param viewName the name of the view to delete
   */
  deleteView: async name => {
    return await API.delete({
      url: `/api/views/${encodeURIComponent(name)}`,
    })
  },
})
