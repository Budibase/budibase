import { roles, events, permissions } from "@budibase/backend-core"
import * as setup from "./utilities"
import { PermissionLevel } from "@budibase/types"

const { basicRole } = setup.structures
const { BUILTIN_ROLE_IDS } = roles
const { BuiltinPermissionID } = permissions

describe("/roles", () => {
  let config = setup.getConfig()

  afterAll(setup.afterAll)

  beforeAll(async () => {
    await config.init()
  })

  describe("create", () => {
    it("returns a success message when role is successfully created", async () => {
      const role = basicRole()
      const res = await config.api.roles.save(role, {
        status: 200,
      })

      expect(res._id).toBeDefined()
      expect(res._rev).toBeDefined()
      expect(events.role.updated).not.toHaveBeenCalled()
      expect(events.role.created).toHaveBeenCalledTimes(1)
      expect(events.role.created).toHaveBeenCalledWith(res)
    })
  })

  describe("update", () => {
    it("updates a role", async () => {
      const role = basicRole()
      let res = await config.api.roles.save(role, {
        status: 200,
      })
      jest.clearAllMocks()
      res = await config.api.roles.save(res, {
        status: 200,
      })

      expect(res._id).toBeDefined()
      expect(res._rev).toBeDefined()
      expect(events.role.created).not.toHaveBeenCalled()
      expect(events.role.updated).toHaveBeenCalledTimes(1)
      expect(events.role.updated).toHaveBeenCalledWith(res)
    })
  })

  describe("fetch", () => {
    beforeAll(async () => {
      // Recreate the app
      await config.init()
    })

    it("should list custom roles, plus 2 default roles", async () => {
      const customRole = await config.createRole()

      const res = await config.api.roles.fetch({
        status: 200,
      })

      expect(res.length).toBe(5)

      const adminRole = res.find(r => r._id === BUILTIN_ROLE_IDS.ADMIN)
      expect(adminRole).toBeDefined()
      expect(adminRole!.inherits).toEqual(BUILTIN_ROLE_IDS.POWER)
      expect(adminRole!.permissionId).toEqual(BuiltinPermissionID.ADMIN)

      const powerUserRole = res.find(r => r._id === BUILTIN_ROLE_IDS.POWER)
      expect(powerUserRole).toBeDefined()
      expect(powerUserRole!.inherits).toEqual(BUILTIN_ROLE_IDS.BASIC)
      expect(powerUserRole!.permissionId).toEqual(BuiltinPermissionID.POWER)

      const customRoleFetched = res.find(r => r._id === customRole.name)
      expect(customRoleFetched).toBeDefined()
      expect(customRoleFetched!.inherits).toEqual(BUILTIN_ROLE_IDS.BASIC)
      expect(customRoleFetched!.permissionId).toEqual(
        BuiltinPermissionID.READ_ONLY
      )
    })

    it("should be able to get the role with a permission added", async () => {
      const table = await config.createTable()
      await config.api.permission.add({
        roleId: BUILTIN_ROLE_IDS.POWER,
        resourceId: table._id!,
        level: PermissionLevel.READ,
      })
      const res = await config.api.roles.fetch()
      expect(res.length).toBeGreaterThan(0)
      const power = res.find(role => role._id === BUILTIN_ROLE_IDS.POWER)
      expect(power?.permissions[table._id!]).toEqual(["read"])
    })
  })

  describe("destroy", () => {
    it("should delete custom roles", async () => {
      const customRole = await config.createRole({
        name: "user",
        permissionId: BuiltinPermissionID.READ_ONLY,
        inherits: BUILTIN_ROLE_IDS.BASIC,
      })
      await config.api.roles.destroy(customRole, {
        status: 200,
      })
      await config.api.roles.find(customRole._id!, {
        status: 404,
      })
      expect(events.role.deleted).toHaveBeenCalledTimes(1)
      expect(events.role.deleted).toHaveBeenCalledWith(customRole)
    })
  })

  describe("accessible", () => {
    it("should be able to fetch accessible roles (with builder)", async () => {
      const res = await config.api.roles.accessible(config.defaultHeaders(), {
        status: 200,
      })
      expect(res.length).toBe(5)
      expect(typeof res[0]).toBe("string")
    })

    it("should be able to fetch accessible roles (basic user)", async () => {
      const headers = await config.basicRoleHeaders()
      const res = await config.api.roles.accessible(headers, {
        status: 200,
      })
      expect(res.length).toBe(2)
      expect(res[0]).toBe("BASIC")
      expect(res[1]).toBe("PUBLIC")
    })

    it("should be able to fetch accessible roles (no user)", async () => {
      const res = await config.api.roles.accessible(config.publicHeaders(), {
        status: 200,
      })
      expect(res.length).toBe(1)
      expect(res[0]).toBe("PUBLIC")
    })

    it("should not fetch higher level accessible roles when a custom role header is provided", async () => {
      const customRoleName = "custom_role_1"
      await config.api.roles.save({
        name: customRoleName,
        inherits: roles.BUILTIN_ROLE_IDS.BASIC,
        permissionId: permissions.BuiltinPermissionID.READ_ONLY,
        version: "name",
      })
      const res = await config.api.roles.accessible(
        { "x-budibase-role": customRoleName },
        {
          status: 200,
        }
      )
      expect(res.length).toBe(3)
      expect(res[0]).toBe(customRoleName)
      expect(res[1]).toBe("BASIC")
      expect(res[2]).toBe("PUBLIC")
    })
  })

  describe("accessible - multi-inheritance", () => {
    it("should list access correctly for multi-inheritance role", async () => {
      const role1 = "multi_role_1",
        role2 = "multi_role_2",
        role3 = "multi_role_3"
      const { _id: roleId1 } = await config.api.roles.save({
        name: role1,
        inherits: roles.BUILTIN_ROLE_IDS.BASIC,
        permissionId: permissions.BuiltinPermissionID.WRITE,
        version: "name",
      })
      const { _id: roleId2 } = await config.api.roles.save({
        name: role2,
        inherits: roles.BUILTIN_ROLE_IDS.POWER,
        permissionId: permissions.BuiltinPermissionID.POWER,
        version: "name",
      })
      await config.api.roles.save({
        name: role3,
        inherits: role1,
        permissionId: permissions.BuiltinPermissionID.READ_ONLY,
        version: "name",
      })
      const headers = await config.roleHeaders({
        roleId: role3,
      })
      const res = await config.api.roles.accessible(headers, {
        status: 200,
      })
      expect(res.length).toBe(4)
    })
  })
})
