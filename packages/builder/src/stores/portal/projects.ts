import { API } from "@/api"
import { downloadStream } from "@budibase/frontend-core"
import type {
  CreateProjectRequest,
  ImportProjectRequest,
  ImportProjectResponse,
  ProjectResponse,
  UpdateProjectRequest,
} from "@budibase/types"
import { BudiStore } from "../BudiStore"
import { get } from "svelte/store"

export class ProjectsStore extends BudiStore<ProjectResponse[]> {
  private loaded = false
  private fetchPromise: Promise<ProjectResponse[]> | undefined

  constructor() {
    super([])
  }

  fetch = async () => {
    const promise = API.projects
      .fetch()
      .then(({ projects }) => {
        if (this.fetchPromise === promise) {
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

  ensureFetched = async () => {
    if (this.fetchPromise) {
      return await this.fetchPromise
    }
    if (this.loaded) {
      return get(this.store)
    }
    return await this.fetch()
  }

  hasFetched = () => this.loaded

  create = async (project: CreateProjectRequest) => {
    const response = await API.projects.create(project)
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
      await this.fetch()
    } catch (err) {
      console.warn("Failed to refresh projects after import", err)
    }
    return response
  }

  updateProject = async (project: UpdateProjectRequest) => {
    const response = await API.projects.update(project)
    this.update(state =>
      state.map(existing =>
        existing._id === response.project._id ? response.project : existing
      )
    )
    return response.project
  }

  deleteProject = async (id: string, rev: string) => {
    await API.projects.delete(id, rev)
    this.update(state => state.filter(project => project._id !== id))
  }
}

export const projectsStore = new ProjectsStore()
