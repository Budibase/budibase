import { afterEach, describe, expect, it, vi } from "vitest"
import { Header } from "@budibase/shared-core"

vi.mock("@budibase/bbui", () => ({
  Helpers: {
    uuid: () => "session-id",
  },
}))

import { createAPIClient } from "../../../frontend-core/src/api"

describe("project template API", () => {
  afterEach(() => {
    vi.unstubAllGlobals()
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
