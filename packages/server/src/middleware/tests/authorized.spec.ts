jest.mock("../../sdk/app/permissions", () => ({
  ...jest.requireActual("../../sdk/app/permissions"),
  getResourcePerms: jest.fn().mockResolvedValue([]),
}))

import {
  PermissionType,
  PermissionLevel,
  PermissionSource,
  UserCtx,
  ContextUser,
  User,
} from "@budibase/types"

import authorizedMiddleware from "../authorized"
import env from "../../environment"
import { generator, mocks, structures } from "@budibase/backend-core/tests"
import { initProMocks } from "../../tests/utilities/mocks/pro"
import { getResourcePerms } from "../../sdk/app/permissions"
import { Header } from "@budibase/shared-core"
import { cache, context, db, docIds, roles } from "@budibase/backend-core"

jest.mock("@budibase/backend-core", () => {
  const actual = jest.requireActual<typeof import("@budibase/backend-core")>(
    "@budibase/backend-core"
  )
  const result: typeof actual = {
    ...actual,
    cache: {
      ...actual.cache,
      user: {
        getUser: jest.fn(),
        getUsers: jest.fn(),
        invalidateUser: jest.fn(),
      },
    },
  }
  return result
})

const userCacheMock = jest.mocked(cache.user)

const APP_ID = ""

initProMocks()

class TestConfiguration {
  middleware: ReturnType<typeof authorizedMiddleware>
  next: () => any
  throw: () => never
  headers: Record<string, any>
  ctx: UserCtx

  constructor() {
    this.middleware = authorizedMiddleware(
      PermissionType.APP,
      PermissionLevel.READ
    )
    this.next = jest.fn()
    this.throw = jest.fn<never, []>()
    this.headers = {}
    this.ctx = {
      headers: {},
      request: {
        url: "",
      } as UserCtx["request"],
      appId: APP_ID,
      auth: {},
      next: this.next,
      throw: this.throw,
      get: (name: string) => this.headers[name],
    } as any
  }

  executeMiddleware() {
    return this.middleware(this.ctx, this.next)
  }

  setUser(user: ContextUser) {
    this.ctx.user = user
    this.ctx.roleId = user.role?._id ?? user.roleId ?? undefined
  }

  setImpersonateUser(userId: string | null) {
    if (userId) {
      this.headers[Header.PREVIEW_USER] = userId
    } else {
      delete this.headers[Header.PREVIEW_USER]
    }
  }

  setMiddlewareRequiredPermission(
    ...perms: Parameters<typeof authorizedMiddleware>
  ) {
    // @ts-ignore
    this.middleware = authorizedMiddleware(...perms)
  }

  setResourceId(id?: string) {
    this.ctx.resourceId = id
  }

  setAuthenticated(isAuthed: boolean) {
    this.ctx.isAuthenticated = isAuthed
  }

  setRequestUrl(url: string) {
    this.ctx.request.url = url
  }

  setEnvironment(isProd: boolean) {
    env._set("NODE_ENV", isProd ? "production" : "jest")
  }

  setRequestHeaders(headers: Record<string, any>) {
    this.ctx.headers = headers
  }

  afterEach() {
    jest.clearAllMocks()
  }
}

describe("Authorization middleware", () => {
  let config: TestConfiguration

  afterEach(() => {
    config.afterEach()
  })

  beforeEach(() => {
    jest.clearAllMocks()
    mocks.licenses.useCloudFree()
    config = new TestConfiguration()
  })

  const publicUser: ContextUser = {
    ...structures.users.user(),
    roleId: roles.BUILTIN_ROLE_IDS.PUBLIC,
  }

  const adminUser: ContextUser = {
    ...structures.users.builderUser(),
    roleId: roles.BUILTIN_ROLE_IDS.ADMIN,
  }

  describe("non-webhook call", () => {
    beforeEach(() => {
      config = new TestConfiguration()
      config.setEnvironment(true)
      config.setAuthenticated(true)
    })

    it("throws when no user data is present in context", async () => {
      await config.executeMiddleware()

      expect(config.throw).toHaveBeenCalledWith(401, "No user info found")
    })

    it("passes on to next() middleware if user is an admin", async () => {
      config.setUser(adminUser)

      await config.executeMiddleware()

      expect(config.next).toHaveBeenCalled()
      expect(config.throw).not.toHaveBeenCalled()
    })

    it("throws if the user does not have builder permissions", async () => {
      config.setEnvironment(false)
      config.setMiddlewareRequiredPermission(
        PermissionType.BUILDER,
        PermissionLevel.READ
      )
      config.setUser(publicUser)
      await config.executeMiddleware()

      expect(config.throw).toHaveBeenCalledWith(403, "Not Authorized")
    })

    it("passes on to next() middleware if the user has resource permission", async () => {
      config.setResourceId(PermissionType.QUERY)
      config.setUser(publicUser)
      config.setMiddlewareRequiredPermission(
        PermissionType.QUERY,
        PermissionLevel.READ
      )

      await config.executeMiddleware()
      expect(config.next).toHaveBeenCalled()
    })

    it("throws if the user session is not authenticated", async () => {
      config.setUser(publicUser)
      config.setAuthenticated(false)

      await config.executeMiddleware()
      expect(config.throw).toHaveBeenCalledWith(
        401,
        "Session not authenticated"
      )
    })

    it("throws if the user does not have base permissions to perform the operation", async () => {
      config.setUser(publicUser)
      config.setMiddlewareRequiredPermission(
        PermissionType.APP,
        PermissionLevel.READ
      )

      await config.executeMiddleware()
      expect(config.throw).toHaveBeenCalledWith(
        403,
        "User does not have permission"
      )
    })

    describe("with resource", () => {
      let resourceId: string
      const mockedGetResourcePerms = getResourcePerms as jest.MockedFunction<
        typeof getResourcePerms
      >

      beforeEach(() => {
        config.setMiddlewareRequiredPermission(
          PermissionType.VIEW,
          PermissionLevel.READ
        )
        resourceId = generator.guid()
        config.setResourceId(resourceId)

        mockedGetResourcePerms.mockResolvedValue({
          [PermissionLevel.READ]: {
            role: "PUBLIC",
            type: PermissionSource.BASE,
          },
        })

        config.setUser({
          ...publicUser,
          roleId: "PUBLIC",
        })
      })

      it("will fetch resource permissions when resource is set", async () => {
        await config.executeMiddleware()

        expect(config.throw).not.toHaveBeenCalled()
        expect(config.next).toHaveBeenCalled()

        expect(mockedGetResourcePerms).toHaveBeenCalledTimes(1)
        expect(mockedGetResourcePerms).toHaveBeenCalledWith(resourceId)
      })
    })
  })

  describe("impersonate user", () => {
    const appProdId = db.getProdAppID(docIds.generateAppID())
    const appDevId = db.getDevAppID(appProdId)
    const loggedInUser: ContextUser = adminUser
    const impersonatedUser: User = structures.users.builderUser()

    beforeEach(() => {
      config = new TestConfiguration()
      config.setEnvironment(true)
      config.setAuthenticated(true)
      config.setUser(loggedInUser)
      config.setImpersonateUser(impersonatedUser._id!)

      userCacheMock.getUser.mockResolvedValue(impersonatedUser)
    })

    it("allows impersonating a user", async () => {
      await context.doInAppContext(appDevId, async () => {
        config.setMiddlewareRequiredPermission(
          PermissionType.QUERY,
          PermissionLevel.READ
        )

        expect(config.ctx.user._id).toBe(loggedInUser._id)
        await config.executeMiddleware()

        expect(config.ctx.user._id).toBe(impersonatedUser._id)

        expect(config.next).toHaveBeenCalled()
        expect(config.throw).not.toHaveBeenCalled()
      })
    })

    it("does not allow impersonating a user for builder calls", async () => {
      await context.doInAppContext(appDevId, async () => {
        config.setMiddlewareRequiredPermission(
          PermissionType.BUILDER,
          PermissionLevel.READ
        )

        expect(config.ctx.user._id).toBe(loggedInUser._id)
        await config.executeMiddleware()

        expect(config.ctx.user._id).toBe(loggedInUser._id)

        expect(config.next).toHaveBeenCalled()
        expect(config.throw).not.toHaveBeenCalled()
      })
    })

    it("does not allow impersonating in prod apps", async () => {
      await context.doInAppContext(appProdId, async () => {
        config.setMiddlewareRequiredPermission(
          PermissionType.QUERY,
          PermissionLevel.READ
        )

        expect(config.ctx.user._id).toBe(loggedInUser._id)
        await config.executeMiddleware()

        expect(config.ctx.user._id).toBe(loggedInUser._id)

        expect(config.next).not.toHaveBeenCalled()
        expect(config.throw).toHaveBeenCalledWith(403, "Action not allowed")
      })
    })
  })
})
