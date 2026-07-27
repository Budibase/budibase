import type {
  DuplicateResourceToWorkspaceRequest,
  UserCtx,
} from "@budibase/types"
import * as controller from "../resource"
import sdk from "../../../sdk"

jest.mock("../../../sdk", () => ({
  resources: {
    duplicateResourcesToWorkspace: jest.fn(),
  },
}))

const createCtx = (
  body: DuplicateResourceToWorkspaceRequest
): UserCtx<DuplicateResourceToWorkspaceRequest, void> =>
  ({
    user: {
      builder: {
        apps: ["app_allowed"],
      },
    },
    request: {
      body,
    },
    throw: jest.fn((status, message) => {
      const err = Object.assign(new Error(message), { status })
      throw err
    }),
  }) as unknown as UserCtx<DuplicateResourceToWorkspaceRequest, void>

describe("resource controller", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("duplicateResourceToWorkspace", () => {
    it("rejects requests when the caller does not build the destination app", async () => {
      const ctx = createCtx({
        resources: ["ta_123"],
        toWorkspace: "app_target",
      })

      await expect(
        controller.duplicateResourceToWorkspace(ctx)
      ).rejects.toMatchObject({
        status: 403,
      })
      expect(sdk.resources.duplicateResourcesToWorkspace).not.toHaveBeenCalled()
    })

    it("duplicates resources when the caller builds the destination app", async () => {
      const ctx = createCtx({
        resources: ["ta_123"],
        toWorkspace: "app_allowed",
        copyRows: false,
      })

      await controller.duplicateResourceToWorkspace(ctx)

      expect(sdk.resources.duplicateResourcesToWorkspace).toHaveBeenCalledWith(
        ["ta_123"],
        "app_allowed",
        {
          copyRows: false,
        }
      )
      expect(ctx.status).toBe(204)
    })
  })
})
