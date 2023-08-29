const mockedSdk = sdk.permissions as jest.Mocked<typeof sdk.permissions>
jest.mock("../../../sdk/app/permissions", () => ({
  resourceActionAllowed: jest.fn(),
}))

import sdk from "../../../sdk"

import { roles } from "@budibase/backend-core"
import {
  Document,
  DocumentType,
  PermissionLevel,
  Row,
  Table,
} from "@budibase/types"
import * as setup from "./utilities"

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

  afterAll(setup.afterAll)

  beforeAll(async () => {
    await config.init()
  })

  beforeEach(async () => {
    mockedSdk.resourceActionAllowed.mockResolvedValue({ allowed: true })

    table = (await config.createTable()) as typeof table
    row = await config.createRow()
    perms = await config.api.permission.set({
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
      expect(res.body["read"]).toEqual(STD_ROLE_ID)
      expect(res.body["write"]).toEqual(HIGHER_ROLE_ID)
    })

    it("should get resource permissions with multiple roles", async () => {
      perms = await config.api.permission.set({
        roleId: HIGHER_ROLE_ID,
        resourceId: table._id,
        level: PermissionLevel.WRITE,
      })
      const res = await config.api.permission.get(table._id)
      expect(res.body["read"]).toEqual(STD_ROLE_ID)
      expect(res.body["write"]).toEqual(HIGHER_ROLE_ID)
      const allRes = await request
        .get(`/api/permission`)
        .set(config.defaultHeaders())
        .expect("Content-Type", /json/)
        .expect(200)
      expect(allRes.body[table._id]["write"]).toEqual(HIGHER_ROLE_ID)
      expect(allRes.body[table._id]["read"]).toEqual(STD_ROLE_ID)
    })

    it("throw forbidden if the action is not allowed for the resource", async () => {
      mockedSdk.resourceActionAllowed.mockResolvedValue({
        allowed: false,
        resourceType: DocumentType.DATASOURCE,
        level: PermissionLevel.READ,
      })

      const response = await config.api.permission.set(
        {
          roleId: STD_ROLE_ID,
          resourceId: table._id,
          level: PermissionLevel.EXECUTE,
        },
        { expectStatus: 403 }
      )
      expect(response.message).toEqual(
        "You are not allowed to 'read' the resource type 'datasource'"
      )
    })
  })

  describe("remove", () => {
    it("should be able to remove the permission", async () => {
      const res = await config.api.permission.revoke({
        roleId: STD_ROLE_ID,
        resourceId: table._id,
        level: PermissionLevel.READ,
      })
      expect(res.body[0]._id).toEqual(STD_ROLE_ID)
      const permsRes = await config.api.permission.get(table._id)
      expect(permsRes.body[STD_ROLE_ID]).toBeUndefined()
    })

    it("throw forbidden if the action is not allowed for the resource", async () => {
      mockedSdk.resourceActionAllowed.mockResolvedValue({
        allowed: false,
        resourceType: DocumentType.DATASOURCE,
        level: PermissionLevel.READ,
      })

      const response = await config.api.permission.revoke(
        {
          roleId: STD_ROLE_ID,
          resourceId: table._id,
          level: PermissionLevel.EXECUTE,
        },
        { expectStatus: 403 }
      )
      expect(response.body.message).toEqual(
        "You are not allowed to 'read' the resource type 'datasource'"
      )
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

    it("shouldn't allow writing from a public user", async () => {
      const res = await request
        .post(`/api/${table._id}/rows`)
        .send(basicRow(table._id))
        .set(config.publicHeaders())
        .expect("Content-Type", /json/)
        .expect(403)
      expect(res.status).toEqual(403)
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
})
