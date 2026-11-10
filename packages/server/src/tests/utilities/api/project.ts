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
import { Expectations, TestAPI } from "./base"

interface ImportProjectParams {
  file: Buffer | string
  body?: ImportProjectRequest
  expectations?: Expectations
}

export class ProjectAPI extends TestAPI {
  fetch = async (expectations?: Expectations) => {
    return await this._get<FetchProjectsResponse>("/api/projects", {
      expectations,
    })
  }

  create = async (
    project: CreateProjectRequest,
    expectations?: Expectations
  ) => {
    return await this._post<CreateProjectResponse>("/api/projects", {
      body: project,
      expectations: {
        status: 201,
        ...expectations,
      },
    })
  }

  export = async (
    id: string,
    body?: ExportProjectRequest,
    expectations?: Expectations
  ) => {
    const expectsError = (expectations?.status || 200) >= 400
    const exp = {
      ...expectations,
      headers: {
        ...expectations?.headers,
        ...(expectsError ? {} : { "Content-Type": "application/gzip" }),
      },
    }

    return await this._post<Buffer>(`/api/projects/${id}/export`, {
      body,
      expectations: exp,
    })
  }

  import = async (
    fileOrParams: Buffer | string | ImportProjectParams,
    body?: ImportProjectRequest,
    expectations?: Expectations
  ) => {
    const params =
      typeof fileOrParams === "object" && !Buffer.isBuffer(fileOrParams)
        ? fileOrParams
        : {
            file: fileOrParams,
            body,
            expectations,
          }

    return await this._post<ImportProjectResponse>(`/api/projects/import`, {
      fields: params.body,
      files: {
        file: {
          file: params.file,
          name: "project-export.tar.gz",
        },
      },
      expectations: params.expectations,
    })
  }

  update = async (
    project: UpdateProjectRequest,
    expectations?: Expectations
  ) => {
    return await this._put<UpdateProjectResponse>(
      `/api/projects/${project._id}`,
      {
        body: project,
        expectations,
      }
    )
  }

  previewAssignment = async (
    request: PreviewProjectAssignmentRequest,
    expectations?: Expectations
  ) => {
    return await this._post<PreviewProjectAssignmentResponse>(
      "/api/projects/assignments/preview",
      {
        body: request,
        expectations,
      }
    )
  }

  updateAssignment = async (
    resourceId: string,
    request: UpdateProjectAssignmentRequest,
    expectations?: Expectations
  ) => {
    return await this._put<UpdateProjectAssignmentResponse>(
      `/api/projects/assignments/${resourceId}`,
      {
        body: request,
        expectations,
      }
    )
  }

  delete = async (id: string, rev: string, expectations?: Expectations) => {
    return await this._delete<void>(`/api/projects/${id}/${rev}`, {
      expectations: {
        status: 204,
        ...expectations,
      },
    })
  }
}
