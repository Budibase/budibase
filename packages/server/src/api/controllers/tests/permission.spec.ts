import { BuiltinPermissionID } from "@budibase/types"
import type {
  FetchResourcePermissionInfoResponse,
  Role,
  UserCtx,
} from "@budibase/types"
import sdk from "../../../sdk"
import { fetch } from "../permission"

jest.mock("@budibase/backend-core", () => ({
  context: {
    getWorkspaceDB: jest.fn(() => ({})),
  },
  roles: {
    getExternalRoleID: jest.fn(() => "pollution_test"),
  },
}))

jest.mock("../../../db/utils", () => ({
  InternalTables: {},
}))

jest.mock("../../../sdk", () => ({
  __esModule: true,
  default: {
    permissions: {
      getAllDBRoles: jest.fn(),
    },
  },
}))

jest.mock("../../../sdk/workspace/permissions", () => ({
  PermissionUpdateType: {},
}))

jest.mock("../../../utilities/security", () => ({
  CURRENTLY_SUPPORTED_LEVELS: ["read", "write", "execute"],
  getBasePermissions: jest.fn(() => ({ read: "base" })),
}))

describe("permission controller", () => {
  const originalGlobal = Object.getOwnPropertyDescriptor(
    Object.prototype,
    "global"
  )

  afterEach(() => {
    if (originalGlobal) {
      Reflect.defineProperty(Object.prototype, "global", originalGlobal)
    } else {
      Reflect.deleteProperty(Object.prototype, "global")
    }
    jest.restoreAllMocks()
  })

  it("does not pollute the prototype when a role has a reserved resource name", async () => {
    const role: Role = {
      _id: "role_pollution_test",
      name: "pollution test",
      version: "name",
      permissionId: BuiltinPermissionID.WRITE,
      permissions: JSON.parse('{"__proto__":["global"]}'),
    }
    jest.mocked(sdk.permissions.getAllDBRoles).mockResolvedValue([role])

    const ctx = {} as UserCtx<void, FetchResourcePermissionInfoResponse>
    await fetch(ctx)

    expect(Object.getOwnPropertyDescriptor(Object.prototype, "global")).toEqual(
      originalGlobal
    )
    expect(Object.prototype.hasOwnProperty.call(ctx.body, "__proto__")).toBe(
      true
    )
    expect(ctx.body["__proto__"].read).toBe("base")
    expect(ctx.body["__proto__"].global).toBe("pollution_test")
  })
})
