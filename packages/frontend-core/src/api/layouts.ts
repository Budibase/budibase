import {
  DeleteLayoutResponse,
  SaveLayoutRequest,
  SaveLayoutResponse,
} from "@budibase/types"
import { BaseAPIClient } from "./types"

export interface LayoutEndpoints {
  saveLayout: (layout: SaveLayoutRequest) => Promise<SaveLayoutResponse>
  deleteLayout: (id: string, rev: string) => Promise<DeleteLayoutResponse>
}

export const buildLayoutEndpoints = (API: BaseAPIClient): LayoutEndpoints => ({
  /**
   * Saves a layout.
   * @param layout the layout to save
   */
  saveLayout: async layout => {
    return await API.post({
      url: "/api/layouts",
      body: layout,
    })
  },

  /**
   * Deletes a layout.
   * @param layoutId the ID of the layout to delete
   * @param layoutRev the rev of the layout to delete
   */
  deleteLayout: async (id: string, rev: string) => {
    return await API.delete({
      url: `/api/layouts/${id}/${rev}`,
    })
  },
})
