import { API } from "@/api"
import { downloadStream } from "@budibase/frontend-core"
import type {
  CreateProjectRequest,
  ImportProjectRequest,
  ImportProjectResponse,
  PreviewProjectAssignmentRequest,
  ProjectResponse,
  UpdateProjectAssignmentRequest,
  UpdateProjectRequest,
} from "@budibase/types"
import { BudiStore } from "../BudiStore"
import { get } from "svelte/store"

export class ProjectsStore extends BudiStore<ProjectResponse[]> {
  private loaded = false
  private fetchPromise: Promise<ProjectResponse[]> | undefined
  private workspaceId: string | undefined

  constructor() {
    super([])
  }

  private selectWorkspace = (workspaceId?: string) => {
    if (workspaceId === this.workspaceId) {
      return
    }

    this.workspaceId = workspaceId
    this.loaded = false
    this.fetchPromise = undefined
    this.set([])
  }

  fetch = async (workspaceId?: string) => {
    this.selectWorkspace(workspaceId)
    const promise = API.projects
      .fetch()
      .then(({ projects }) => {
        if (this.fetchPromise === promise && this.workspaceId === workspaceId) {
          this.loaded = true
          this.set(projects)
        }
        return projects
      })
      .finally(() => {
        if (this.fetchPromise === promise) {
          this.fetchPromise = undefined
        }
      })
    this.fetchPromise = promise
    return await promise
  }

  ensureFetched = async (workspaceId?: string) => {
    this.selectWorkspace(workspaceId)
    if (this.fetchPromise) {
      return await this.fetchPromise
    }
    if (this.loaded) {
      return get(this.store)
    }
    return await this.fetch(workspaceId)
  }

  hasFetched = () => this.loaded

  private invalidateFetch = () => {
    this.fetchPromise = undefined
  }

  create = async (project: CreateProjectRequest) => {
    const workspaceId = this.workspaceId
    const response = await API.projects.create(project)
    if (this.workspaceId !== workspaceId) {
      return response.project
    }
    this.invalidateFetch()
    this.update(state => [...state, response.project])
    return response.project
  }

  exportProject = async (
    id: string,
    body?: {
      encryptPassword?: string
    }
  ) => {
    const response = await API.projects.exportBundle(id, body)
    await downloadStream(response)
  }

  importProject = async (
    file: File,
    body?: ImportProjectRequest
  ): Promise<ImportProjectResponse> => {
    const response = await API.projects.importBundle(file, body)
    try {
      await this.fetch(this.workspaceId)
    } catch (err) {
      this.loaded = false
      console.warn("Failed to refresh projects after import", err)
    }
    return response
  }

  updateProject = async (project: UpdateProjectRequest) => {
    const workspaceId = this.workspaceId
    const response = await API.projects.update(project)
    if (this.workspaceId !== workspaceId) {
      return response.project
    }
    this.invalidateFetch()
    this.update(state =>
      state.map(existing =>
        existing._id === response.project._id ? response.project : existing
      )
    )
    return response.project
  }

  previewAssignment = async (request: PreviewProjectAssignmentRequest) =>
    await API.projects.previewAssignment(request)

  updateAssignment = async (
    resourceId: string,
    request: UpdateProjectAssignmentRequest
  ) => await API.projects.updateAssignment(resourceId, request)

  deleteProject = async (id: string, rev: string) => {
    const workspaceId = this.workspaceId
    await API.projects.delete(id, rev)
    if (this.workspaceId !== workspaceId) {
      return
    }
    this.invalidateFetch()
    this.update(state => state.filter(project => project._id !== id))
  }
}

export const projectsStore = new ProjectsStore()
