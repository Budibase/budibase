import type { UserCtx } from "@budibase/types"
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

const createAssignCtx = (
  body: RoleAssignRequest
): UserCtx<RoleAssignRequest, RoleAssignmentResponse> =>
  ({
    user: {
      admin: {
        global: true,
      },
    },
    request: {
      body,
    },
    throw: jest.fn((status, message) => {
      const err = Object.assign(new Error(message), { status })
      throw err
    }),
  }) as unknown as UserCtx<RoleAssignRequest, RoleAssignmentResponse>

const createUnAssignCtx = (
  body: RoleUnAssignRequest
): UserCtx<RoleUnAssignRequest, RoleAssignmentResponse> =>
  ({
    user: {
      admin: {
        global: true,
      },
    },
    request: {
      body,
    },
    throw: jest.fn((status, message) => {
      const err = Object.assign(new Error(message), { status })
      throw err
    }),
  }) as unknown as UserCtx<RoleUnAssignRequest, RoleAssignmentResponse>

describe("public roles controller", () => {
  beforeEach(() => {
    jest.clearAllMocks()
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
      const ctx = createAssignCtx(requestBody)
      const next = jest
        .fn()
        .mockResolvedValue(undefined) as jest.MockedFunction<Next>
      const assign = sdk.publicApi.roles.assign as jest.MockedFunction<
        typeof sdk.publicApi.roles.assign
      >
      assign.mockResolvedValue(undefined)
      const syncUsers = syncUsersAgainstWorkspaces as jest.MockedFunction<
        typeof syncUsersAgainstWorkspaces
      >
      syncUsers.mockResolvedValue(undefined)

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

    it("rejects app role assignment when the caller does not build the target app", async () => {
      const ctx = createAssignCtx({
        userIds: ["user_basic"],
        role: {
          roleId: "ROLE_BASIC",
          appId: "app_target",
        },
      })
      ctx.user = {
        builder: {
          apps: ["app_allowed"],
        },
      } as any
      const next = jest
        .fn()
        .mockResolvedValue(undefined) as jest.MockedFunction<Next>

      await expect(controller.assign(ctx, next)).rejects.toMatchObject({
        status: 403,
      })
      expect(sdk.publicApi.roles.assign).not.toHaveBeenCalled()
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
      const ctx = createUnAssignCtx(requestBody)
      const next = jest
        .fn()
        .mockResolvedValue(undefined) as jest.MockedFunction<Next>
      const unAssign = sdk.publicApi.roles.unAssign as jest.MockedFunction<
        typeof sdk.publicApi.roles.unAssign
      >
      unAssign.mockResolvedValue(undefined)
      const syncUsers = syncUsersAgainstWorkspaces as jest.MockedFunction<
        typeof syncUsersAgainstWorkspaces
      >
      syncUsers.mockResolvedValue(undefined)

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

    it("rejects app builder unassignment when the caller does not build the target app", async () => {
      const ctx = createUnAssignCtx({
        userIds: ["user_basic"],
        appBuilder: {
          appId: "app_target",
        },
      })
      ctx.user = {
        builder: {
          apps: ["app_allowed"],
        },
      } as any
      const next = jest
        .fn()
        .mockResolvedValue(undefined) as jest.MockedFunction<Next>

      await expect(controller.unAssign(ctx, next)).rejects.toMatchObject({
        status: 403,
      })
      expect(sdk.publicApi.roles.unAssign).not.toHaveBeenCalled()
    })
  })
})
