import { it, expect, describe, beforeEach, vi } from "vitest"
import { DEFAULT_CONFIG, createAdminStore } from "./admin"

import { writable, get } from "svelte/store"
import { API } from "api"
import { auth } from "stores/portal"
import { banner } from "@budibase/bbui"

vi.mock("stores/portal", () => {
  return { auth: vi.fn() }
})

// explict mock that is overwritten later so that the singleton admin store doesn't throw an error when partially mocked
vi.mock("svelte/store", () => {
  return {
    writable: vi.fn(() => ({
      subscribe: vi.fn(),
      update: vi.fn(),
    })),
    get: vi.fn(),
  }
})

vi.mock("api", () => {
  return {
    API: {
      getEnvironment: vi.fn(),
      getSystemStatus: vi.fn(),
      getChecklist: vi.fn(),
    },
  }
})

vi.mock("@budibase/bbui", () => {
  return { banner: { showStatus: vi.fn() } }
})

describe("admin store", () => {
  beforeEach(ctx => {
    vi.clearAllMocks()

    ctx.writableReturn = { update: vi.fn(), subscribe: vi.fn() }
    writable.mockReturnValue(ctx.writableReturn)

    ctx.returnedStore = createAdminStore()
  })

  it("inits the writable store with the default config", () => {
    expect(writable).toHaveBeenCalledTimes(1)
    expect(writable).toHaveBeenCalledWith(DEFAULT_CONFIG)
  })

  it("returns the created store", ctx => {
    expect(ctx.returnedStore).toEqual({
      subscribe: expect.toBe(ctx.writableReturn.subscribe),
      init: expect.toBeFunc(),
      unload: expect.toBeFunc(),
      getChecklist: expect.toBeFunc(),
    })
  })

  describe("init method", () => {
    beforeEach(async ctx => {
      let getMockIndex = 0

      ctx.getMockValues = [
        { tenantId: "tenantId" },
        { cloud: true },
        { status: { health: { passing: false } } },
      ]

      get.mockImplementation(() => {
        const value = ctx.getMockValues[getMockIndex]
        getMockIndex++

        return value
      })

      API.getChecklist.mockReturnValue("checklist")

      API.getEnvironment.mockReturnValue({
        multiTenancy: true,
        cloud: true,
        disableAccountPortal: true,
        accountPortalUrl: "url",
        isDev: true,
      })

      API.getSystemStatus.mockReturnValue("status")
    })

    describe("getCheckList", () => {
      beforeEach(async ctx => {
        await ctx.returnedStore.init()
      })

      it("adds the checklist to the store", ctx => {
        expect(get).toHaveBeenNthCalledWith(1, auth)
        expect(API.getChecklist).toHaveBeenCalledTimes(1)
        expect(API.getChecklist).toHaveBeenCalledWith("tenantId")
        expect(ctx.writableReturn.update.calls[0][0]({ foo: "foo" })).toEqual({
          foo: "foo",
          checklist: "checklist",
        })
      })
    })

    describe("getEnvironment", () => {
      beforeEach(async ctx => {
        await ctx.returnedStore.init()
      })

      it("adds the environment to the store", ctx => {
        expect(API.getEnvironment).toHaveBeenCalledTimes(1)
        expect(API.getEnvironment).toHaveBeenCalledWith()
        expect(ctx.writableReturn.update.calls[1][0]({ foo: "foo" })).toEqual({
          foo: "foo",
          multiTenancy: true,
          cloud: true,
          disableAccountPortal: true,
          accountPortalUrl: "url",
          isDev: true,
        })
      })
    })

    describe("system status", () => {
      describe("non cloud", () => {
        beforeEach(async ctx => {
          ctx.getMockValues[1].cloud = false
          await ctx.returnedStore.init()
        })

        it("getSystemStatus", () => {
          expect(API.getSystemStatus).toHaveBeenCalledTimes(0)
        })

        it("checkStatus", () => {
          expect(get).toHaveBeenCalledTimes(2)
          expect(banner.showStatus).toHaveBeenCalledTimes(0)
        })
      })

      describe("cloud with healthy admin status", () => {
        beforeEach(async ctx => {
          ctx.getMockValues[1].cloud = true
          ctx.getMockValues[2].status.health.passing = true
          await ctx.returnedStore.init()
        })

        it("getSystemStatus", ctx => {
          expect(get).toHaveBeenNthCalledWith(2, ctx.writableReturn)
          expect(API.getSystemStatus).toHaveBeenCalledTimes(1)
          expect(API.getEnvironment).toHaveBeenCalledWith()
          expect(ctx.writableReturn.update.calls[2][0]({ foo: "foo" })).toEqual(
            { foo: "foo", status: "status" }
          )
        })

        it("checkStatus", ctx => {
          expect(get).toHaveBeenCalledTimes(3)
          expect(get).toHaveBeenNthCalledWith(3, ctx.writableReturn)
          expect(banner.showStatus).toHaveBeenCalledTimes(0)
        })
      })

      describe("cloud with unhealthy admin status", () => {
        beforeEach(async ctx => {
          ctx.getMockValues[1].cloud = true
          ctx.getMockValues[2].status.health.passing = false
          await ctx.returnedStore.init()
        })

        it("getSystemStatus", ctx => {
          expect(get).toHaveBeenNthCalledWith(2, ctx.writableReturn)
          expect(API.getSystemStatus).toHaveBeenCalledTimes(1)
          expect(API.getEnvironment).toHaveBeenCalledWith()
          expect(ctx.writableReturn.update.calls[2][0]({ foo: "foo" })).toEqual(
            { foo: "foo", status: "status" }
          )
        })

        it("checkStatus", ctx => {
          expect(get).toHaveBeenCalledTimes(3)
          expect(get).toHaveBeenNthCalledWith(3, ctx.writableReturn)
          expect(banner.showStatus).toHaveBeenCalledTimes(1)
          expect(banner.showStatus).toHaveBeenCalledWith()
        })
      })
    })

    describe("getEnvironment", () => {
      beforeEach(async ctx => {
        await ctx.returnedStore.init()
      })

      it("marks the store as loaded", ctx => {
        expect(ctx.writableReturn.update.calls[3][0]({ foo: "foo" })).toEqual({
          foo: "foo",
          loaded: true,
        })
      })
    })
  })

  describe("unload", () => {
    beforeEach(ctx => {
      ctx.returnedStore.unload()
    })

    it("sets the store's loaded parameter to false", ctx => {
      expect(ctx.writableReturn.update.calls[0][0]({ loaded: true })).toEqual({
        loaded: false,
      })
    })
  })

  describe("getChecklist", () => {
    beforeEach(async ctx => {
      get.mockReturnValue({ tenantId: "tenantId" })
      API.getChecklist.mockReturnValue("checklist")
      await ctx.returnedStore.getChecklist()
    })

    it("updates the store with the new checklist", ctx => {
      expect(get).toHaveBeenNthCalledWith(1, auth)
      expect(API.getChecklist).toHaveBeenCalledTimes(1)
      expect(API.getChecklist).toHaveBeenCalledWith("tenantId")
      expect(ctx.writableReturn.update.calls[0][0]({ foo: "foo" })).toEqual({
        foo: "foo",
        checklist: "checklist",
      })
    })
  })
})
