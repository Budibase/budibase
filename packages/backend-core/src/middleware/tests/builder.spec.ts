import adminOnly from "../adminOnly"
import builderOnly from "../builderOnly"
import builderOrAdmin from "../builderOrAdmin"
import { structures } from "../../../tests"
import { ContextUser, ServiceType } from "@budibase/types"
import { doInAppContext } from "../../context"
import env from "../../environment"

env._set("SERVICE_TYPE", ServiceType.APPS)

const appId = "app_aaa"
const basicUser = structures.users.user()
const adminUser = structures.users.adminUser()
const adminOnlyUser = structures.users.adminOnlyUser()
const builderUser = structures.users.builderUser()
const appBuilderUser = structures.users.appBuilderUser(appId)

function buildUserCtx(user: ContextUser) {
  return {
    internal: false,
    user,
    throw: jest.fn(),
  } as any
}

function passed(throwFn: jest.Func, nextFn: jest.Func) {
  expect(throwFn).not.toHaveBeenCalled()
  expect(nextFn).toHaveBeenCalled()
}

function threw(throwFn: jest.Func) {
  // cant check next, the throw function doesn't actually throw - so it still continues
  expect(throwFn).toHaveBeenCalled()
}

describe("adminOnly middleware", () => {
  it("should allow admin user", () => {
    const ctx = buildUserCtx(adminUser),
      next = jest.fn()
    adminOnly(ctx, next)
    passed(ctx.throw, next)
  })

  it("should not allow basic user", () => {
    const ctx = buildUserCtx(basicUser),
      next = jest.fn()
    adminOnly(ctx, next)
    threw(ctx.throw)
  })

  it("should not allow builder user", () => {
    const ctx = buildUserCtx(builderUser),
      next = jest.fn()
    adminOnly(ctx, next)
    threw(ctx.throw)
  })
})

describe("builderOnly middleware", () => {
  it("should allow builder user", () => {
    const ctx = buildUserCtx(builderUser),
      next = jest.fn()
    builderOnly(ctx, next)
    passed(ctx.throw, next)
  })

  it("should allow app builder user", () => {
    const ctx = buildUserCtx(appBuilderUser),
      next = jest.fn()
    doInAppContext(appId, () => {
      builderOnly(ctx, next)
    })
    passed(ctx.throw, next)
  })

  it("should allow admin and builder user", () => {
    const ctx = buildUserCtx(adminUser),
      next = jest.fn()
    builderOnly(ctx, next)
    passed(ctx.throw, next)
  })

  it("should not allow admin user", () => {
    const ctx = buildUserCtx(adminOnlyUser),
      next = jest.fn()
    builderOnly(ctx, next)
    threw(ctx.throw)
  })

  it("should not allow app builder user to different app", () => {
    const ctx = buildUserCtx(appBuilderUser),
      next = jest.fn()
    doInAppContext("app_bbb", () => {
      builderOnly(ctx, next)
    })
    threw(ctx.throw)
  })

  it("should not allow basic user", () => {
    const ctx = buildUserCtx(basicUser),
      next = jest.fn()
    builderOnly(ctx, next)
    threw(ctx.throw)
  })
})

describe("builderOrAdmin middleware", () => {
  it("should allow builder user", () => {
    const ctx = buildUserCtx(builderUser),
      next = jest.fn()
    builderOrAdmin(ctx, next)
    passed(ctx.throw, next)
  })

  it("should allow builder and admin user", () => {
    const ctx = buildUserCtx(adminUser),
      next = jest.fn()
    builderOrAdmin(ctx, next)
    passed(ctx.throw, next)
  })

  it("should allow admin user", () => {
    const ctx = buildUserCtx(adminOnlyUser),
      next = jest.fn()
    builderOrAdmin(ctx, next)
    passed(ctx.throw, next)
  })

  it("should allow app builder user", () => {
    const ctx = buildUserCtx(appBuilderUser),
      next = jest.fn()
    doInAppContext(appId, () => {
      builderOrAdmin(ctx, next)
    })
    passed(ctx.throw, next)
  })

  it("should not allow basic user", () => {
    const ctx = buildUserCtx(basicUser),
      next = jest.fn()
    builderOrAdmin(ctx, next)
    threw(ctx.throw)
  })
})

describe("check service difference", () => {
  it("should not allow without app ID in apps", () => {
    env._set("SERVICE_TYPE", ServiceType.APPS)
    const appId = "app_a"
    const ctx = buildUserCtx({
      ...basicUser,
      builder: {
        apps: [appId],
      },
    })
    const next = jest.fn()
    doInAppContext(appId, () => {
      builderOnly(ctx, next)
    })
    passed(ctx.throw, next)
    doInAppContext("app_b", () => {
      builderOnly(ctx, next)
    })
    threw(ctx.throw)
  })

  it("should allow without app ID in worker", () => {
    env._set("SERVICE_TYPE", ServiceType.WORKER)
    const ctx = buildUserCtx({
      ...basicUser,
      builder: {
        apps: ["app_a"],
      },
    })
    const next = jest.fn()
    doInAppContext("app_b", () => {
      builderOnly(ctx, next)
    })
    passed(ctx.throw, next)
  })
})
