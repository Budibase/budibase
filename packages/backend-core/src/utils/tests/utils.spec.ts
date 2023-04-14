import { structures } from "../../../tests"
import { DBTestConfiguration } from "../../../tests/extra"
import * as utils from "../../utils"
import * as db from "../../db"
import { Header } from "../../constants"
import { newid } from "../../utils"
import env from "../../environment"

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
})
