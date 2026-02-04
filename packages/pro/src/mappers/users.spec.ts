import { User, UserStatus } from "@budibase/types"
import { toScimUserResponse } from "./users"

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
