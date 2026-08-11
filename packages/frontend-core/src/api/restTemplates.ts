import type {
  CustomRestTemplateId,
  DeleteCustomRestTemplateResponse,
  FetchCustomRestTemplatesResponse,
  UpdateCustomRestTemplateResponse,
  UploadCustomRestTemplateResponse,
} from "@budibase/types"
import type { BaseAPIClient } from "./types"

interface UploadCustomRestTemplateParams {
  name: string
  description: string
  file: File
}

interface UpdateCustomRestTemplateParams
  extends UploadCustomRestTemplateParams {
  restTemplateId: CustomRestTemplateId
}

export interface RestTemplateEndpoints {
  getCustomRestTemplates: () => Promise<FetchCustomRestTemplatesResponse>
  uploadCustomRestTemplate: (
    params: UploadCustomRestTemplateParams
  ) => Promise<UploadCustomRestTemplateResponse>
  updateCustomRestTemplate: (
    params: UpdateCustomRestTemplateParams
  ) => Promise<UpdateCustomRestTemplateResponse>
  deleteCustomRestTemplate: (
    restTemplateId: CustomRestTemplateId
  ) => Promise<DeleteCustomRestTemplateResponse>
}

export const buildRestTemplateEndpoints = (
  API: BaseAPIClient
): RestTemplateEndpoints => ({
  getCustomRestTemplates: async () => {
    return await API.get({
      url: "/api/rest-templates",
    })
  },

  uploadCustomRestTemplate: async ({ name, description, file }) => {
    const body = new FormData()
    body.append("name", name)
    body.append("description", description)
    body.append("file", file)

    return await API.post<FormData, UploadCustomRestTemplateResponse>({
      url: "/api/rest-templates",
      body,
      json: false,
    })
  },

  updateCustomRestTemplate: async ({
    restTemplateId,
    name,
    description,
    file,
  }) => {
    const body = new FormData()
    body.append("name", name)
    body.append("description", description)
    body.append("file", file)

    return await API.put<FormData, UpdateCustomRestTemplateResponse>({
      url: `/api/rest-templates/${encodeURIComponent(restTemplateId)}`,
      body,
      json: false,
    })
  },

  deleteCustomRestTemplate: async restTemplateId => {
    return await API.delete({
      url: `/api/rest-templates/${encodeURIComponent(restTemplateId)}`,
    })
  },
})
