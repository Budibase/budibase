import { it, expect, describe, beforeEach, vi } from "vitest"
import { createOnGoogleAuthStore } from "./onGoogleAuth"
import { writable, get } from "svelte/store"
// eslint-disable-next-line
import { params } from "@roxi/routify"
// eslint-disable-next-line
import { integrations } from "@/stores/builder"
import { IntegrationTypes } from "@/constants/backend"

vi.mock("@roxi/routify", () => ({
  params: vi.fn(),
}))

vi.mock("@/stores/builder", () => ({
  integrations: vi.fn(),
}))

vi.stubGlobal("history", { replaceState: vi.fn() })
vi.stubGlobal("window", { location: { pathname: "/current-path" } })

describe("google auth store", () => {
  beforeEach(ctx => {
    vi.clearAllMocks()
    // eslint-disable-next-line no-import-assign
    integrations = writable({
      [IntegrationTypes.GOOGLE_SHEETS]: { data: "integration" },
    })
    ctx.callback = vi.fn()
  })

  describe("with id present", () => {
    beforeEach(ctx => {
      // eslint-disable-next-line no-import-assign
      params = writable({ "?continue_google_setup": "googleId" })
      get(createOnGoogleAuthStore())(ctx.callback)
    })

    it("invokes the provided callback with an integration and fields", ctx => {
      expect(ctx.callback).toHaveBeenCalledTimes(1)
      expect(ctx.callback).toHaveBeenCalledWith(
        {
          name: IntegrationTypes.GOOGLE_SHEETS,
          data: "integration",
        },
        { continueSetupId: "googleId", sheetId: "" }
      )
    })

    it("clears the query param", () => {
      expect(history.replaceState).toHaveBeenCalledTimes(1)
      expect(history.replaceState).toHaveBeenCalledWith(
        {},
        null,
        `/current-path`
      )
    })
  })

  describe("without id present", () => {
    beforeEach(ctx => {
      // eslint-disable-next-line no-import-assign
      params = writable({})
      get(createOnGoogleAuthStore())(ctx.callback)
    })

    it("doesn't invoke the provided callback", ctx => {
      expect(ctx.callback).toHaveBeenCalledTimes(0)
    })
  })
})
