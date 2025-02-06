import { BaseAPIClient } from "./types"
import {
  DeleteMediaResponse,
  FetchMediaResponse,
  UploadMediaRequest,
  UploadMediaResponse,
} from "@budibase/types"

export interface MediaEndpoints {
  uploadTenantMedia: (data: UploadMediaRequest) => Promise<UploadMediaResponse>
  fetchTenantMedia: () => Promise<FetchMediaResponse>
  deleteTenantMedia: (request: string) => Promise<DeleteMediaResponse>
}

export const buildMediaEndpoints = (API: BaseAPIClient): MediaEndpoints => ({
  /**
   *
   */
  uploadTenantMedia: async (data: UploadMediaRequest) => {
    return await API.post({
      url: `/api/global/assets/upload`,
      body: data,
      json: false,
    })
  },

  /**
   *
   */
  deleteTenantMedia: async (filename: string) => {
    return await API.delete({
      url: `/api/global/assets/${filename}`,
    })
  },

  /**
   *
   */
  fetchTenantMedia: async () => {
    return await API.get({
      url: `/api/global/assets`,
    })
  },
})
