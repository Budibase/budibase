const { 
  createApplication,
  createTable,
  createView,
  supertest,
  defaultHeaders
} = require("./couchTestUtils")
const {
  generateAdminPermissions,
  generatePowerUserPermissions,
  POWERUSER_LEVEL_ID,
  ADMIN_LEVEL_ID,
  READ_TABLE,
  WRITE_TABLE,
} = require("../../../utilities/accessLevels")

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
        .send({ name: "user", permissions: [ { itemId: table._id, name: READ_TABLE }] })
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

      const adminLevel = res.body.find(r => r._id === ADMIN_LEVEL_ID)
      expect(adminLevel).toBeDefined()
      expect(adminLevel.permissions).toEqual(await generateAdminPermissions(appId))

      const powerUserLevel = res.body.find(r => r._id === POWERUSER_LEVEL_ID)
      expect(powerUserLevel).toBeDefined()
      expect(powerUserLevel.permissions).toEqual(await generatePowerUserPermissions(appId))

      const customLevelFetched = res.body.find(r => r._id === customLevel._id)
      expect(customLevelFetched.permissions).toEqual(customLevel.permissions)
    })
    
  });

  describe("destroy", () => {
    it("should delete custom access level", async () => {
      const createRes = await request
        .post(`/api/accesslevels`)
        .send({ name: "user", permissions: [ { itemId: table._id, name: READ_TABLE } ] })
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
        .send({ name: "user", permissions: [ { itemId: table._id, name: READ_TABLE }] })
        .set(defaultHeaders(appId))
        .expect('Content-Type', /json/)
        .expect(200)

      const customLevel = createRes.body

      await request
        .patch(`/api/accesslevels/${customLevel._id}`)
        .send({
          _rev: customLevel._rev,
          addedPermissions:  [ { itemId: table._id, name: WRITE_TABLE } ] 
        })
        .set(defaultHeaders(appId))
        .expect('Content-Type', /json/)
        .expect(200)

      const finalRes = await request
        .get(`/api/accesslevels/${customLevel._id}`)
        .set(defaultHeaders(appId))
        .expect(200) 

      expect(finalRes.body.permissions.length).toBe(2)
      expect(finalRes.body.permissions.some(p => p.name === WRITE_TABLE)).toBe(true)
      expect(finalRes.body.permissions.some(p => p.name === READ_TABLE)).toBe(true)
    })

    it("should remove given permissions", async () => {
      const createRes = await request
        .post(`/api/accesslevels`)
        .send({ 
          name: "user", 
          permissions: [ 
            { itemId: table._id, name: READ_TABLE },
            { itemId: table._id, name: WRITE_TABLE },
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
          removedPermissions:  [ { itemId: table._id, name: WRITE_TABLE }] 
        })
        .set(defaultHeaders(appId))
        .expect('Content-Type', /json/)
        .expect(200)

      const finalRes = await request
        .get(`/api/accesslevels/${customLevel._id}`)
        .set(defaultHeaders(appId))
        .expect(200) 

      expect(finalRes.body.permissions.length).toBe(1)
      expect(finalRes.body.permissions.some(p => p.name === READ_TABLE)).toBe(true)
    })
  })
});
