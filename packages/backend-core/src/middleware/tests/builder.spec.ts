import { ServiceType, User } from "@budibase/types"
import { structures } from "../../../tests"
import { Header } from "../../constants"
import env from "../../environment"
import { adminOnly } from "../adminOnly"
import { builderOnly } from "../builderOnly"
import { builderOrAdmin } from "../builderOrAdmin"

const appId = "app_aaa"
const basicUser = structures.users.user()
const adminUser = structures.users.adminUser()
const adminOnlyUser = structures.users.adminOnlyUser()
const builderUser = structures.users.builderUser()
const appBuilderUser = structures.users.appBuilderUser(appId)

function buildUserCtx(user: User) {
  const ctx = {
    internal: false,
    user,
    throw: jest.fn(),
    request: {
      headers: {},
      body: {},
    },
    query: {},
    path: "",
  } as any

  return ctx
}

async function doInWorkspaceContext(
  ctx: any,
  workspaceId: string,
  fnc: () => Promise<void>
) {
  ctx.request.headers[Header.APP_ID] = workspaceId
  try {
    await fnc()
  } finally {
    delete ctx.request.headers[Header.APP_ID]
  }
}

function passed(throwFn: jest.Func, nextFn: jest.Func) {
  expect(throwFn).not.toHaveBeenCalled()
  expect(nextFn).toHaveBeenCalled()
}

function threw(throwFn: jest.Func, httpCode: number, errorMessage: string) {
  // cant check next, the throw function doesn't actually throw - so it still continues
  expect(throwFn).toHaveBeenCalled()
  expect(throwFn).toHaveBeenCalledWith(httpCode, errorMessage)
}

describe("security middlewares", () => {
  beforeEach(() => {
    env._set("SERVICE_TYPE", ServiceType.APPS)
  })

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
      threw(ctx.throw, 403, "Admin user only endpoint.")
    })

    it("should not allow builder user", () => {
      const ctx = buildUserCtx(builderUser),
        next = jest.fn()
      adminOnly(ctx, next)
      threw(ctx.throw, 403, "Admin user only endpoint.")
    })
  })

  describe("builderOnly middleware", () => {
    it("should require workspace ID in apps service", async () => {
      env._set("SERVICE_TYPE", ServiceType.APPS)
      const ctx = buildUserCtx(builderUser),
        next = jest.fn()
      await builderOnly(ctx, next)
      threw(ctx.throw, 403, "This request required a workspace id.")
    })

    it("should allow app builder user in correct workspace", async () => {
      const ctx = buildUserCtx(appBuilderUser),
        next = jest.fn()

      await doInWorkspaceContext(ctx, appId, () => builderOnly(ctx, next))
      passed(ctx.throw, next)
    })

    it("should allow admin with builder permissions", async () => {
      const ctx = buildUserCtx(adminUser),
        next = jest.fn()
      await doInWorkspaceContext(ctx, appId, () => builderOnly(ctx, next))
      passed(ctx.throw, next)
    })

    it("should not allow admin-only user without workspace", async () => {
      const ctx = buildUserCtx(adminOnlyUser),
        next = jest.fn()
      await builderOnly(ctx, next)
      threw(ctx.throw, 403, "This request required a workspace id.")
    })

    it("should not allow app builder user to different app", async () => {
      const ctx = buildUserCtx(appBuilderUser),
        next = jest.fn()
      await doInWorkspaceContext(ctx, "app_b", () => builderOnly(ctx, next))
      threw(ctx.throw, 403, "Workspace builder user only endpoint.")
    })

    it("should not allow basic user without workspace", async () => {
      const ctx = buildUserCtx(basicUser),
        next = jest.fn()
      await builderOnly(ctx, next)
      threw(ctx.throw, 403, "This request required a workspace id.")
    })

    it("should allow internal requests to bypass all security", async () => {
      const ctx = buildUserCtx(basicUser)
      ctx.internal = true
      const next = jest.fn()

      await doInWorkspaceContext(ctx, "app_b", () => builderOnly(ctx, next))
      passed(ctx.throw, next)
    })

    it("should allow global builder access to any app", async () => {
      const ctx = buildUserCtx(builderUser)
      const next = jest.fn()

      await doInWorkspaceContext(ctx, "app_b", () => builderOnly(ctx, next))
      passed(ctx.throw, next)
    })

    it("should deny access when no app context and user is not global builder", async () => {
      const ctx = buildUserCtx(appBuilderUser) // no app ID in context
      const next = jest.fn()

      await builderOnly(ctx, next)
      threw(ctx.throw, 403, "This request required a workspace id.")
    })

    it("should allow global builder in worker service without app context", async () => {
      env._set("SERVICE_TYPE", ServiceType.WORKER)
      const ctx = buildUserCtx(builderUser) // no app ID in context
      const next = jest.fn()

      await builderOnly(ctx, next)
      passed(ctx.throw, next)
    })

    it("should not allow without app ID in apps", async () => {
      env._set("SERVICE_TYPE", ServiceType.APPS)
      const appId = "app_a"
      const ctx = buildUserCtx({
        ...basicUser,
        builder: {
          apps: [appId],
        },
      })
      const next = jest.fn()
      await doInWorkspaceContext(ctx, appId, () => builderOnly(ctx, next))
      passed(ctx.throw, next)

      await doInWorkspaceContext(ctx, "app_b", () => builderOnly(ctx, next))
      threw(ctx.throw, 403, "Workspace builder user only endpoint.")
    })

    it("should allow app builder without workspace in worker service", async () => {
      env._set("SERVICE_TYPE", ServiceType.WORKER)
      const ctx = buildUserCtx({
        ...basicUser,
        builder: {
          apps: ["app_a"],
        },
      })
      const next = jest.fn()
      await builderOnly(ctx, next)
      passed(ctx.throw, next)
    })

    it("should deny basic user in worker service without builder permissions", async () => {
      env._set("SERVICE_TYPE", ServiceType.WORKER)
      const ctx = buildUserCtx(basicUser),
        next = jest.fn()
      await builderOnly(ctx, next)
      threw(ctx.throw, 403, "Builder user only endpoint.")
    })

    it("should allow creator user with app-specific builder permissions", async () => {
      const creatorUser = {
        ...basicUser,
        builder: {
          creator: true,
          apps: [appId],
        },
        roles: {
          [appId]: "CREATOR",
        },
      }
      const ctx = buildUserCtx(creatorUser),
        next = jest.fn()

      await doInWorkspaceContext(ctx, appId, () => builderOnly(ctx, next))
      passed(ctx.throw, next)
    })

    it("should deny creator user without app-specific builder permissions for different app", async () => {
      const creatorUser = {
        ...basicUser,
        builder: {
          creator: true,
          apps: ["app_different"],
        },
        roles: {
          app_different: "CREATOR",
        },
      }
      const ctx = buildUserCtx(creatorUser),
        next = jest.fn()

      await doInWorkspaceContext(ctx, appId, () => builderOnly(ctx, next))
      threw(ctx.throw, 403, "Workspace builder user only endpoint.")
    })

    it("should allow creator user in worker service", async () => {
      env._set("SERVICE_TYPE", ServiceType.WORKER)
      const creatorUser = {
        ...basicUser,
        builder: {
          creator: true,
          apps: [appId],
        },
        roles: {
          [appId]: "CREATOR",
        },
      }
      const ctx = buildUserCtx(creatorUser),
        next = jest.fn()

      await builderOnly(ctx, next)
      passed(ctx.throw, next)
    })
  })

  describe("builderOrAdmin middleware", () => {
    it("should require workspace ID for non-admin global builder in apps service", async () => {
      env._set("SERVICE_TYPE", ServiceType.APPS)
      const ctx = buildUserCtx(builderUser),
        next = jest.fn()
      await builderOrAdmin(ctx, next)
      threw(ctx.throw, 403, "This request required a workspace id.")
    })

    it("should allow admin users (bypass all other checks)", async () => {
      const ctx = buildUserCtx(adminUser),
        next = jest.fn()
      await builderOrAdmin(ctx, next)
      passed(ctx.throw, next)
    })

    it("should allow admin-only users (bypass all other checks)", async () => {
      const ctx = buildUserCtx(adminOnlyUser),
        next = jest.fn()
      await builderOrAdmin(ctx, next)
      passed(ctx.throw, next)
    })

    it("should allow app builder user in correct workspace", async () => {
      const ctx = buildUserCtx(appBuilderUser),
        next = jest.fn()
      await doInWorkspaceContext(ctx, appId, () => builderOrAdmin(ctx, next))
      passed(ctx.throw, next)
    })

    it("should not allow basic user without workspace", async () => {
      const ctx = buildUserCtx(basicUser),
        next = jest.fn()
      await builderOrAdmin(ctx, next)
      threw(ctx.throw, 403, "This request required a workspace id.")
    })

    it("should allow internal requests to bypass all security", async () => {
      const ctx = buildUserCtx(basicUser)
      ctx.internal = true
      const next = jest.fn()

      await doInWorkspaceContext(ctx, "app_b", () => builderOrAdmin(ctx, next))
      passed(ctx.throw, next)
    })

    it("should deny app builder access to different app", async () => {
      const ctx = buildUserCtx(appBuilderUser)
      const next = jest.fn()

      await doInWorkspaceContext(ctx, "app_b", () => builderOrAdmin(ctx, next))
      threw(ctx.throw, 403, "Workspace Admin/Builder user only endpoint.")
    })

    it("should allow global builder access to any app", async () => {
      const ctx = buildUserCtx(builderUser)
      const next = jest.fn()

      await doInWorkspaceContext(ctx, "app_b", () => builderOrAdmin(ctx, next))
      passed(ctx.throw, next)
    })

    it("should allow admin access even without app context", async () => {
      const ctx = buildUserCtx(adminUser) // no app ID in context
      const next = jest.fn()

      await builderOrAdmin(ctx, next)
      passed(ctx.throw, next)
    })

    it("should allow global builder in worker service without app context", async () => {
      env._set("SERVICE_TYPE", ServiceType.WORKER)
      const ctx = buildUserCtx(builderUser) // no app ID in context
      const next = jest.fn()

      await builderOrAdmin(ctx, next)
      passed(ctx.throw, next)
    })

    it("should deny basic user access regardless of app context", async () => {
      const ctx = buildUserCtx(basicUser)
      const next = jest.fn()

      await doInWorkspaceContext(ctx, appId, () => builderOrAdmin(ctx, next))
      threw(ctx.throw, 403, "Workspace Admin/Builder user only endpoint.")
    })

    it("should allow creator user with app-specific permissions", async () => {
      const creatorUser = {
        ...basicUser,
        builder: {
          creator: true,
          apps: [appId],
        },
        roles: {
          [appId]: "CREATOR",
        },
      }
      const ctx = buildUserCtx(creatorUser)
      const next = jest.fn()

      await doInWorkspaceContext(ctx, appId, () => builderOrAdmin(ctx, next))
      passed(ctx.throw, next)
    })

    it("should deny creator user without app-specific permissions for different app", async () => {
      const creatorUser = {
        ...basicUser,
        builder: {
          creator: true,
          apps: ["app_different"],
        },
        roles: {
          app_different: "CREATOR",
        },
      }
      const ctx = buildUserCtx(creatorUser)
      const next = jest.fn()

      await doInWorkspaceContext(ctx, appId, () => builderOrAdmin(ctx, next))
      threw(ctx.throw, 403, "Workspace Admin/Builder user only endpoint.")
    })

    it("should allow creator user in worker service without app context", async () => {
      env._set("SERVICE_TYPE", ServiceType.WORKER)
      const creatorUser = {
        ...basicUser,
        builder: {
          creator: true,
          apps: [appId],
        },
        roles: {
          [appId]: "CREATOR",
        },
      }
      const ctx = buildUserCtx(creatorUser)
      const next = jest.fn()

      await builderOrAdmin(ctx, next)
      passed(ctx.throw, next)
    })
  })
})
