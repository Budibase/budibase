const {
  createApplication,
  createTable,
  supertest,
  defaultHeaders,
  addPermission,
} = require("./couchTestUtils")
const { BUILTIN_ROLE_IDS } = require("../../../utilities/security/roles")

const STD_ROLE_ID = BUILTIN_ROLE_IDS.PUBLIC

describe("/permission", () => {
  let server
  let request
  let appId
  let table
  let perms

  beforeAll(async () => {
    ;({ request, server } = await supertest())
  })

  afterAll(() => {
    server.close()
  })

  beforeEach(async () => {
    let app = await createApplication(request)
    appId = app.instance._id
    table = await createTable(request, appId)
    perms = await addPermission(request, appId, STD_ROLE_ID, table._id)
  })

  describe("levels", () => {
    it("should be able to get levels", async () => {
      const res = await request
        .get(`/api/permission/levels`)
        .set(defaultHeaders(appId))
        .expect("Content-Type", /json/)
        .expect(200)
      expect(res.body).toBeDefined()
      expect(res.body.length).toEqual(2)
      expect(res.body).toContain("read")
      expect(res.body).toContain("write")
    })
  })

  describe("test", () => {
    it("should be able to add permission to a role for the table", async () => {
      expect(perms.length).toEqual(1)
      expect(perms[0]._id).toEqual(`${STD_ROLE_ID}`)
    })

    it("should get the resource permissions", async () => {
      const res = await request
        .get(`/api/permission/${table._id}`)
        .set(defaultHeaders(appId))
        .expect("Content-Type", /json/)
        .expect(200)
    })
  })
})
