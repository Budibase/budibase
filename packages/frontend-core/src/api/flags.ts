import {
  GetUserFlagsResponse,
  SetUserFlagRequest,
  SetUserFlagResponse,
} from "@budibase/types"
import { BaseAPIClient } from "./types"

export interface FlagEndpoints {
  getFlags: () => Promise<GetUserFlagsResponse>
  updateFlag: (flag: string, value: any) => Promise<SetUserFlagResponse>
}

export const buildFlagEndpoints = (API: BaseAPIClient): FlagEndpoints => ({
  /**
   * Gets the current user flags object.
   */
  getFlags: async () => {
    return await API.get({
      url: "/api/users/flags",
    })
  },

  /**
   * Updates a flag for the current user.
   * @param flag the flag to update
   * @param value the value to set the flag to
   */
  updateFlag: async (flag, value) => {
    return await API.post<SetUserFlagRequest, SetUserFlagResponse>({
      url: "/api/users/flags",
      body: {
        flag,
        value,
      },
    })
  },
})
