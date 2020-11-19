const { 
  createApplication,
  createTable,
  createView,
  supertest,
  defaultHeaders
} = require("./couchTestUtils")
const {
  BUILTIN_LEVEL_IDS,
} = require("../../../utilities/security/accessLevels")

const accessLevelBody = { name: "user", inherits: BUILTIN_LEVEL_IDS.BASIC }

describe("/accesslevels", () => {
  let server
  let request
  let appId
  let table
  let view

  beforeAll(async () => {
    ({ request, server } = await supertest())
  });

  afterAll(() => {
    server.close()
  })

  beforeEach(async () => {
    let app = await createApplication(request)
    appId = app.instance._id
    table = await createTable(request, appId)
    view = await createView(request, appId, table._id)
  })

  describe("create", () => {

    it("returns a success message when level is successfully created", async () => {
      const res = await request
        .post(`/api/accesslevels`)
        .send(accessLevelBody)
        .set(defaultHeaders(appId))
        .expect('Content-Type', /json/)
        .expect(200)

      expect(res.res.statusMessage).toEqual("Access Level 'user' created successfully.")
      expect(res.body._id).toBeDefined()
      expect(res.body._rev).toBeDefined()
    })

  });

  describe("fetch", () => {

    it("should list custom levels, plus 2 default levels", async () => {
      const createRes = await request
        .post(`/api/accesslevels`)
        .send(accessLevelBody)
        .set(defaultHeaders(appId))
        .expect('Content-Type', /json/)
        .expect(200)

      const customLevel = createRes.body

      const res = await request
        .get(`/api/accesslevels`)
        .set(defaultHeaders(appId))
        .expect('Content-Type', /json/)
        .expect(200)

      expect(res.body.length).toBe(3)

      const adminLevel = res.body.find(r => r._id === BUILTIN_LEVEL_IDS.ADMIN)
      expect(adminLevel.inherits).toEqual(BUILTIN_LEVEL_IDS.POWER)
      expect(adminLevel).toBeDefined()

      const powerUserLevel = res.body.find(r => r._id === BUILTIN_LEVEL_IDS.POWER)
      expect(powerUserLevel.inherits).toEqual(BUILTIN_LEVEL_IDS.BASIC)
      expect(powerUserLevel).toBeDefined()

      const customLevelFetched = res.body.find(r => r._id === customLevel._id)
      expect(customLevelFetched.inherits).toEqual(BUILTIN_LEVEL_IDS.BASIC)
      expect(customLevelFetched).toBeDefined()
    })
    
  });

  describe("destroy", () => {
    it("should delete custom access level", async () => {
      const createRes = await request
        .post(`/api/accesslevels`)
        .send({ name: "user" })
        .set(defaultHeaders(appId))
        .expect('Content-Type', /json/)
        .expect(200)

      const customLevel = createRes.body

      await request
        .delete(`/api/accesslevels/${customLevel._id}/${customLevel._rev}`)
        .set(defaultHeaders(appId))
        .expect(200)

      await request
        .get(`/api/accesslevels/${customLevel._id}`)
        .set(defaultHeaders(appId))
        .expect(404)
    })
  })
});
