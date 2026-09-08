import {
  CreateProjectRequest,
  CreateProjectResponse,
  ExportProjectRequest,
  FetchProjectsResponse,
  ImportProjectRequest,
  ImportProjectResponse,
  PreviewProjectAssignmentRequest,
  PreviewProjectAssignmentResponse,
  UpdateProjectRequest,
  UpdateProjectResponse,
  UpdateProjectAssignmentRequest,
  UpdateProjectAssignmentResponse,
} from "@budibase/types"
import { BaseAPIClient } from "./types"

export interface ProjectEndpoints {
  fetch: () => Promise<FetchProjectsResponse>
  create: (project: CreateProjectRequest) => Promise<CreateProjectResponse>
  exportBundle: (id: string, body?: ExportProjectRequest) => Promise<Response>
  importBundle: (
    file: File,
    body?: ImportProjectRequest
  ) => Promise<ImportProjectResponse>
  update: (project: UpdateProjectRequest) => Promise<UpdateProjectResponse>
  previewAssignment: (
    request: PreviewProjectAssignmentRequest
  ) => Promise<PreviewProjectAssignmentResponse>
  updateAssignment: (
    resourceId: string,
    request: UpdateProjectAssignmentRequest
  ) => Promise<UpdateProjectAssignmentResponse>
  delete: (id: string, rev: string) => Promise<void>
}

export const buildProjectEndpoints = (
  API: BaseAPIClient
): ProjectEndpoints => ({
  fetch: async () => {
    return await API.get({
      url: "/api/projects",
    })
  },
  create: async project => {
    return await API.post({
      url: "/api/projects",
      body: project,
    })
  },
  exportBundle: async (id, body) => {
    return await API.post<ExportProjectRequest | undefined, Response>({
      url: `/api/projects/${id}/export`,
      body,
      parseResponse: response => response,
    })
  },
  importBundle: async (file, body) => {
    const formData = new FormData()
    formData.append("file", file)
    for (const [key, value] of Object.entries(body || {})) {
      if (value !== undefined) {
        formData.append(key, value)
      }
    }
    return await API.post<FormData, ImportProjectResponse>({
      url: "/api/projects/import",
      body: formData,
      json: false,
    })
  },
  update: async project => {
    const { _id, _rev, name, description, color } = project
    return await API.put({
      url: `/api/projects/${_id}`,
      body: {
        _id,
        _rev,
        name,
        description,
        color,
      },
    })
  },
  previewAssignment: async request => {
    return await API.post<
      PreviewProjectAssignmentRequest,
      PreviewProjectAssignmentResponse
    >({
      url: "/api/projects/assignments/preview",
      body: request,
    })
  },
  updateAssignment: async (resourceId, request) => {
    return await API.put<
      UpdateProjectAssignmentRequest,
      UpdateProjectAssignmentResponse
    >({
      url: `/api/projects/assignments/${resourceId}`,
      body: request,
    })
  },
  delete: async (id, rev) => {
    return await API.delete({
      url: `/api/projects/${id}/${rev}`,
    })
  },
})
