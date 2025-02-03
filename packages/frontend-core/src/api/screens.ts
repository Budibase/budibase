import {
  DeleteScreenResponse,
  SaveScreenRequest,
  SaveScreenResponse,
  UsageOfScreensResponse,
} from "@budibase/types"
import { BaseAPIClient } from "./types"

export interface ScreenEndpoints {
  saveScreen: (screen: SaveScreenRequest) => Promise<SaveScreenResponse>
  deleteScreen: (id: string, rev: string) => Promise<DeleteScreenResponse>
  usageOfScreens: (sourceId: string) => Promise<UsageOfScreensResponse>
}

export const buildScreenEndpoints = (API: BaseAPIClient): ScreenEndpoints => ({
  /**
   * Saves a screen definition
   * @param screen the screen to save
   */
  saveScreen: async screen => {
    return await API.post({
      url: "/api/screens",
      body: screen,
    })
  },

  /**
   * Deletes a screen.
   * @param id the ID of the screen to delete
   * @param rev the rev of the screen to delete
   */
  deleteScreen: async (id, rev) => {
    return await API.delete({
      url: `/api/screens/${id}/${rev}`,
    })
  },

  usageOfScreens: async sourceId => {
    return await API.post({
      url: `/api/screens/usage/${sourceId}`,
    })
  },
})
