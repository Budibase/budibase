jest.mock("../../sdk/app/permissions", () => ({
  ...jest.requireActual("../../sdk/app/permissions"),
  getResourcePerms: jest.fn().mockResolvedValue([]),
}))

import {
  PermissionType,
  PermissionLevel,
  PermissionSource,
} from "@budibase/types"

import authorizedMiddleware from "../authorized"
import env from "../../environment"
import { generator, mocks } from "@budibase/backend-core/tests"
import { initProMocks } from "../../tests/utilities/mocks/pro"
import { getResourcePerms } from "../../sdk/app/permissions"

const APP_ID = ""

initProMocks()

class TestConfiguration {
  middleware: (ctx: any, next: any) => Promise<void>
  next: () => void
  throw: () => void
  headers: Record<string, any>
  ctx: any

  constructor() {
    this.middleware = authorizedMiddleware(PermissionType.APP)
    this.next = jest.fn()
    this.throw = jest.fn()
    this.headers = {}
    this.ctx = {
      headers: {},
      request: {
        url: "",
      },
      appId: APP_ID,
      auth: {},
      next: this.next,
      throw: this.throw,
      get: (name: string) => this.headers[name],
    }
  }

  executeMiddleware() {
    return this.middleware(this.ctx, this.next)
  }

  setUser(user: any) {
    this.ctx.user = user
  }

  setMiddlewareRequiredPermission(...perms: any[]) {
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
      config.setUser({
        _id: "user",
        role: {
          _id: "ADMIN",
        },
      })

      await config.executeMiddleware()

      expect(config.next).toHaveBeenCalled()
    })

    it("throws if the user does not have builder permissions", async () => {
      config.setEnvironment(false)
      config.setMiddlewareRequiredPermission(PermissionType.BUILDER)
      config.setUser({
        role: {
          _id: "",
        },
      })
      await config.executeMiddleware()

      expect(config.throw).toHaveBeenCalledWith(403, "Not Authorized")
    })

    it("passes on to next() middleware if the user has resource permission", async () => {
      config.setResourceId(PermissionType.QUERY)
      config.setUser({
        role: {
          _id: "",
        },
      })
      config.setMiddlewareRequiredPermission(PermissionType.QUERY)

      await config.executeMiddleware()
      expect(config.next).toHaveBeenCalled()
    })

    it("throws if the user session is not authenticated", async () => {
      config.setUser({
        role: {
          _id: "",
        },
      })
      config.setAuthenticated(false)

      await config.executeMiddleware()
      expect(config.throw).toHaveBeenCalledWith(
        401,
        "Session not authenticated"
      )
    })

    it("throws if the user does not have base permissions to perform the operation", async () => {
      config.setUser({
        role: {
          _id: "",
        },
      })
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
          _id: "user",
          role: {
            _id: "PUBLIC",
          },
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
})
