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
})
