import { structures } from "../../../tests"
import { DBTestConfiguration } from "../../../tests/extra"
import * as utils from "../../utils"
import * as db from "../../db"
import { Header } from "../../constants"
import { newid } from "../../utils"
import env from "../../environment"
import { BBContext } from "@budibase/types"

describe("utils", () => {
  const config = new DBTestConfiguration()

  describe("getAppIdFromCtx", () => {
    it("gets appId from header", async () => {
      const ctx = structures.koa.newContext()
      const expected = db.generateAppID()
      ctx.request.headers = {
        [Header.APP_ID]: expected,
      }

      const actual = await utils.getAppIdFromCtx(ctx)
      expect(actual).toBe(expected)
    })

    it("gets appId from body", async () => {
      const ctx = structures.koa.newContext()
      const expected = db.generateAppID()
      ctx.request.body = {
        appId: expected,
      }

      const actual = await utils.getAppIdFromCtx(ctx)
      expect(actual).toBe(expected)
    })

    it("gets appId from path", async () => {
      const ctx = structures.koa.newContext()
      const expected = db.generateAppID()
      ctx.path = `/apps/${expected}`

      const actual = await utils.getAppIdFromCtx(ctx)
      expect(actual).toBe(expected)
    })

    it("gets appId from url", async () => {
      await config.doInTenant(async () => {
        const url = "http://test.com"
        env._set("PLATFORM_URL", url)

        const ctx = structures.koa.newContext()
        ctx.host = `${config.tenantId}.test.com`

        const expected = db.generateAppID(config.tenantId)
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

    it("doesn't get appId from url when previewing", async () => {
      const ctx = structures.koa.newContext()
      const appId = db.generateAppID()
      const app = structures.apps.app(appId)

      // set custom url
      const appUrl = "preview"
      app.url = `/${appUrl}`
      ctx.path = `/app/${appUrl}`

      // save the app
      const database = db.getDB(appId)
      await database.put(app)

      const actual = await utils.getAppIdFromCtx(ctx)
      expect(actual).toBe(undefined)
    })

    it("gets appId from referer", async () => {
      const ctx = structures.koa.newContext()
      const expected = db.generateAppID()
      ctx.request.headers = {
        referer: `http://test.com/builder/app/${expected}/design/screen_123/screens`,
      }

      const actual = await utils.getAppIdFromCtx(ctx)
      expect(actual).toBe(expected)
    })

    it("doesn't get appId from referer when not builder", async () => {
      const ctx = structures.koa.newContext()
      const appId = db.generateAppID()
      ctx.request.headers = {
        referer: `http://test.com/foo/app/${appId}/bar`,
      }

      const actual = await utils.getAppIdFromCtx(ctx)
      expect(actual).toBe(undefined)
    })
  })

  describe("isServingBuilder", () => {
    let ctx: BBContext

    const expectResult = (result: boolean) =>
      expect(utils.isServingBuilder(ctx)).toBe(result)

    beforeEach(() => {
      ctx = structures.koa.newContext()
    })

    it("returns true if current path is in builder", async () => {
      ctx.path = "/builder/app/app_"
      expectResult(true)
    })

    it("returns false if current path doesn't have '/' suffix", async () => {
      ctx.path = "/builder/app"
      expectResult(false)

      ctx.path = "/xx"
      expectResult(false)
    })
  })

  describe("isServingBuilderPreview", () => {
    let ctx: BBContext

    const expectResult = (result: boolean) =>
      expect(utils.isServingBuilderPreview(ctx)).toBe(result)

    beforeEach(() => {
      ctx = structures.koa.newContext()
    })

    it("returns true if current path is in builder preview", async () => {
      ctx.path = "/app/preview/xx"
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
    let ctx: BBContext

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
})
