const { 
  createApplication,
  createTable,
  createView,
  supertest,
  defaultHeaders
} = require("./couchTestUtils")
const {
  BUILTIN_LEVELS,
} = require("../../../utilities/security/accessLevels")
const { BUILTIN_PERMISSION_NAMES } = require("../../../utilities/security/permissions")

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
        .send({ name: "user" })
        .set(defaultHeaders(appId))
        .expect('Content-Type', /json/)
        .expect(200)

      expect(res.res.statusMessage).toEqual("Access Level 'user' created successfully.")
      expect(res.body._id).toBeDefined()
      expect(res.body._rev).toBeDefined()
      expect(res.body.permissions).toEqual([])
    })

  });

  describe("fetch", () => {

    it("should list custom levels, plus 2 default levels", async () => {
      const createRes = await request
        .post(`/api/accesslevels`)
        .send({ name: "user", permissions: [BUILTIN_PERMISSION_NAMES.READ_ONLY] })
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

      const adminLevel = res.body.find(r => r._id === BUILTIN_LEVELS.admin._id)
      expect(adminLevel).toBeDefined()
      expect(adminLevel.permissions).toEqual([BUILTIN_PERMISSION_NAMES.ADMIN])

      const powerUserLevel = res.body.find(r => r._id === BUILTIN_LEVELS.power._id)
      expect(powerUserLevel).toBeDefined()
      expect(powerUserLevel.permissions).toEqual([BUILTIN_PERMISSION_NAMES.POWER])

      const customLevelFetched = res.body.find(r => r._id === customLevel._id)
      expect(customLevelFetched.permissions).toEqual([BUILTIN_PERMISSION_NAMES.READ_ONLY])
    })
    
  });

  describe("destroy", () => {
    it("should delete custom access level", async () => {
      const createRes = await request
        .post(`/api/accesslevels`)
        .send({ name: "user", permissions: [BUILTIN_PERMISSION_NAMES.READ_ONLY] })
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

  describe("patch", () => {
    it("should add given permissions", async () => {
      const createRes = await request
        .post(`/api/accesslevels`)
        .send({ name: "user", permissions: [BUILTIN_PERMISSION_NAMES.READ_ONLY] })
        .set(defaultHeaders(appId))
        .expect('Content-Type', /json/)
        .expect(200)

      const customLevel = createRes.body

      await request
        .patch(`/api/accesslevels/${customLevel._id}`)
        .send({
          _rev: customLevel._rev,
          addedPermissions:  [ BUILTIN_PERMISSION_NAMES.WRITE ]
        })
        .set(defaultHeaders(appId))
        .expect('Content-Type', /json/)
        .expect(200)

      const finalRes = await request
        .get(`/api/accesslevels/${customLevel._id}`)
        .set(defaultHeaders(appId))
        .expect(200) 

      expect(finalRes.body.permissions.length).toBe(2)
      expect(finalRes.body.permissions.indexOf(BUILTIN_PERMISSION_NAMES.WRITE)).not.toBe(-1)
      expect(finalRes.body.permissions.indexOf(BUILTIN_PERMISSION_NAMES.READ_ONLY)).not.toBe(-1)
    })

    it("should remove given permissions", async () => {
      const createRes = await request
        .post(`/api/accesslevels`)
        .send({ 
          name: "user", 
          permissions: [
            BUILTIN_PERMISSION_NAMES.READ_ONLY,
            BUILTIN_PERMISSION_NAMES.WRITE,
          ] 
        })
        .set(defaultHeaders(appId))
        .expect('Content-Type', /json/)
        .expect(200)

      const customLevel = createRes.body

      await request
        .patch(`/api/accesslevels/${customLevel._id}`)
        .send({
          _rev: customLevel._rev,
          removedPermissions:  [BUILTIN_PERMISSION_NAMES.WRITE]
        })
        .set(defaultHeaders(appId))
        .expect('Content-Type', /json/)
        .expect(200)

      const finalRes = await request
        .get(`/api/accesslevels/${customLevel._id}`)
        .set(defaultHeaders(appId))
        .expect(200) 

      expect(finalRes.body.permissions.length).toBe(1)
      expect(finalRes.body.permissions.indexOf(BUILTIN_PERMISSION_NAMES.READ_ONLY)).not.toBe(-1)
    })
  })
});
