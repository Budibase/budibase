const { BUILTIN_ROLE_IDS } = require("../../../utilities/security/roles")
const setup = require("./utilities")
const { basicRow } = require("./utilities/structures")

const HIGHER_ROLE_ID = BUILTIN_ROLE_IDS.BASIC
const STD_ROLE_ID = BUILTIN_ROLE_IDS.PUBLIC

describe("/permission", () => {
  let request = setup.getRequest()
  let config = setup.getConfig()
  let table
  let perms
  let row

  afterAll(setup.afterAll)

  beforeEach(async () => {
    await config.init()
    table = await config.createTable()
    row = await config.createRow()
    perms = await config.addPermission(STD_ROLE_ID, table._id)
  })

  async function getTablePermissions() {
    return request
      .get(`/api/permission/${table._id}`)
      .set(config.defaultHeaders())
      .expect("Content-Type", /json/)
      .expect(200)
  }

  describe("levels", () => {
    it("should be able to get levels", async () => {
      const res = await request
        .get(`/api/permission/levels`)
        .set(config.defaultHeaders())
        .expect("Content-Type", /json/)
        .expect(200)
      expect(res.body).toBeDefined()
      expect(res.body.length).toEqual(2)
      expect(res.body).toContain("read")
      expect(res.body).toContain("write")
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
      perms = await config.addPermission(HIGHER_ROLE_ID, table._id, "write")
      const res = await getTablePermissions()
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
  })

  describe("remove", () => {
    it("should be able to remove the permission", async () => {
      const res = await request
        .delete(`/api/permission/${STD_ROLE_ID}/${table._id}/read`)
        .set(config.defaultHeaders())
        .expect("Content-Type", /json/)
        .expect(200)
      expect(res.body[0]._id).toEqual(STD_ROLE_ID)
      const permsRes = await getTablePermissions()
      expect(permsRes.body[STD_ROLE_ID]).toBeUndefined()
    })
  })

  describe("check public user allowed", () => {
    it("should be able to read the row", async () => {
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
})
