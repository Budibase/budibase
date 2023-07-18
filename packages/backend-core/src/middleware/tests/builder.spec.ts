import adminOnly from "../adminOnly"
import builderOnly from "../builderOnly"
import builderOrAdmin from "../builderOrAdmin"
import { structures } from "../../../tests"
import { ContextUser } from "@budibase/types"
import { doInAppContext } from "../../context"

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
  expect(throwFn).not.toBeCalled()
  expect(nextFn).toBeCalled()
}

function threw(throwFn: jest.Func) {
  // cant check next, the throw function doesn't actually throw - so it still continues
  expect(throwFn).toBeCalled()
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
