import type { UserCtx } from "@budibase/types"
import type { Next } from "koa"
import controller from "../roles"
import { sdk } from "@budibase/pro"
import { syncUsersAgainstWorkspaces } from "../../../../sdk/workspace/workspaces/sync"
import type {
  RoleAssignRequest,
  RoleAssignmentResponse,
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

const createCtx = (
  body: RoleAssignRequest
): UserCtx<RoleAssignRequest, RoleAssignmentResponse> =>
  ({
    request: {
      body,
    },
  }) as unknown as UserCtx<RoleAssignRequest, RoleAssignmentResponse>

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
      const ctx = createCtx(requestBody)
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
  })
})
