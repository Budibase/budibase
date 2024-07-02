import { roles, events, permissions } from "@budibase/backend-core"
import { structures } from "./utilities"
import { PermissionLevel } from "@budibase/types"
import TestConfiguration from "../../../tests/utilities/TestConfiguration"

const { basicRole } = structures
const { BUILTIN_ROLE_IDS } = roles
const { BuiltinPermissionID } = permissions

describe("/roles", () => {
  const config = new TestConfiguration()

  beforeAll(async () => {
    await config.init()
  })

  afterAll(() => {
    config.end()
  })

  const createRole = async (config, role) => {
    if (!role) {
      role = basicRole()
    }

    return config
      .request!.post(`/api/roles`)
      .send(role)
      .set(config.defaultHeaders())
      .expect("Content-Type", /json/)
      .expect(200)
  }

  describe("create", () => {
    it("returns a success message when role is successfully created", async () => {
      const role = basicRole()
      const res = await createRole(config, role)

      expect(res.body._id).toBeDefined()
      expect(res.body._rev).toBeDefined()
      expect(events.role.updated).not.toHaveBeenCalled()
      expect(events.role.created).toHaveBeenCalledTimes(1)
      expect(events.role.created).toHaveBeenCalledWith(res.body)
    })
  })

  describe("update", () => {
    it("updates a role", async () => {
      const role = basicRole()
      let res = await createRole(config, role)
      jest.clearAllMocks()
      res = await createRole(config, res.body)

      expect(res.body._id).toBeDefined()
      expect(res.body._rev).toBeDefined()
      expect(events.role.created).not.toHaveBeenCalled()
      expect(events.role.updated).toHaveBeenCalledTimes(1)
      expect(events.role.updated).toHaveBeenCalledWith(res.body)
    })
  })

  describe("fetch", () => {
    const config = new TestConfiguration()

    beforeAll(async () => {
      // Recreate the app
      await config.init()
    })

    afterAll(() => {
      config.end()
    })

    it("should list custom roles, plus 2 default roles", async () => {
      const customRole = await config.createRole()

      const res = await config
        .request!.get(`/api/roles`)
        .set(config.defaultHeaders())
        .expect("Content-Type", /json/)
        .expect(200)

      expect(res.body.length).toBe(5)

      const adminRole = res.body.find(r => r._id === BUILTIN_ROLE_IDS.ADMIN)
      expect(adminRole).toBeDefined()
      expect(adminRole.inherits).toEqual(BUILTIN_ROLE_IDS.POWER)
      expect(adminRole.permissionId).toEqual(BuiltinPermissionID.ADMIN)

      const powerUserRole = res.body.find(r => r._id === BUILTIN_ROLE_IDS.POWER)
      expect(powerUserRole).toBeDefined()
      expect(powerUserRole.inherits).toEqual(BUILTIN_ROLE_IDS.BASIC)
      expect(powerUserRole.permissionId).toEqual(BuiltinPermissionID.POWER)

      const customRoleFetched = res.body.find(r => r._id === customRole.name)
      expect(customRoleFetched).toBeDefined()
      expect(customRoleFetched.inherits).toEqual(BUILTIN_ROLE_IDS.BASIC)
      expect(customRoleFetched.permissionId).toEqual(
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
      const res = await config
        .request!.get(`/api/roles`)
        .set(config.defaultHeaders())
        .expect("Content-Type", /json/)
        .expect(200)
      expect(res.body.length).toBeGreaterThan(0)
      const power = res.body.find(role => role._id === BUILTIN_ROLE_IDS.POWER)
      expect(power.permissions[table._id!]).toEqual(["read"])
    })
  })

  describe("destroy", () => {
    it("should delete custom roles", async () => {
      const customRole = await config.createRole({
        name: "user",
        permissionId: BuiltinPermissionID.READ_ONLY,
        inherits: BUILTIN_ROLE_IDS.BASIC,
      })
      delete (customRole as any)._rev_tree
      await config
        .request!.delete(`/api/roles/${customRole._id}/${customRole._rev}`)
        .set(config.defaultHeaders())
        .expect(200)
      await config
        .request!.get(`/api/roles/${customRole._id}`)
        .set(config.defaultHeaders())
        .expect(404)
      expect(events.role.deleted).toHaveBeenCalledTimes(1)
      expect(events.role.deleted).toHaveBeenCalledWith(customRole)
    })
  })

  describe("accessible", () => {
    const config = new TestConfiguration()

    beforeAll(async () => {
      // Recreate the app
      await config.init()
    })

    afterAll(() => {
      config.end()
    })

    it("should be able to fetch accessible roles (with builder)", async () => {
      const res = await config
        .request!.get("/api/roles/accessible")
        .set(config.defaultHeaders())
        .expect(200)
      expect(res.body).toEqual(["ADMIN", "POWER", "BASIC", "PUBLIC"])
    })

    it("should be able to fetch accessible roles (basic user)", async () => {
      const res = await config
        .request!.get("/api/roles/accessible")
        .set(await config.basicRoleHeaders())
        .expect(200)
      expect(res.body).toEqual(["BASIC", "PUBLIC"])
    })

    it("should be able to fetch accessible roles (no user)", async () => {
      const res = await config
        .request!.get("/api/roles/accessible")
        .set(config.publicHeaders())
        .expect(200)
      expect(res.body).toEqual(["PUBLIC"])
    })

    it("should not fetch higher level accessible roles when a custom role header is provided", async () => {
      await createRole(config, {
        name: `CUSTOM_ROLE`,
        inherits: roles.BUILTIN_ROLE_IDS.BASIC,
        permissionId: permissions.BuiltinPermissionID.READ_ONLY,
        version: "name",
      })
      const res = await config
        .request!.get("/api/roles/accessible")
        .set({
          ...config.defaultHeaders(),
          "x-budibase-role": "CUSTOM_ROLE",
        })
        .expect(200)
      expect(res.body).toEqual(["CUSTOM_ROLE", "BASIC", "PUBLIC"])
    })
  })
})
