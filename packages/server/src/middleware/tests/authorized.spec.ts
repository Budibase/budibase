jest.mock("../../environment", () => ({
  prod: false,
  isTest: () => true,
  // @ts-ignore
  isProd: () => this.prod,
  _set: function (_key: string, value: string) {
    this.prod = value === "production"
  },
}))

import { PermissionType, PermissionLevel } from "@budibase/types"

import authorizedMiddleware from "../authorized"
import env from "../../environment"
import { generateTableID, generateViewID } from "../../db/utils"

const APP_ID = ""

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
  const next = jest.fn()
  let config: TestConfiguration

  afterEach(() => {
    config.afterEach()
  })

  beforeEach(() => {
    jest.clearAllMocks()
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

      expect(config.throw).toHaveBeenCalledWith(403, "No user info found")
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
        403,
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

    describe("view type", () => {
      const tableId = generateTableID()
      const viewId = generateViewID(tableId)

      beforeEach(() => {
        config.setMiddlewareRequiredPermission(
          PermissionType.VIEW,
          PermissionLevel.READ
        )
        config.setResourceId(viewId)

        config.setUser({
          role: {
            _id: "",
          },
        })
      })

      it("throw an exception if the resource id is not provided", async () => {
        config.setResourceId(undefined)
        await config.executeMiddleware()
        expect(config.throw).toHaveBeenNthCalledWith(
          1,
          400,
          "Cannot obtain the view id"
        )
      })

      it("throw an exception if the resource id is not a valid view id", async () => {
        config.setResourceId(tableId)
        await config.executeMiddleware()
        expect(config.throw).toHaveBeenNthCalledWith(
          1,
          400,
          `"${tableId}" is not a valid view id`
        )
      })
    })
  })
})
