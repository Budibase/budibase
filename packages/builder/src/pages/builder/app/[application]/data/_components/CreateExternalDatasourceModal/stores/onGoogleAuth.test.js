import { params } from "@roxi/routify"
import { IntegrationTypes } from "constants/backend"
import { integrations } from "stores/builder"
import { get, writable } from "svelte/store"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { createOnGoogleAuthStore } from "./onGoogleAuth"

vi.mock("@roxi/routify", () => ({
  params: vi.fn(),
}))

vi.mock("stores/builder", () => ({
  integrations: vi.fn(),
}))

vi.stubGlobal("history", { replaceState: vi.fn() })
vi.stubGlobal("window", { location: { pathname: "/current-path" } })

describe("google auth store", () => {
  beforeEach(ctx => {
    vi.clearAllMocks()
    // biome-ignore lint: no-import-assign
    integrations = writable({
      [IntegrationTypes.GOOGLE_SHEETS]: { data: "integration" },
    })
    ctx.callback = vi.fn()
  })

  describe("with id present", () => {
    beforeEach(ctx => {
      // biome-ignore lint: no-import-assign
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
      // biome-ignore lint: no-import-assign
      params = writable({})
      get(createOnGoogleAuthStore())(ctx.callback)
    })

    it("doesn't invoke the provided callback", ctx => {
      expect(ctx.callback).toHaveBeenCalledTimes(0)
    })
  })
})
