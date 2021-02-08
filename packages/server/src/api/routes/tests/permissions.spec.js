const {
  createApplication,
  createTable,
  supertest,
  defaultHeaders,
} = require("./couchTestUtils")
const { BUILTIN_ROLE_IDS } = require("../../../utilities/security/roles")

const STD_ROLE_ID = BUILTIN_ROLE_IDS.BASIC

describe("/permission", () => {
  let server
  let request
  let appId
  let table

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

  describe("add", () => {
    it("should be able to add permission to a role for the table", async () => {
      const res = await request
        .post(`/api/permission/${STD_ROLE_ID}/${table._id}/read`)
        .set(defaultHeaders(appId))
        .expect("Content-Type", /json/)
        .expect(200)
    })
  })
})
