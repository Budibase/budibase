import { roles } from "@budibase/backend-core"
import { Document, PermissionLevel, Row, Table, ViewV2 } from "@budibase/types"
import * as setup from "./utilities"
import { generator, mocks } from "@budibase/backend-core/tests"

const { basicRow } = setup.structures
const { BUILTIN_ROLE_IDS } = roles

const HIGHER_ROLE_ID = BUILTIN_ROLE_IDS.BASIC
const STD_ROLE_ID = BUILTIN_ROLE_IDS.PUBLIC

describe("/permission", () => {
  let request = setup.getRequest()
  let config = setup.getConfig()
  let table: Table & { _id: string }
  let perms: Document[]
  let row: Row
  let view: ViewV2

  afterAll(setup.afterAll)

  beforeAll(async () => {
    await config.init()
  })

  beforeEach(async () => {
    mocks.licenses.useCloudFree()

    table = (await config.createTable()) as typeof table
    row = await config.createRow()
    view = await config.api.viewV2.create({
      tableId: table._id!,
      name: generator.guid(),
    })
    perms = await config.api.permission.add({
      roleId: STD_ROLE_ID,
      resourceId: table._id,
      level: PermissionLevel.READ,
    })
  })

  describe("levels", () => {
    it("should be able to get levels", async () => {
      const res = await request
        .get(`/api/permission/levels`)
        .set(config.defaultHeaders())
        .expect("Content-Type", /json/)
        .expect(200)
      expect(res.body).toBeDefined()
      expect(res.body.length).toEqual(3)
      expect(res.body).toContain("read")
      expect(res.body).toContain("write")
      expect(res.body).toContain("execute")
    })
  })

  describe("add", () => {
    it("should be able to add permission to a role for the table", async () => {
      expect(perms.length).toEqual(1)
      expect(perms[0]._id).toEqual(`${STD_ROLE_ID}`)
    })

    it("should get the resource permissions", async () => {
      const res = await request
        .get(`/api/permission/${table._id}`)
        .set(config.defaultHeaders())
        .expect("Content-Type", /json/)
        .expect(200)
      expect(res.body).toEqual({
        permissions: {
          read: { permissionType: "EXPLICIT", role: STD_ROLE_ID },
          write: { permissionType: "BASE", role: HIGHER_ROLE_ID },
        },
      })
    })

    it("should get resource permissions with multiple roles", async () => {
      perms = await config.api.permission.add({
        roleId: HIGHER_ROLE_ID,
        resourceId: table._id,
        level: PermissionLevel.WRITE,
      })
      const res = await config.api.permission.get(table._id)
      expect(res).toEqual({
        permissions: {
          read: { permissionType: "EXPLICIT", role: STD_ROLE_ID },
          write: { permissionType: "EXPLICIT", role: HIGHER_ROLE_ID },
        },
      })

      const allRes = await request
        .get(`/api/permission`)
        .set(config.defaultHeaders())
        .expect("Content-Type", /json/)
        .expect(200)
      expect(allRes.body[table._id]["read"]).toEqual(STD_ROLE_ID)
      expect(allRes.body[table._id]["write"]).toEqual(HIGHER_ROLE_ID)
    })
  })

  describe("remove", () => {
    it("should be able to remove the permission", async () => {
      const res = await config.api.permission.revoke({
        roleId: STD_ROLE_ID,
        resourceId: table._id,
        level: PermissionLevel.READ,
      })
      expect(res[0]._id).toEqual(STD_ROLE_ID)
      const permsRes = await config.api.permission.get(table._id)
      expect(permsRes.permissions[STD_ROLE_ID]).toBeUndefined()
    })
  })

  describe("check public user allowed", () => {
    it("should be able to read the row", async () => {
      // replicate changes before checking permissions
      await config.publish()

      const res = await request
        .get(`/api/${table._id}/rows`)
        .set(config.publicHeaders())
        .expect("Content-Type", /json/)
        .expect(200)
      expect(res.body[0]._id).toEqual(row._id)
    })

    it("should be able to access the view data when the table is set to public and with no view permissions overrides", async () => {
      // Make view inherit table permissions. Needed for backwards compatibility with existing views.
      await config.api.permission.revoke({
        roleId: STD_ROLE_ID,
        resourceId: view.id,
        level: PermissionLevel.READ,
      })

      // replicate changes before checking permissions
      await config.publish()

      const res = await config.api.viewV2.publicSearch(view.id)
      expect(res.rows[0]._id).toEqual(row._id)
    })

    it("should not be able to access the view data when the table is not public and there are no view permissions overrides", async () => {
      await config.api.permission.revoke({
        roleId: STD_ROLE_ID,
        resourceId: table._id,
        level: PermissionLevel.READ,
      })

      // Make view inherit table permissions. Needed for backwards compatibility with existing views.
      await config.api.permission.revoke({
        roleId: STD_ROLE_ID,
        resourceId: view.id,
        level: PermissionLevel.READ,
      })

      // replicate changes before checking permissions
      await config.publish()

      await config.api.viewV2.publicSearch(view.id, undefined, { status: 401 })
    })

    it("should use the view permissions", async () => {
      await config.api.permission.add({
        roleId: STD_ROLE_ID,
        resourceId: view.id,
        level: PermissionLevel.READ,
      })
      await config.api.permission.revoke({
        roleId: STD_ROLE_ID,
        resourceId: table._id,
        level: PermissionLevel.READ,
      })
      // replicate changes before checking permissions
      await config.publish()

      const res = await config.api.viewV2.publicSearch(view.id)
      expect(res.rows[0]._id).toEqual(row._id)
    })

    it("shouldn't allow writing from a public user", async () => {
      const res = await request
        .post(`/api/${table._id}/rows`)
        .send(basicRow(table._id))
        .set(config.publicHeaders())
        .expect("Content-Type", /json/)
        .expect(401)
      expect(res.status).toEqual(401)
    })
  })

  describe("fetch builtins", () => {
    it("should be able to fetch builtin definitions", async () => {
      const res = await request
        .get(`/api/permission/builtin`)
        .set(config.defaultHeaders())
        .expect("Content-Type", /json/)
        .expect(200)
      expect(Array.isArray(res.body)).toEqual(true)
      const publicPerm = res.body.find(
        (perm: Document) => perm._id === "public"
      )
      expect(publicPerm).toBeDefined()
      expect(publicPerm.permissions).toBeDefined()
      expect(publicPerm.name).toBeDefined()
    })
  })

  describe("default permissions", () => {
    it("legacy views", async () => {
      const legacyView = await config.createLegacyView()

      const res = await config.api.permission.get(legacyView.name)

      expect(res).toEqual({
        permissions: {
          read: {
            permissionType: "BASE",
            role: "BASIC",
          },
        },
      })
    })
  })
})
