import { afterEach, describe, expect, it, vi } from "vitest"
import { Header } from "@budibase/shared-core"
import { APIWarningCode } from "@budibase/types"

vi.mock("@budibase/bbui", () => ({
  Helpers: {
    uuid: () => "session-id",
  },
}))

import { createAPIClient } from "./index"

describe("API response warnings", () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it("reports recognised warning headers on successful responses", async () => {
    const onWarning = vi.fn()
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ saved: true }), {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            [Header.API_WARNING]:
              APIWarningCode.PROJECT_DEPENDENCY_ASSIGNMENT_INCOMPLETE,
          },
        })
      )
    )
    const api = createAPIClient({ onWarning })

    await expect(api.get({ url: "api/test" })).resolves.toEqual({
      saved: true,
    })
    expect(onWarning).toHaveBeenCalledWith(
      APIWarningCode.PROJECT_DEPENDENCY_ASSIGNMENT_INCOMPLETE
    )
  })

  it("ignores unknown warning headers", async () => {
    const onWarning = vi.fn()
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ saved: true }), {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            [Header.API_WARNING]: "unknown_warning",
          },
        })
      )
    )
    const api = createAPIClient({ onWarning })

    await api.get({ url: "api/test" })

    expect(onWarning).not.toHaveBeenCalled()
  })

  it("imports the template key into the selected destination workspace", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ saved: true }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      })
    )
    vi.stubGlobal("fetch", fetchMock)
    const api = createAPIClient({
      attachHeaders: headers => {
        headers[Header.WORKSPACE_ID] = "app_dev_current"
      },
    })

    await api.projects.importTemplate({
      templateKey: "project/support",
      workspaceId: "app_dev_destination",
    })

    expect(fetchMock).toHaveBeenCalledWith(
      "/api/projects/templates/import",
      expect.objectContaining({
        body: JSON.stringify({ templateKey: "project/support" }),
        headers: expect.objectContaining({
          [Header.WORKSPACE_ID]: "app_dev_destination",
        }),
      })
    )
  })
})
