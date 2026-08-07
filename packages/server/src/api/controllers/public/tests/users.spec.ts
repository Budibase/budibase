import type { ContextUser, User, UserCtx } from "@budibase/types"
import type { Next } from "koa"
import controller from "../users"
import {
  readGlobalUser,
  saveGlobalUser,
} from "../../../../utilities/workerRequests"

jest.mock("../../../../utilities/workerRequests", () => ({
  readGlobalUser: jest.fn(),
  saveGlobalUser: jest.fn(),
}))

jest.mock("@budibase/pro", () => ({
  sdk: {
    publicApi: {
      users: {
        roleCheck: jest.fn(ctx => ctx),
      },
    },
  },
}))

type TestUser = ContextUser
type TestTarget = {
  _id: string
  email: string
}
type TestContext = {
  user: TestUser
  params: {
    userId: string
  }
  request: {
    body: {
      _id: string
      email: string
      roles: User["roles"]
      builder: {
        apps: unknown
      }
    }
  }
  throw: (status: number, message: string) => never
}

const createCtx = ({
  caller,
  target,
  builderApps,
  roles = {},
}: {
  caller: TestUser
  target: TestTarget
  builderApps?: unknown
  roles?: User["roles"]
}): UserCtx =>
  ({
    user: caller,
    params: {
      userId: target._id,
    },
    request: {
      body: {
        _id: target._id,
        email: target.email,
        roles,
        builder: {
          apps: builderApps,
        },
      },
    },
    throw: (status: number, message: string) => {
      const err = Object.assign(new Error(message), { status })
      throw err
    },
  }) as TestContext as UserCtx

describe("public users controller", () => {
  const readUser = readGlobalUser as jest.MockedFunction<typeof readGlobalUser>
  const saveUser = saveGlobalUser as jest.MockedFunction<typeof saveGlobalUser>

  beforeEach(() => {
    jest.clearAllMocks()
  })

  const targetUser = {
    _id: "user_target",
    email: "target@example.com",
  }

  const setExistingTargetUser = (roles: User["roles"] = {}) => {
    const user: User = {
      ...targetUser,
      tenantId: "tenant",
      roles,
      builder: { apps: [] },
    }
    readUser.mockResolvedValue(user)
  }

  const saveTargetUser = () => {
    saveUser.mockResolvedValue({ _id: targetUser._id })
  }

  it("allows an organisation admin to assign any user to any workspace", async () => {
    const ctx = createCtx({
      caller: {
        _id: "user_admin",
        email: "admin@example.com",
        tenantId: "tenant",
        admin: {
          global: true,
        },
      },
      target: targetUser,
      builderApps: ["app_target"],
    })
    setExistingTargetUser()
    saveTargetUser()
    const next = jest
      .fn()
      .mockResolvedValue(undefined) as jest.MockedFunction<Next>

    await controller.update(ctx, next)

    expect(saveUser).toHaveBeenCalledTimes(1)
    expect(next).toHaveBeenCalled()
  })

  it("allows a workspace creator to assign another user to their workspace", async () => {
    const ctx = createCtx({
      caller: {
        _id: "user_creator",
        email: "creator@example.com",
        tenantId: "tenant",
        builder: {
          apps: ["app_allowed"],
        },
      },
      target: targetUser,
      builderApps: ["app_allowed"],
    })
    setExistingTargetUser()
    saveTargetUser()
    const next = jest
      .fn()
      .mockResolvedValue(undefined) as jest.MockedFunction<Next>

    await controller.update(ctx, next)

    expect(saveUser).toHaveBeenCalledTimes(1)
    expect(next).toHaveBeenCalled()
  })

  it("allows a workspace creator to assign a new user to their workspace", async () => {
    const ctx = createCtx({
      caller: {
        _id: "user_creator",
        email: "creator@example.com",
        tenantId: "tenant",
        builder: {
          apps: ["app_allowed"],
        },
      },
      target: targetUser,
      builderApps: ["app_allowed"],
    })
    setExistingTargetUser()
    saveTargetUser()
    const next = jest
      .fn()
      .mockResolvedValue(undefined) as jest.MockedFunction<Next>

    await controller.create(ctx, next)

    expect(saveUser).toHaveBeenCalledTimes(1)
    expect(next).toHaveBeenCalled()
  })

  it("rejects a workspace creator assigning another user to a different workspace", async () => {
    const ctx = createCtx({
      caller: {
        _id: "user_creator",
        email: "creator@example.com",
        tenantId: "tenant",
        builder: {
          apps: ["app_allowed"],
        },
      },
      target: targetUser,
      builderApps: ["app_target"],
    })
    setExistingTargetUser()
    const next = jest
      .fn()
      .mockResolvedValue(undefined) as jest.MockedFunction<Next>

    await expect(controller.update(ctx, next)).rejects.toMatchObject({
      status: 403,
    })

    expect(saveUser).not.toHaveBeenCalled()
  })

  it("rejects a workspace creator assigning a new user to a different workspace", async () => {
    const ctx = createCtx({
      caller: {
        _id: "user_creator",
        email: "creator@example.com",
        tenantId: "tenant",
        builder: {
          apps: ["app_allowed"],
        },
      },
      target: targetUser,
      builderApps: ["app_target"],
    })
    const next = jest
      .fn()
      .mockResolvedValue(undefined) as jest.MockedFunction<Next>

    await expect(controller.create(ctx, next)).rejects.toMatchObject({
      status: 403,
    })

    expect(saveUser).not.toHaveBeenCalled()
  })

  it("rejects an end user assigning another user to a workspace", async () => {
    const ctx = createCtx({
      caller: {
        _id: "user_end",
        email: "end@example.com",
        tenantId: "tenant",
      },
      target: targetUser,
      builderApps: ["app_target"],
    })
    setExistingTargetUser()
    const next = jest
      .fn()
      .mockResolvedValue(undefined) as jest.MockedFunction<Next>

    await expect(controller.update(ctx, next)).rejects.toMatchObject({
      status: 403,
    })

    expect(saveUser).not.toHaveBeenCalled()
  })

  it("allows a workspace creator to set roles for their workspace", async () => {
    const ctx = createCtx({
      caller: {
        _id: "user_creator",
        email: "creator@example.com",
        tenantId: "tenant",
        builder: {
          apps: ["app_allowed"],
        },
      },
      target: targetUser,
      roles: { app_allowed: "ADMIN" },
    })
    setExistingTargetUser()
    saveTargetUser()
    const next = jest
      .fn()
      .mockResolvedValue(undefined) as jest.MockedFunction<Next>

    await controller.update(ctx, next)

    expect(saveUser).toHaveBeenCalledTimes(1)
    expect(next).toHaveBeenCalled()
  })

  it("allows a workspace creator to create a user with roles for their workspace", async () => {
    const ctx = createCtx({
      caller: {
        _id: "user_creator",
        email: "creator@example.com",
        tenantId: "tenant",
        builder: {
          apps: ["app_allowed"],
        },
      },
      target: targetUser,
      roles: { app_allowed: "BASIC" },
    })
    saveTargetUser()
    const next = jest
      .fn()
      .mockResolvedValue(undefined) as jest.MockedFunction<Next>

    await controller.create(ctx, next)

    expect(saveUser).toHaveBeenCalledTimes(1)
    expect(next).toHaveBeenCalled()
  })

  it("rejects a workspace creator setting roles for a different workspace", async () => {
    const ctx = createCtx({
      caller: {
        _id: "user_creator",
        email: "creator@example.com",
        tenantId: "tenant",
        builder: {
          apps: ["app_allowed"],
        },
      },
      target: targetUser,
      roles: { app_other: "ADMIN" },
    })
    setExistingTargetUser()
    const next = jest
      .fn()
      .mockResolvedValue(undefined) as jest.MockedFunction<Next>

    await expect(controller.update(ctx, next)).rejects.toMatchObject({
      status: 403,
    })

    expect(saveUser).not.toHaveBeenCalled()
  })

  it("rejects a workspace creator creating a user with roles for a different workspace", async () => {
    const ctx = createCtx({
      caller: {
        _id: "user_creator",
        email: "creator@example.com",
        tenantId: "tenant",
        builder: {
          apps: ["app_allowed"],
        },
      },
      target: targetUser,
      roles: { app_other: "ADMIN" },
    })
    const next = jest
      .fn()
      .mockResolvedValue(undefined) as jest.MockedFunction<Next>

    await expect(controller.create(ctx, next)).rejects.toMatchObject({
      status: 403,
    })

    expect(saveUser).not.toHaveBeenCalled()
  })

  it("rejects a workspace creator removing roles for a different workspace", async () => {
    const ctx = createCtx({
      caller: {
        _id: "user_creator",
        email: "creator@example.com",
        tenantId: "tenant",
        builder: {
          apps: ["app_allowed"],
        },
      },
      target: targetUser,
      roles: {},
    })
    setExistingTargetUser({ app_other: "ADMIN" })
    const next = jest
      .fn()
      .mockResolvedValue(undefined) as jest.MockedFunction<Next>

    await expect(controller.update(ctx, next)).rejects.toMatchObject({
      status: 403,
    })

    expect(saveUser).not.toHaveBeenCalled()
  })

  it("allows unchanged roles for workspaces the caller does not build", async () => {
    const ctx = createCtx({
      caller: {
        _id: "user_creator",
        email: "creator@example.com",
        tenantId: "tenant",
        builder: {
          apps: ["app_allowed"],
        },
      },
      target: targetUser,
      roles: {
        app_other: "BASIC",
        app_allowed: "ADMIN",
      },
    })
    setExistingTargetUser({ app_other: "BASIC" })
    saveTargetUser()
    const next = jest
      .fn()
      .mockResolvedValue(undefined) as jest.MockedFunction<Next>

    await controller.update(ctx, next)

    expect(saveUser).toHaveBeenCalledTimes(1)
    expect(next).toHaveBeenCalled()
  })
})
