import { assign, unAssign } from "../../../src/sdk/publicApi/roles"
import { db as userDB } from "../../../src/sdk/users"
import { isExpandedPublicApiEnabled } from "../../../src/sdk/features"
import type { User } from "@budibase/types"

type Mocked<T> = jest.Mocked<T>

jest.mock("@budibase/backend-core", () => ({
  db: {
    getProdWorkspaceID: jest.fn((appId: string) => `prod-${appId}`),
  },
}))

jest.mock("../../../src/sdk/features", () => ({
  isExpandedPublicApiEnabled: jest.fn(),
}))

jest.mock("../../../src/sdk/users", () => ({
  db: {
    bulkGet: jest.fn(),
    bulkUpdate: jest.fn(),
  },
}))

const mockedUserDB = userDB as Mocked<typeof userDB>
const mockedFeatureCheck = isExpandedPublicApiEnabled as jest.MockedFunction<
  typeof isExpandedPublicApiEnabled
>

const createUser = (id: string, overrides: Partial<User> = {}): User => ({
  _id: id,
  tenantId: "tenant",
  email: `${id}@example.com`,
  roles: {},
  ...overrides,
})

describe("roles public API assignments", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockedFeatureCheck.mockResolvedValue(true)
  })

  it("assign updates role, builder apps, and admin on every user", async () => {
    const users: User[] = [
      createUser("user-a", {
        builder: {
          apps: ["prod-existing"],
        },
      }),
      createUser("user-b", {
        roles: { "prod-app-1": "old-role" },
        builder: undefined,
      }),
    ]
    mockedUserDB.bulkGet.mockResolvedValue(users)

    await assign(["user-a", "user-b"], {
      role: {
        appId: "app-1",
        roleId: "role-123",
      },
      appBuilder: {
        appId: "builder-app",
      },
      admin: true,
    })

    expect(mockedUserDB.bulkGet).toHaveBeenCalledWith(["user-a", "user-b"])
    expect(mockedUserDB.bulkUpdate).toHaveBeenCalledWith([
      createUser("user-a", {
        roles: {
          "prod-app-1": "role-123",
        },
        builder: {
          apps: ["prod-existing", "prod-builder-app"],
        },
        admin: {
          global: true,
        },
      }),
      createUser("user-b", {
        roles: {
          "prod-app-1": "role-123",
        },
        builder: {
          apps: ["prod-builder-app"],
        },
        admin: {
          global: true,
        },
      }),
    ])
  })

  it("unAssign removes the provided role and permissions only when present", async () => {
    const users: User[] = [
      createUser("user-a", {
        roles: {
          "prod-app-1": "role-123",
        },
        builder: {
          apps: ["prod-app-keep", "prod-builder-app"],
          global: true,
        },
        admin: {
          global: true,
        },
      }),
      createUser("user-b", {
        roles: {
          "prod-app-1": "different-role",
        },
        builder: {
          apps: ["prod-app-keep", "prod-builder-app"],
        },
      }),
    ]
    mockedUserDB.bulkGet.mockResolvedValue(users)

    await unAssign(["user-a", "user-b"], {
      role: {
        appId: "app-1",
        roleId: "role-123",
      },
      appBuilder: {
        appId: "builder-app",
      },
      admin: true,
    })

    expect(mockedUserDB.bulkGet).toHaveBeenCalledWith(["user-a", "user-b"])
    expect(mockedUserDB.bulkUpdate).toHaveBeenCalledWith([
      createUser("user-a", {
        roles: {},
        builder: {
          apps: ["prod-app-keep"],
          global: true,
        },
      }),
      createUser("user-b", {
        roles: {
          "prod-app-1": "different-role",
        },
        builder: {
          apps: ["prod-app-keep"],
        },
      }),
    ])

    const [updatedUsers] = mockedUserDB.bulkUpdate.mock.calls[0] as [User[]]
    expect(updatedUsers[0].admin).toBeUndefined()
    expect(updatedUsers[1].admin).toBeUndefined()
  })
})
