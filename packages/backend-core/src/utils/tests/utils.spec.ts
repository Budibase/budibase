import { Ctx } from "@budibase/types"
import { structures } from "../../../tests"
import { DBTestConfiguration } from "../../../tests/extra"
import { Header } from "../../constants"
import * as db from "../../db"
import env from "../../environment"
import * as utils from "../../utils"
import { newid } from "../../utils"

describe("utils", () => {
  const config = new DBTestConfiguration()

  describe("getAppIdFromCtx", () => {
    it("gets appId from header", async () => {
      const ctx = structures.koa.newContext()
      const expected = db.generateWorkspaceID()
      ctx.request.headers = {
        [Header.APP_ID]: expected,
      }

      const actual = await utils.getAppIdFromCtx(ctx)
      expect(actual).toBe(expected)
    })

    it("gets appId from body", async () => {
      const ctx = structures.koa.newContext()
      const expected = db.generateWorkspaceID()
      ctx.request.body = {
        appId: expected,
      }

      const actual = await utils.getAppIdFromCtx(ctx)
      expect(actual).toBe(expected)
    })

    it("gets appId from path", async () => {
      const ctx = structures.koa.newContext()
      const expected = db.generateWorkspaceID()
      ctx.path = `/apps/${expected}`

      const actual = await utils.getAppIdFromCtx(ctx)
      expect(actual).toBe(expected)
    })

    it("gets appId from url", async () => {
      await config.doInTenant(async () => {
        const url = "http://example.com"
        env._set("PLATFORM_URL", url)

        const ctx = structures.koa.newContext()
        ctx.host = `${config.tenantId}.example.com`

        const expected = db.generateWorkspaceID(config.tenantId)
        const app = structures.apps.app(expected)

        // set custom url
        const appUrl = newid()
        app.url = `/${appUrl}`
        ctx.path = `/app/${appUrl}`

        // save the app
        const database = db.getDB(expected)
        await database.put(app)

        const actual = await utils.getAppIdFromCtx(ctx)
        expect(actual).toBe(expected)
      })
    })

    it("gets appId from query params", async () => {
      const ctx = structures.koa.newContext()
      const expected = db.generateWorkspaceID()
      ctx.query = { appId: expected }

      const actual = await utils.getAppIdFromCtx(ctx)
      expect(actual).toBe(expected)
    })

    it("should return proper appid if the app url is /preview", async () => {
      await config.doInTenant(async () => {
        const ctx = structures.koa.newContext()
        const appId = db.generateWorkspaceID(config.tenantId)
        const app = structures.apps.app(appId)

        // set custom url
        const appUrl = "preview"
        app.url = `/${appUrl}`
        ctx.path = `/app/${appUrl}`

        // save the app
        const database = db.getDB(appId)
        await database.put(app)

        const actual = await utils.getAppIdFromCtx(ctx)
        expect(actual).toBe(appId)
      })
    })

    it("throws 403 when header and body have different valid app IDs", async () => {
      const ctx = structures.koa.newContext()

      const appId1 = db.generateWorkspaceID()
      const appId2 = db.generateWorkspaceID()

      ctx.request.headers = {
        [Header.APP_ID]: appId1,
      }
      ctx.request.body = {
        appId: appId2,
      }

      await expect(utils.getAppIdFromCtx(ctx)).rejects.toThrow()
      expect(ctx.throw).toHaveBeenCalledTimes(1)
      expect(ctx.throw).toHaveBeenCalledWith("App id conflict", 403)
    })

    it("throws 403 when header and path have different valid app IDs", async () => {
      const ctx = structures.koa.newContext()

      const appId1 = db.generateWorkspaceID()
      const appId2 = db.generateWorkspaceID()

      ctx.request.headers = {
        [Header.APP_ID]: appId1,
      }
      ctx.path = `/apps/${appId2}`

      await expect(utils.getAppIdFromCtx(ctx)).rejects.toThrow()
      expect(ctx.throw).toHaveBeenCalledTimes(1)
      expect(ctx.throw).toHaveBeenCalledWith("App id conflict", 403)
    })

    it("returns same app ID when found across multiple sources consistently", async () => {
      const ctx = structures.koa.newContext()
      const expected = db.generateWorkspaceID()

      ctx.request.headers = {
        [Header.APP_ID]: expected,
      }
      ctx.request.body = {
        appId: expected,
      }
      ctx.query = { appId: expected }

      const actual = await utils.getAppIdFromCtx(ctx)
      expect(actual).toBe(expected)
    })

    it("ignores invalid app IDs that don't start with app prefix", async () => {
      const ctx = structures.koa.newContext()
      const validAppId = db.generateWorkspaceID()
      const invalidAppId = "invalid_app_id"

      ctx.request.headers = {
        [Header.APP_ID]: invalidAppId,
      }
      ctx.request.body = {
        appId: validAppId,
      }

      const actual = await utils.getAppIdFromCtx(ctx)
      expect(actual).toBe(validAppId)
    })

    it("returns undefined when no valid app ID is found in any source", async () => {
      const ctx = structures.koa.newContext()

      ctx.request.headers = {
        [Header.APP_ID]: "invalid_id",
      }
      ctx.request.body = {
        appId: "also_invalid",
      }
      ctx.query = { appId: "still_invalid" }

      const actual = await utils.getAppIdFromCtx(ctx)
      expect(actual).toBe(undefined)
    })
  })

  describe("isServingBuilder", () => {
    let ctx: Ctx

    const expectResult = (result: boolean) =>
      expect(utils.isServingBuilder(ctx)).toBe(result)

    beforeEach(() => {
      ctx = structures.koa.newContext()
    })

    it("returns true if current path is in builder", async () => {
      ctx.path = "/builder/workspace/app_"
      expectResult(true)
    })

    it("returns false if current path doesn't have '/' suffix", async () => {
      ctx.path = "/builder/workspace"
      expectResult(false)

      ctx.path = "/xx"
      expectResult(false)
    })
  })

  describe("isServingBuilderPreview", () => {
    let ctx: Ctx

    const expectResult = (result: boolean) =>
      expect(utils.isServingBuilderPreview(ctx)).toBe(result)

    beforeEach(() => {
      ctx = structures.koa.newContext()
    })

    it("returns true if current path is in builder preview", async () => {
      ctx.path = "/app/app_dev_123456/preview"
      expectResult(true)
    })

    it("returns false if current path is not in builder preview", async () => {
      ctx.path = "/builder"
      expectResult(false)

      ctx.path = "/xx"
      expectResult(false)
    })
  })

  describe("isPublicAPIRequest", () => {
    let ctx: Ctx

    const expectResult = (result: boolean) =>
      expect(utils.isPublicApiRequest(ctx)).toBe(result)

    beforeEach(() => {
      ctx = structures.koa.newContext()
    })

    it("returns true if current path remains to public API", async () => {
      ctx.path = "/api/public/v1/invoices"
      expectResult(true)

      ctx.path = "/api/public/v1"
      expectResult(true)

      ctx.path = "/api/public/v2"
      expectResult(true)

      ctx.path = "/api/public/v21"
      expectResult(true)
    })

    it("returns false if current path doesn't remain to public API", async () => {
      ctx.path = "/api/public"
      expectResult(false)

      ctx.path = "/xx"
      expectResult(false)
    })
  })

  describe("hasCircularStructure", () => {
    it("should detect a circular structure", () => {
      const a: any = { b: "b" }
      const b = { a }
      a.b = b
      expect(utils.hasCircularStructure(b)).toBe(true)
    })

    it("should allow none circular structures", () => {
      expect(utils.hasCircularStructure({ a: "b" })).toBe(false)
    })
  })
})
