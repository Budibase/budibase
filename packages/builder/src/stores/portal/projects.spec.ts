import { beforeEach, describe, expect, it, vi } from "vitest"
import {
  ResourceType,
  type CreateProjectResponse,
  type FetchProjectsResponse,
  type ImportProjectResponse,
  type ProjectResponse,
  type UpdateProjectResponse,
} from "@budibase/types"
import { API } from "@/api"
import { ProjectsStore } from "./projects"
import { get } from "svelte/store"

vi.mock("@/api", () => {
  return {
    API: {
      projects: {
        fetch: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
        exportBundle: vi.fn(),
        importBundle: vi.fn(),
      },
    },
  }
})

vi.mock("@budibase/frontend-core", () => {
  return {
    downloadStream: vi.fn(),
  }
})

const fetchProjects = vi.mocked(API.projects.fetch)
const createProject = vi.mocked(API.projects.create)
const updateProject = vi.mocked(API.projects.update)
const deleteProject = vi.mocked(API.projects.delete)
const importBundle = vi.mocked(API.projects.importBundle)

const defer = <T>() => {
  let resolve!: (value: T) => void
  let reject!: (reason?: unknown) => void
  const promise = new Promise<T>((res, rej) => {
    resolve = res
    reject = rej
  })
  return { promise, resolve, reject }
}

const project = (id: string): ProjectResponse => ({
  _id: id,
  _rev: "1-rev",
  name: id,
  createdAt: "2026-01-01T00:00:00.000Z",
})

const getProjects = (store: ProjectsStore) => get(store.store)

describe("ProjectsStore", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("does not let an older fetch complete over a newer in-flight fetch", async () => {
    const store = new ProjectsStore()
    const older = defer<FetchProjectsResponse>()
    const newer = defer<FetchProjectsResponse>()

    fetchProjects
      .mockReturnValueOnce(older.promise)
      .mockReturnValueOnce(newer.promise)

    const olderFetch = store.fetch()
    const newerFetch = store.fetch()

    older.resolve({ projects: [project("stale_project")] })
    await olderFetch

    const ensuredFetch = store.ensureFetched()

    expect(fetchProjects).toHaveBeenCalledTimes(2)

    newer.resolve({ projects: [project("project_1")] })

    await expect(newerFetch).resolves.toEqual([project("project_1")])
    await expect(ensuredFetch).resolves.toEqual([project("project_1")])
  })

  it("returns the import response when the post-import refresh fails", async () => {
    const store = new ProjectsStore()
    const response: ImportProjectResponse = {
      project: project("project_1"),
      resources: {
        [ResourceType.PROJECT]: ["project_1"],
      },
      unsupportedContent: [],
      requirements: [],
    }
    const file = new File(["project"], "project.tar.gz")
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {})

    importBundle.mockResolvedValue(response)
    fetchProjects.mockRejectedValue(new Error("refresh failed"))

    await expect(store.importProject(file)).resolves.toEqual(response)
    expect(fetchProjects).toHaveBeenCalledTimes(1)

    warn.mockRestore()
  })

  it("does not let an in-flight fetch overwrite a created project", async () => {
    const store = new ProjectsStore()
    const fetch = defer<FetchProjectsResponse>()
    const created = project("created_project")
    const response: CreateProjectResponse = { project: created }

    fetchProjects.mockReturnValue(fetch.promise)
    createProject.mockResolvedValue(response)

    const fetchPromise = store.fetch()
    await store.create({ name: "Created project" })
    fetch.resolve({ projects: [project("stale_project")] })

    await expect(fetchPromise).resolves.toEqual([project("stale_project")])
    expect(getProjects(store)).toEqual([created])
  })

  it("does not let an in-flight fetch overwrite an updated project", async () => {
    const store = new ProjectsStore()
    const fetch = defer<FetchProjectsResponse>()
    const original = project("project_1")
    const updated: ProjectResponse = {
      ...original,
      _rev: "2-rev",
      name: "Updated project",
    }
    const response: UpdateProjectResponse = { project: updated }

    fetchProjects.mockResolvedValueOnce({ projects: [original] })
    await store.fetch()
    fetchProjects.mockReturnValue(fetch.promise)
    updateProject.mockResolvedValue(response)

    const fetchPromise = store.fetch()
    await store.updateProject({
      _id: original._id,
      _rev: original._rev,
      name: updated.name,
    })
    fetch.resolve({ projects: [original] })

    await expect(fetchPromise).resolves.toEqual([original])
    expect(getProjects(store)).toEqual([updated])
  })

  it("does not let an in-flight fetch re-add a deleted project", async () => {
    const store = new ProjectsStore()
    const fetch = defer<FetchProjectsResponse>()
    const deleted = project("project_1")
    const retained = project("project_2")

    fetchProjects.mockResolvedValueOnce({ projects: [deleted, retained] })
    await store.fetch()
    fetchProjects.mockReturnValue(fetch.promise)
    deleteProject.mockResolvedValue(undefined)

    const fetchPromise = store.fetch()
    await store.deleteProject(deleted._id, deleted._rev)
    fetch.resolve({ projects: [deleted, retained] })

    await expect(fetchPromise).resolves.toEqual([deleted, retained])
    expect(getProjects(store)).toEqual([retained])
  })
})
