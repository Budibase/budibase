import { beforeEach, describe, expect, it, vi } from "vitest"
import {
  ResourceType,
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
  const promise = new Promise<T>(res => {
    resolve = res
  })
  return { promise, resolve }
}

const project = (
  id: string,
  overrides: Partial<ProjectResponse> = {}
): ProjectResponse => ({
  _id: id,
  _rev: "1-rev",
  name: id,
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
  ...overrides,
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

    const alpha = project("project_alpha", { name: "Alpha" })
    const zulu = project("project_zulu", { name: "Zulu" })
    newer.resolve({ projects: [zulu, alpha] })
    await newerFetch

    await expect(ensuredFetch).resolves.toEqual([alpha, zulu])
    expect(getProjects(store)).toEqual([alpha, zulu])
  })

  it("does not expose projects from the previous workspace", async () => {
    const store = new ProjectsStore()
    const firstWorkspace = defer<FetchProjectsResponse>()
    const secondWorkspace = defer<FetchProjectsResponse>()

    fetchProjects
      .mockReturnValueOnce(firstWorkspace.promise)
      .mockReturnValueOnce(secondWorkspace.promise)

    const firstFetch = store.fetch("app_workspace_1")
    const secondFetch = store.ensureFetched("app_workspace_2")

    firstWorkspace.resolve({ projects: [project("first_project")] })
    await firstFetch
    expect(getProjects(store)).toEqual([])

    secondWorkspace.resolve({ projects: [project("second_project")] })
    await secondFetch
    expect(getProjects(store)).toEqual([project("second_project")])
  })

  it("returns import setup details and adds the project to the current workspace", async () => {
    const store = new ProjectsStore()
    const existing = project("project_2")
    fetchProjects.mockResolvedValueOnce({ projects: [existing] })
    await store.fetch()
    const response: ImportProjectResponse = {
      project: project("project_1"),
      resources: {
        [ResourceType.PROJECT]: ["project_1"],
        [ResourceType.DATASOURCE]: ["datasource_1"],
      },
      unsupportedContent: [],
      requirements: [
        {
          type: "datasource_secrets",
          resourceId: "datasource_1",
          name: "Customer database",
          reason: "Reconnect the database.",
        },
      ],
    }
    const file = new File(["project"], "project.tar.gz")
    importBundle.mockResolvedValue(response)

    await expect(store.importProject(file)).resolves.toEqual(response)
    expect(getProjects(store)).toEqual([response.project, existing])
  })

  it("does not let an in-flight fetch overwrite a created project", async () => {
    const store = new ProjectsStore()
    const fetch = defer<FetchProjectsResponse>()
    const alpha = project("project_alpha", { name: "Alpha" })
    const zulu = project("project_zulu", { name: "Zulu" })
    const created = project("project_bravo", { name: "Bravo" })
    fetchProjects.mockResolvedValueOnce({ projects: [alpha, zulu] })
    await store.fetch()
    fetchProjects.mockReturnValue(fetch.promise)
    createProject.mockResolvedValue({ project: created })

    const fetchPromise = store.fetch()
    await store.create({ name: created.name })
    fetch.resolve({ projects: [alpha, zulu] })
    await fetchPromise

    expect(getProjects(store)).toEqual([alpha, created, zulu])
  })

  it("does not let an in-flight fetch overwrite an updated project", async () => {
    const store = new ProjectsStore()
    const fetch = defer<FetchProjectsResponse>()
    const alpha = project("project_alpha", { name: "Alpha" })
    const original = project("project_charlie", { name: "Charlie" })
    const updated: ProjectResponse = {
      ...original,
      _rev: "2-rev",
      name: "Aardvark",
    }
    const response: UpdateProjectResponse = { project: updated }

    fetchProjects.mockResolvedValueOnce({ projects: [alpha, original] })
    await store.fetch()
    fetchProjects.mockReturnValue(fetch.promise)
    updateProject.mockResolvedValue(response)

    const fetchPromise = store.fetch()
    await store.updateProject({
      _id: original._id,
      _rev: original._rev,
      name: updated.name,
    })
    fetch.resolve({ projects: [alpha, original] })

    await fetchPromise
    expect(getProjects(store)).toEqual([updated, alpha])
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

    await fetchPromise
    expect(getProjects(store)).toEqual([retained])
  })

  it.each(["update", "delete"])(
    "does not let a late %s discard the next workspace's fetch",
    async operation => {
      const store = new ProjectsStore()
      const pendingMutation = defer<void>()
      const secondFetch = defer<FetchProjectsResponse>()
      const original = project("project_1")
      const secondWorkspaceProject = project("workspace_2_project")

      fetchProjects
        .mockResolvedValueOnce({ projects: [original] })
        .mockReturnValueOnce(secondFetch.promise)
      updateProject.mockImplementation(async () => {
        await pendingMutation.promise
        return { project: original }
      })
      deleteProject.mockReturnValue(pendingMutation.promise)

      await store.fetch("app_workspace_1")
      const mutation =
        operation === "update"
          ? store.updateProject(original)
          : store.deleteProject(original._id, original._rev)
      const workspaceFetch = store.fetch("app_workspace_2")

      pendingMutation.resolve()
      await mutation
      secondFetch.resolve({ projects: [secondWorkspaceProject] })
      await workspaceFetch

      expect(getProjects(store)).toEqual([secondWorkspaceProject])
    }
  )
})
