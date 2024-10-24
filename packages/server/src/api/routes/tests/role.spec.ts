import { roles, events, db as dbCore } from "@budibase/backend-core"
import * as setup from "./utilities"
import { PermissionLevel, BuiltinPermissionID } from "@budibase/types"

const { basicRole } = setup.structures
const { BUILTIN_ROLE_IDS } = roles

const LOOP_ERROR = "Role inheritance contains a loop, this is not supported"

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
      expect(events.role.created).toHaveBeenCalledWith({
        ...res,
        _id: dbCore.prefixRoleID(res._id!),
      })
    })

    it("handle a role with invalid inherits", async () => {
      const role = basicRole()
      role.inherits = ["not_real", "some_other_not_real"]

      const res = await config.api.roles.save(role, {
        status: 200,
      })
      expect(res.inherits).toEqual([BUILTIN_ROLE_IDS.BASIC])
    })

    it("handle a role with no inherits", async () => {
      const role = basicRole()
      role.inherits = []

      const res = await config.api.roles.save(role, {
        status: 200,
      })
      expect(res.inherits).toEqual([BUILTIN_ROLE_IDS.BASIC])
    })

    it("save role without permissionId", async () => {
      const res = await config.api.roles.save(
        {
          ...basicRole(),
          permissionId: undefined,
        },
        {
          status: 200,
        }
      )
      expect(res.permissionId).toEqual(PermissionLevel.WRITE)
    })
  })

  describe("update", () => {
    beforeEach(async () => {
      // Recreate the app
      await config.init()
    })

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
      expect(events.role.updated).toHaveBeenCalledWith({
        ...res,
        _id: dbCore.prefixRoleID(res._id!),
      })
    })

    it("disallow loops", async () => {
      const role1 = await config.api.roles.save(basicRole(), {
        status: 200,
      })
      const role2 = await config.api.roles.save(
        {
          ...basicRole(),
          inherits: [role1._id!],
        },
        {
          status: 200,
        }
      )
      await config.api.roles.save(
        {
          ...role1,
          inherits: [role2._id!],
        },
        { status: 400, body: { message: LOOP_ERROR } }
      )
    })

    it("disallow more complex loops", async () => {
      let role1 = await config.api.roles.save({
        ...basicRole(),
        name: "role1",
        inherits: [BUILTIN_ROLE_IDS.POWER],
      })
      let role2 = await config.api.roles.save({
        ...basicRole(),
        name: "role2",
        inherits: [BUILTIN_ROLE_IDS.POWER, role1._id!],
      })
      let role3 = await config.api.roles.save({
        ...basicRole(),
        name: "role3",
        inherits: [BUILTIN_ROLE_IDS.POWER, role1._id!, role2._id!],
      })
      // go back to role1
      await config.api.roles.save(
        {
          ...role1,
          inherits: [BUILTIN_ROLE_IDS.POWER, role2._id!, role3._id!],
        },
        { status: 400, body: { message: LOOP_ERROR } }
      )
      // go back to role2
      await config.api.roles.save(
        {
          ...role2,
          inherits: [BUILTIN_ROLE_IDS.POWER, role1._id!, role3._id!],
        },
        { status: 400, body: { message: LOOP_ERROR } }
      )
    })

    it("frontend example - should deny", async () => {
      const id1 = "cb27c4ec9415042f4800411adb346fb7c",
        id2 = "cbc72a9d61ab64d49b31d90d1df4c1fdb"
      const role1 = await config.api.roles.save({
        _id: id1,
        name: id1,
        permissions: {},
        permissionId: BuiltinPermissionID.WRITE,
        version: "name",
        inherits: ["POWER"],
      })
      await config.api.roles.save({
        _id: id2,
        permissions: {},
        name: id2,
        permissionId: BuiltinPermissionID.WRITE,
        version: "name",
        inherits: [id1],
      })
      await config.api.roles.save(
        {
          ...role1,
          inherits: [BUILTIN_ROLE_IDS.POWER, id2],
        },
        { status: 400, body: { message: LOOP_ERROR } }
      )
    })

    it("handle updating a role, without its inherits", async () => {
      const res = await config.api.roles.save({
        ...basicRole(),
        inherits: [BUILTIN_ROLE_IDS.ADMIN],
      })
      // remove the roles so that it will default back to DB roles, then save again
      const updatedRes = await config.api.roles.save({
        ...res,
        inherits: undefined,
      })
      expect(updatedRes.inherits).toEqual([BUILTIN_ROLE_IDS.ADMIN])
    })

    it("handle updating a role, without its permissionId", async () => {
      const res = await config.api.roles.save({
        ...basicRole(),
        permissionId: BuiltinPermissionID.READ_ONLY,
      })
      // permission ID can be removed during update
      const updatedRes = await config.api.roles.save({
        ...res,
        permissionId: undefined,
      })
      expect(updatedRes.permissionId).toEqual(BuiltinPermissionID.READ_ONLY)
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
      expect(customRoleFetched!.permissionId).toEqual(BuiltinPermissionID.WRITE)
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
      expect(events.role.deleted).toHaveBeenCalledWith({
        ...customRole,
        _id: dbCore.prefixRoleID(customRole._id!),
      })
    })

    it("should disconnection roles when deleted", async () => {
      const role1 = await config.api.roles.save({
        name: "role1",
        permissionId: BuiltinPermissionID.WRITE,
        inherits: [BUILTIN_ROLE_IDS.BASIC],
      })
      const role2 = await config.api.roles.save({
        name: "role2",
        permissionId: BuiltinPermissionID.WRITE,
        inherits: [BUILTIN_ROLE_IDS.BASIC, role1._id!],
      })
      const role3 = await config.api.roles.save({
        name: "role3",
        permissionId: BuiltinPermissionID.WRITE,
        inherits: [BUILTIN_ROLE_IDS.BASIC, role2._id!],
      })
      await config.api.roles.destroy(role2, { status: 200 })
      const found = await config.api.roles.find(role3._id!, { status: 200 })
      expect(found.inherits).toEqual([BUILTIN_ROLE_IDS.BASIC])
    })
  })

  describe("accessible", () => {
    beforeAll(async () => {
      // new app, reset roles
      await config.init()
      // create one custom role
      await config.createRole()
    })

    it("should be able to fetch accessible roles (with builder)", async () => {
      await config.withHeaders(config.defaultHeaders(), async () => {
        const res = await config.api.roles.accessible({
          status: 200,
        })
        expect(res.length).toBe(5)
        expect(typeof res[0]).toBe("string")
      })
    })

    it("should be able to fetch accessible roles (basic user)", async () => {
      const headers = await config.basicRoleHeaders()
      await config.withHeaders(headers, async () => {
        const res = await config.api.roles.accessible({
          status: 200,
        })
        expect(res.length).toBe(2)
        expect(res[0]).toBe("BASIC")
        expect(res[1]).toBe("PUBLIC")
      })
    })

    it("should be able to fetch accessible roles (no user)", async () => {
      await config.withHeaders(config.publicHeaders(), async () => {
        const res = await config.api.roles.accessible({
          status: 200,
        })
        expect(res.length).toBe(1)
        expect(res[0]).toBe("PUBLIC")
      })
    })

    it("should not fetch higher level accessible roles when a custom role header is provided", async () => {
      const customRoleName = "custom_role_1"
      await config.api.roles.save({
        name: customRoleName,
        inherits: roles.BUILTIN_ROLE_IDS.BASIC,
        permissionId: BuiltinPermissionID.READ_ONLY,
        version: "name",
      })
      await config.withHeaders(
        { "x-budibase-role": customRoleName },
        async () => {
          const res = await config.api.roles.accessible({
            status: 200,
          })
          expect(res).toEqual([customRoleName, "BASIC", "PUBLIC"])
        }
      )
    })

    it("should fetch preview role correctly even without basic specified", async () => {
      const role = await config.api.roles.save(basicRole())
      // have to forcefully delete the inherits from DB - technically can't
      // happen anymore - but good test case
      await dbCore.getDB(config.appId!).put({
        ...role,
        _id: dbCore.prefixRoleID(role._id!),
        inherits: [],
      })
      await config.withHeaders({ "x-budibase-role": role.name }, async () => {
        const res = await config.api.roles.accessible({
          status: 200,
        })
        expect(res).toEqual([role.name])
      })
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
        permissionId: BuiltinPermissionID.WRITE,
        version: "name",
      })
      const { _id: roleId2 } = await config.api.roles.save({
        name: role2,
        inherits: roles.BUILTIN_ROLE_IDS.POWER,
        permissionId: BuiltinPermissionID.POWER,
        version: "name",
      })
      await config.api.roles.save({
        name: role3,
        inherits: [roleId1!, roleId2!],
        permissionId: BuiltinPermissionID.READ_ONLY,
        version: "name",
      })
      const headers = await config.roleHeaders({
        roleId: role3,
      })
      await config.withHeaders(headers, async () => {
        const res = await config.api.roles.accessible({
          status: 200,
        })
        expect(res).toEqual([role3, role1, "BASIC", "PUBLIC", role2, "POWER"])
      })
    })
  })
})
