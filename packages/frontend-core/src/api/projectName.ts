import {
  InsertProjectAppRequest,
  InsertProjectAppResponse,
  UpdateProjectAppRequest,
  UpdateProjectAppResponse,
} from "@budibase/types"
import { BaseAPIClient } from "./types"

export interface ProjectAppEndpoints {
  create: (
    projectApp: InsertProjectAppRequest
  ) => Promise<InsertProjectAppResponse>
  update: (
    projectApp: UpdateProjectAppRequest
  ) => Promise<UpdateProjectAppResponse>
  delete: (id: string, rev: string) => Promise<void>
}

export const buildProjectAppEndpoints = (
  API: BaseAPIClient
): ProjectAppEndpoints => ({
  create: async projectApp => {
    const result = await API.post<
      InsertProjectAppRequest,
      InsertProjectAppResponse
    >({
      url: "/api/projectApp",
      body: projectApp,
    })
    return result
  },
  update: async projectApp => {
    const result = await API.put<
      UpdateProjectAppRequest,
      UpdateProjectAppResponse
    >({
      url: `/api/projectApp/${projectApp._id}`,
      body: projectApp,
    })
    return result
  },

  delete: async (id, rev) => {
    return await API.delete({
      url: `/api/screens/${id}/${rev}`,
    })
  },
})
