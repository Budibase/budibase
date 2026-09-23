import type {
  DuplicateResourceToWorkspaceRequest,
  UserCtx,
} from "@budibase/types"
import { destinationWorkspaceBuilderOrAdmin } from "../destinationWorkspaceBuilderOrAdmin"

const createCtx = (
  body: DuplicateResourceToWorkspaceRequest
): UserCtx<DuplicateResourceToWorkspaceRequest> =>
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
  }) as unknown as UserCtx<DuplicateResourceToWorkspaceRequest>

describe("destinationWorkspaceBuilderOrAdmin middleware", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("rejects requests when the caller does not build the destination app", async () => {
    const ctx = createCtx({
      resources: ["ta_123"],
      toWorkspace: "app_target",
    })
    const next = jest.fn()

    await expect(
      destinationWorkspaceBuilderOrAdmin(ctx, next)
    ).rejects.toMatchObject({
      status: 403,
    })
    expect(next).not.toHaveBeenCalled()
  })

  it("allows requests when the caller builds the destination app", async () => {
    const ctx = createCtx({
      resources: ["ta_123"],
      toWorkspace: "app_allowed",
    })
    const next = jest.fn()

    await destinationWorkspaceBuilderOrAdmin(ctx, next)

    expect(next).toHaveBeenCalled()
  })
})
