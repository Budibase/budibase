import {
  DeleteScreenResponse,
  SaveScreenRequest,
  SaveScreenResponse,
  UsageInScreensResponse,
} from "@budibase/types"
import { BaseAPIClient } from "./types"

export interface ScreenEndpoints {
  saveScreen: (screen: SaveScreenRequest) => Promise<SaveScreenResponse>
  deleteScreen: (id: string, rev: string) => Promise<DeleteScreenResponse>
  usageInScreens: (sourceId: string) => Promise<UsageInScreensResponse>
}

export const buildScreenEndpoints = (API: BaseAPIClient): ScreenEndpoints => ({
  /**
   * Saves a screen definition
   * @param screen the screen to save
   */
  saveScreen: async screen => {
    const result = await API.post<SaveScreenRequest, SaveScreenResponse>({
      url: "/api/screens",
      body: screen,
    })
    return result
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

  usageInScreens: async sourceId => {
    return await API.post({
      url: `/api/screens/usage/${sourceId}`,
    })
  },
})
