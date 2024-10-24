import { checkForRoleInheritanceLoops } from "../roles"
import { BuiltinPermissionID, Role } from "@budibase/types"

/**
 * This unit test exists as this utility will be used in the frontend and backend, confirmation
 * of its API and expected results is useful since the backend tests won't confirm it works
 * exactly as the frontend needs it to - easy to add specific test cases here that the frontend
 * might need to check/cover.
 */

interface TestRole extends Omit<Role, "_id"> {
  _id: string
}

let allRoles: TestRole[] = []

function role(id: string, inherits: string | string[]): TestRole {
  const role = {
    _id: id,
    inherits: inherits,
    name: "ROLE",
    permissionId: BuiltinPermissionID.WRITE,
    permissions: {}, // not needed for this test
  }
  allRoles.push(role)
  return role
}

describe("role utilities", () => {
  let role1: TestRole, role2: TestRole

  beforeEach(() => {
    role1 = role("role_1", [])
    role2 = role("role_2", [role1._id])
  })

  afterEach(() => {
    allRoles = []
  })

  function check(hasLoop: boolean) {
    const result = checkForRoleInheritanceLoops(allRoles)
    expect(result).toBe(hasLoop)
  }

  describe("checkForRoleInheritanceLoops", () => {
    it("should confirm no loops", () => {
      check(false)
    })

    it("should confirm there is a loop", () => {
      const role3 = role("role_3", [role2._id])
      const role4 = role("role_4", [role3._id, role2._id, role1._id])
      role3.inherits = [
        ...(Array.isArray(role3.inherits) ? role3.inherits : []),
        role4._id,
      ]
      check(true)
    })

    it("should handle new and old inherits structure", () => {
      const role1 = role("role_role_1", "role_1")
      role("role_role_2", ["role_1"])
      role1.inherits = "role_2"
      check(true)
    })

    it("self reference contains loop", () => {
      role("role1", "role1")
      check(true)
    })
  })
})
