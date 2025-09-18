import { API } from "@/api"
import { banner } from "@budibase/bbui"
import { get, writable } from "svelte/store"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { AdminStore } from "./admin"
import { auth } from "./auth"

vi.mock("./auth", () => {
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

vi.mock("@/api", () => {
  return {
    API: {
      getEnvironment: vi.fn(),
      getSystemStatus: vi.fn(),
      getChecklist: vi.fn(),
    },
  }
})

vi.mock("@budibase/bbui", () => {
  return {
    banner: { showStatus: vi.fn() },
    Helpers: {
      uuid: vi.fn(),
    },
  }
})

describe("admin store", () => {
  beforeEach(ctx => {
    vi.clearAllMocks()

    ctx.writableReturn = { update: vi.fn(), subscribe: vi.fn() }
    writable.mockReturnValue(ctx.writableReturn)

    ctx.returnedStore = new AdminStore()
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
        serveDevClientFromStorage: false,
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
          usingLocalComponentLibs: true,
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

    describe("usingLocalComponentLibs calculation", () => {
      it("should set usingLocalComponentLibs to true when isDev=true and serveDevClientFromStorage=false", async ctx => {
        API.getEnvironment.mockReturnValue({
          multiTenancy: false,
          cloud: false,
          disableAccountPortal: false,
          accountPortalUrl: "",
          isDev: true,
          serveDevClientFromStorage: false,
        })

        await ctx.returnedStore.init()

        expect(
          ctx.writableReturn.update.calls[1][0]({ foo: "foo" })
            .usingLocalComponentLibs
        ).toBe(true)
      })

      it("should set usingLocalComponentLibs to false when isDev=false", async ctx => {
        API.getEnvironment.mockReturnValue({
          multiTenancy: false,
          cloud: false,
          disableAccountPortal: false,
          accountPortalUrl: "",
          isDev: false,
          serveDevClientFromStorage: false,
        })

        await ctx.returnedStore.init()

        expect(
          ctx.writableReturn.update.calls[1][0]({ foo: "foo" })
            .usingLocalComponentLibs
        ).toBe(false)
      })

      it("should set usingLocalComponentLibs to false when isDev=true but serveDevClientFromStorage=true", async ctx => {
        API.getEnvironment.mockReturnValue({
          multiTenancy: false,
          cloud: false,
          disableAccountPortal: false,
          accountPortalUrl: "",
          isDev: true,
          serveDevClientFromStorage: true,
        })

        await ctx.returnedStore.init()

        expect(
          ctx.writableReturn.update.calls[1][0]({ foo: "foo" })
            .usingLocalComponentLibs
        ).toBe(false)
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
