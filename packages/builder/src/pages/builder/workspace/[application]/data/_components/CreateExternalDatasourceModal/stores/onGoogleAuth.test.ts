import { it, expect, describe, beforeEach, vi } from "vitest"
import type { TestContext } from "vitest"
import { get } from "svelte/store"
import { createOnGoogleAuthStore } from "./onGoogleAuth"
import { IntegrationTypes } from "@/constants/backend"

type GoogleAuthTestContext = TestContext & {
  callback: ReturnType<typeof vi.fn>
}

const { paramsStore, integrationsStore } = vi.hoisted(() => {
  const createWritable = <T>(initial: T) => {
    let value = initial
    const subscribers = new Set<(next: T) => void>()
    return {
      set: (next: T) => {
        value = next
        subscribers.forEach(fn => fn(value))
      },
      update: (fn: (current: T) => T) => {
        const next = fn(value)
        value = next
        subscribers.forEach(cb => cb(value))
      },
      subscribe: (fn: (next: T) => void) => {
        fn(value)
        subscribers.add(fn)
        return () => subscribers.delete(fn)
      },
    }
  }

  return {
    paramsStore: createWritable<Record<string, string | undefined>>({}),
    integrationsStore: createWritable<Record<string, unknown>>({}),
  }
})

vi.mock("@roxi/routify", () => ({
  params: paramsStore,
}))

vi.mock("@/stores/builder", () => ({
  integrations: integrationsStore,
}))

vi.stubGlobal("history", { replaceState: vi.fn() })
vi.stubGlobal("window", { location: { pathname: "/current-path" } })

describe("google auth store", () => {
  beforeEach((ctx: GoogleAuthTestContext) => {
    vi.clearAllMocks()
    integrationsStore.set({
      [IntegrationTypes.GOOGLE_SHEETS]: { data: "integration" },
    })
    ctx.callback = vi.fn()
  })

  describe("with id present", () => {
    beforeEach((ctx: GoogleAuthTestContext) => {
      paramsStore.set({ "?continue_google_setup": "googleId" })
      get(createOnGoogleAuthStore())(ctx.callback)
    })

    it("invokes the provided callback with an integration and fields", (ctx: GoogleAuthTestContext) => {
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
      expect(history.replaceState).toHaveBeenCalledWith({}, "", `/current-path`)
    })
  })

  describe("without id present", () => {
    beforeEach((ctx: GoogleAuthTestContext) => {
      paramsStore.set({})
      get(createOnGoogleAuthStore())(ctx.callback)
    })

    it("doesn't invoke the provided callback", (ctx: GoogleAuthTestContext) => {
      expect(ctx.callback).toHaveBeenCalledTimes(0)
    })
  })
})
