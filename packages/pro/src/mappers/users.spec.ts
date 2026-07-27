import { ScimCreateUserRequest, User, UserStatus } from "@budibase/types"
import { fromScimUser, toScimUserResponse } from "./users"

const ENTERPRISE_USER_EXTENSION =
  "urn:ietf:params:scim:schemas:extension:enterprise:2.0:User"

const baseUser = (): User => ({
  _id: "user-123",
  tenantId: "tenant-123",
  email: "user@example.com",
  roles: {},
  status: UserStatus.ACTIVE,
  createdAt: Date.now(),
  updatedAt: new Date().toISOString(),
})

describe("SCIM user mapper", () => {
  it("defaults to empty roles for new SCIM users", () => {
    const scimUser: ScimCreateUserRequest = {
      schemas: ["urn:ietf:params:scim:schemas:core:2.0:User"],
      active: true,
      userName: "user@example.com",
      emails: [{ value: "user@example.com", type: "work", primary: true }],
      meta: { resourceType: "User" },
      roles: [],
    }

    const user = fromScimUser(scimUser)

    expect(user.roles).toEqual({})
  })

  it("preserves provided roles when mapping an existing SCIM user", () => {
    const scimUser: ScimCreateUserRequest = {
      schemas: ["urn:ietf:params:scim:schemas:core:2.0:User"],
      active: true,
      userName: "user@example.com",
      emails: [{ value: "user@example.com", type: "work", primary: true }],
      meta: { resourceType: "User" },
      roles: [],
    }

    const user = fromScimUser(scimUser, { app_scim: "BASIC" })

    expect(user.roles).toEqual({ app_scim: "BASIC" })
  })

  it("wraps string manager id returned from AD into an object", () => {
    const user: User = {
      ...baseUser(),
      scimInfo: {
        isSync: true,
        [ENTERPRISE_USER_EXTENSION]: {
          manager: "manager-123",
        },
      },
    }

    const response = toScimUserResponse(user)

    expect(response[ENTERPRISE_USER_EXTENSION]?.manager).toEqual({
      value: "manager-123",
    })
  })

  it("leaves manager object untouched", () => {
    const user: User = {
      ...baseUser(),
      scimInfo: {
        isSync: true,
        [ENTERPRISE_USER_EXTENSION]: {
          manager: {
            value: "manager-456",
            displayName: "Jane Manager",
          },
        },
      },
    }

    const response = toScimUserResponse(user)

    expect(response[ENTERPRISE_USER_EXTENSION]?.manager).toEqual({
      value: "manager-456",
      displayName: "Jane Manager",
    })
  })
})
