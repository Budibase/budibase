import type { User, UserCtx } from "@budibase/types"
import type { Next } from "koa"
import controller from "../roles"
import { sdk } from "@budibase/pro"
import { syncUsersAgainstWorkspaces } from "../../../../sdk/workspace/workspaces/sync"
import type {
  RoleAssignRequest,
  RoleAssignmentResponse,
  RoleUnAssignRequest,
} from "../mapping/types"

jest.mock("@budibase/pro", () => ({
  sdk: {
    publicApi: {
      roles: {
        assign: jest.fn(),
        unAssign: jest.fn(),
      },
    },
  },
}))

jest.mock("../../../../sdk/workspace/workspaces/sync", () => ({
  syncUsersAgainstWorkspaces: jest.fn(),
}))

interface TestError extends Error {
  status?: number
}

const createThrow = () =>
  jest.fn((status: number, message: string) => {
    const error = new Error(message) as TestError
    error.status = status
    throw error
  })

type RoleRequest = RoleAssignRequest | RoleUnAssignRequest

const assign = jest.mocked(sdk.publicApi.roles.assign)
const unAssign = jest.mocked(sdk.publicApi.roles.unAssign)
const syncUsers = jest.mocked(syncUsersAgainstWorkspaces)

const createCtx = <RequestBody extends RoleRequest>(
  body: RequestBody,
  user?: Partial<User>
): UserCtx<RequestBody, RoleAssignmentResponse> =>
  ({
    user,
    throw: createThrow(),
    request: {
      body,
    },
  }) as unknown as UserCtx<RequestBody, RoleAssignmentResponse>

const createNext = () =>
  jest.fn().mockResolvedValue(undefined) as jest.MockedFunction<Next>

describe("public roles controller", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    assign.mockResolvedValue(undefined)
    unAssign.mockResolvedValue(undefined)
    syncUsers.mockResolvedValue(undefined)
  })

  describe("assign", () => {
    it("syncs users to all provided workspaces when appIds are present", async () => {
      const userIds = ["user_basic", "user_admin"]
      const requestBody: RoleAssignRequest = {
        userIds,
        role: {
          roleId: "ROLE_BASIC",
          appId: "app_123",
        },
        appBuilder: {
          appId: "app_builder",
        },
      }
      const ctx = createCtx(requestBody)
      const next = createNext()

      await controller.assign(ctx, next)

      expect(assign).toHaveBeenCalledWith(userIds, {
        role: requestBody.role,
        appBuilder: requestBody.appBuilder,
      })
      expect(syncUsers).toHaveBeenCalledTimes(1)
      expect(syncUsers).toHaveBeenCalledWith(userIds, [
        requestBody.role?.appId,
        requestBody.appBuilder?.appId,
      ])
      expect(ctx.body).toEqual({ data: { userIds } })
      expect(next).toHaveBeenCalled()
    })

    it("requires global builder permissions to assign global builder", async () => {
      const userIds = ["user_basic"]
      const ctx = createCtx(
        {
          userIds,
          builder: true,
        },
        {
          builder: {
            apps: ["prod-app_123"],
          },
        }
      )
      const next = createNext()

      await expect(controller.assign(ctx, next)).rejects.toMatchObject({
        status: 403,
      })

      expect(assign).not.toHaveBeenCalled()
      expect(next).not.toHaveBeenCalled()
    })

    it("requires global admin permissions to assign global admin", async () => {
      const userIds = ["user_basic"]
      const ctx = createCtx(
        {
          userIds,
          admin: true,
        },
        {
          builder: {
            global: true,
          },
        }
      )
      const next = createNext()

      await expect(controller.assign(ctx, next)).rejects.toMatchObject({
        status: 403,
      })

      expect(assign).not.toHaveBeenCalled()
      expect(next).not.toHaveBeenCalled()
    })

    it("allows global builder assignments from global builders", async () => {
      const userIds = ["user_basic"]
      const ctx = createCtx(
        {
          userIds,
          builder: true,
        },
        {
          builder: {
            global: true,
          },
        }
      )
      const next = createNext()

      await controller.assign(ctx, next)

      expect(assign).toHaveBeenCalledWith(userIds, {
        builder: true,
      })
      expect(ctx.body).toEqual({ data: { userIds } })
      expect(next).toHaveBeenCalled()
    })

    it("allows global role assignments from users with matching permissions", async () => {
      const userIds = ["user_basic"]
      const ctx = createCtx(
        {
          userIds,
          builder: true,
          admin: true,
        },
        {
          admin: {
            global: true,
          },
        }
      )
      const next = createNext()

      await controller.assign(ctx, next)

      expect(assign).toHaveBeenCalledWith(userIds, {
        builder: true,
        admin: true,
      })
      expect(ctx.body).toEqual({ data: { userIds } })
      expect(next).toHaveBeenCalled()
    })
  })

  describe("unAssign", () => {
    it("syncs users against workspaces when appIds are provided", async () => {
      const userIds = ["user_basic", "user_admin"]
      const requestBody: RoleUnAssignRequest = {
        userIds,
        role: {
          roleId: "ROLE_BASIC",
          appId: "app_123",
        },
        appBuilder: {
          appId: "app_builder",
        },
      }
      const ctx = createCtx(requestBody)
      const next = createNext()

      await controller.unAssign(ctx, next)

      expect(unAssign).toHaveBeenCalledWith(userIds, {
        role: requestBody.role,
        appBuilder: requestBody.appBuilder,
      })
      expect(syncUsers).toHaveBeenCalledTimes(1)
      expect(syncUsers).toHaveBeenCalledWith(userIds, [
        requestBody.role?.appId,
        requestBody.appBuilder?.appId,
      ])
      expect(ctx.body).toEqual({ data: { userIds } })
      expect(next).toHaveBeenCalled()
    })

    it("requires global permissions to remove global roles", async () => {
      const userIds = ["user_basic"]
      const ctx = createCtx(
        {
          userIds,
          builder: true,
        },
        {
          builder: {
            apps: ["prod-app_123"],
          },
        }
      )
      const next = createNext()

      await expect(controller.unAssign(ctx, next)).rejects.toMatchObject({
        status: 403,
      })

      expect(unAssign).not.toHaveBeenCalled()
      expect(next).not.toHaveBeenCalled()
    })

    it("allows global builder removal from global builders", async () => {
      const userIds = ["user_basic"]
      const ctx = createCtx(
        {
          userIds,
          builder: true,
        },
        {
          builder: {
            global: true,
          },
        }
      )
      const next = createNext()

      await controller.unAssign(ctx, next)

      expect(unAssign).toHaveBeenCalledWith(userIds, {
        builder: true,
      })
      expect(ctx.body).toEqual({ data: { userIds } })
      expect(next).toHaveBeenCalled()
    })

    it("allows global role removal from global admins", async () => {
      const userIds = ["user_basic"]
      const ctx = createCtx(
        {
          userIds,
          builder: true,
          admin: true,
        },
        {
          admin: {
            global: true,
          },
        }
      )
      const next = createNext()

      await controller.unAssign(ctx, next)

      expect(unAssign).toHaveBeenCalledWith(userIds, {
        builder: true,
        admin: true,
      })
      expect(ctx.body).toEqual({ data: { userIds } })
      expect(next).toHaveBeenCalled()
    })
  })
})
