import { structures } from "../../../tests"
import * as utils from "../../utils"
import * as events from "../../events"
import * as db from "../../db"
import { DEFAULT_TENANT_ID, Header } from "../../constants"
import { doInTenant } from "../../context"

describe("utils", () => {
  describe("platformLogout", () => {
    it("should call platform logout", async () => {
      await doInTenant(DEFAULT_TENANT_ID, async () => {
        const ctx = structures.koa.newContext()
        await utils.platformLogout({ ctx, userId: "test" })
        expect(events.auth.logout).toBeCalledTimes(1)
      })
    })
  })

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
      const ctx = structures.koa.newContext()
      const expected = db.generateAppID()
      const app = structures.apps.app(expected)

      // set custom url
      const appUrl = "custom-url"
      app.url = `/${appUrl}`
      ctx.path = `/app/${appUrl}`

      // save the app
      const database = db.getDB(expected)
      await database.put(app)

      const actual = await utils.getAppIdFromCtx(ctx)
      expect(actual).toBe(expected)
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
