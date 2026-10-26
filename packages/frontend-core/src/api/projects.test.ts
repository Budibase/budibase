import { describe, expect, it, vi } from "vitest"
import { buildProjectEndpoints } from "./projects"
import type { BaseAPIClient } from "./types"

const createClient = () => {
  const put = vi.fn()
  const API: BaseAPIClient = {
    get: vi.fn(),
    post: vi.fn(),
    put,
    patch: vi.fn(),
    delete: vi.fn(),
    invalidateCache: vi.fn(),
    getAppID: () => "app_dev_test",
  }
  return { projects: buildProjectEndpoints(API), put }
}

describe("project API", () => {
  it.each(["# Shared notes\n\nStart here.", ""])(
    "sends the README unchanged when updating a project",
    async readme => {
      const { projects, put } = createClient()

      await projects.update({
        _id: "project_test",
        _rev: "1-test",
        name: "Operations",
        readme,
      })

      const [{ url, body }] = put.mock.calls[0]
      expect(url).toBe("/api/projects/project_test")
      expect(JSON.parse(JSON.stringify(body))).toEqual({
        _id: "project_test",
        _rev: "1-test",
        name: "Operations",
        readme,
      })
    }
  )

  it("omits the README from serialized metadata-only updates", async () => {
    const { projects, put } = createClient()

    await projects.update({
      _id: "project_test",
      _rev: "1-test",
      name: "Renamed operations",
    })

    const [{ body }] = put.mock.calls[0]
    expect(JSON.parse(JSON.stringify(body))).toEqual({
      _id: "project_test",
      _rev: "1-test",
      name: "Renamed operations",
    })
  })
})
