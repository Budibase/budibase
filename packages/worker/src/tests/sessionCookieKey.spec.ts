import { createSecretKey } from "crypto"
import Keygrip from "keygrip"
import Application from "koa"
import supertest from "supertest"
import { getSessionCookieKey } from "../sessionCookieKey"

const koaSession = require("koa-session")

const sessionId = "existing-session"

const createSessionApp = (secret: string) => {
  const app = new Application()
  app.keys = [getSessionCookieKey(createSecretKey(secret, "utf8"))]

  const store = {
    get: jest.fn(async () => ({
      marker: "stored-state",
      _expire: Date.now() + 60000,
    })),
    set: jest.fn(async () => {}),
    destroy: jest.fn(async () => {}),
  }

  app.use(koaSession({ store, key: "koa:sess" }, app))
  app.use(ctx => {
    ctx.body = "ok"
  })

  return { app, store }
}

const cookieHeader = (key: string) => {
  const signature = new Keygrip([key]).sign(`koa:sess=${sessionId}`)
  return `koa:sess=${sessionId}; koa:sess.sig=${signature}`
}

describe("worker session cookie signing", () => {
  it.each(["secret", "key"])(
    "rejects a cookie signed with the former public key %s",
    async key => {
      const { app, store } = createSessionApp("deployment-secret")

      await supertest(app.callback())
        .get("/")
        .set("Cookie", cookieHeader(key))
        .expect(200)

      expect(store.get).not.toHaveBeenCalled()
    }
  )

  it("loads a stored session signed with this deployment's key", async () => {
    const { app, store } = createSessionApp("deployment-secret")
    const key = getSessionCookieKey(
      createSecretKey("deployment-secret", "utf8")
    )

    await supertest(app.callback())
      .get("/")
      .set("Cookie", cookieHeader(key))
      .expect(200)

    expect(store.get).toHaveBeenCalledWith(sessionId, undefined, {
      rolling: undefined,
    })
  })

  it("rejects a cookie signed by a different deployment", async () => {
    const { app, store } = createSessionApp("deployment-secret")
    const otherKey = getSessionCookieKey(
      createSecretKey("other-deployment-secret", "utf8")
    )

    await supertest(app.callback())
      .get("/")
      .set("Cookie", cookieHeader(otherKey))
      .expect(200)

    expect(store.get).not.toHaveBeenCalled()
  })

  it("requires the deployment secret", () => {
    expect(() => getSessionCookieKey()).toThrow(
      "JWT_SECRET is required for worker session cookies"
    )
  })
})
