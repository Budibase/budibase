import { beforeEach, describe, expect, it, vi } from "vitest"
import type { FetchProjectsResponse, ProjectResponse } from "@budibase/types"
import { API } from "@/api"
import { ProjectsStore } from "./projects"

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
})
