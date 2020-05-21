const { 
  createInstance, 
  createClientDatabase,
  createApplication,
  createModel,
  createView,
  supertest,
  defaultHeaders
} = require("./couchTestUtils")
const {
  generateAdminPermissions,
  generatePowerUserPermissions,
  POWERUSER_LEVEL_ID,
  ADMIN_LEVEL_ID,
  READ_MODEL,
  WRITE_MODEL,
} = require("../../../utilities/accessLevels")

describe("/accesslevels", () => {
  let appId
  let server
  let request
  let instanceId
  let model
  let view

  beforeAll(async () => {
    ({ request, server } = await supertest())
    await createClientDatabase(request);
    appId = (await createApplication(request))._id
  });

  afterAll(async () => {
    server.close();
  })

  beforeEach(async () => {
    instanceId = (await createInstance(request, appId))._id
    model = await createModel(request, instanceId)
    view = await createView(request, instanceId)
  })

  describe("create", () => {

    it("returns a success message when level is successfully created", async () => {
      const res = await request
        .post(`/api/${instanceId}/accesslevels`)
        .send({ name: "user" })
        .set(defaultHeaders)
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
        .post(`/api/${instanceId}/accesslevels`)
        .send({ name: "user", permissions: [ { itemId: model._id, name: READ_MODEL }] })
        .set(defaultHeaders)
        .expect('Content-Type', /json/)
        .expect(200)

      const customLevel = createRes.body

      const res = await request
        .get(`/api/${instanceId}/accesslevels`)
        .set(defaultHeaders)
        .expect('Content-Type', /json/)
        .expect(200)

      expect(res.body.length).toBe(3)

      const adminLevel = res.body.find(r => r._id === ADMIN_LEVEL_ID)
      expect(adminLevel).toBeDefined()
      expect(adminLevel.permissions).toEqual(await generateAdminPermissions(instanceId))

      const powerUserLevel = res.body.find(r => r._id === POWERUSER_LEVEL_ID)
      expect(powerUserLevel).toBeDefined()
      expect(powerUserLevel.permissions).toEqual(await generatePowerUserPermissions(instanceId))

      const customLevelFetched = res.body.find(r => r._id === customLevel._id)
      expect(customLevelFetched.permissions).toEqual(customLevel.permissions)
    })
    
  });

  describe("destroy", () => {
    it("should delete custom access level", async () => {
      const createRes = await request
        .post(`/api/${instanceId}/accesslevels`)
        .send({ name: "user", permissions: [ { itemId: model._id, name: READ_MODEL } ] })
        .set(defaultHeaders)
        .expect('Content-Type', /json/)
        .expect(200)

      const customLevel = createRes.body

      await request
        .delete(`/api/${instanceId}/accesslevels/${customLevel._id}/${customLevel._rev}`)
        .set(defaultHeaders)
        .expect(200)

      await request
        .get(`/api/${instanceId}/accesslevels/${customLevel._id}`)
        .set(defaultHeaders)
        .expect(404)      
    })
  })

  describe("patch", () => {
    it("should add given permissions", async () => {
      const createRes = await request
        .post(`/api/${instanceId}/accesslevels`)
        .send({ name: "user", permissions: [ { itemId: model._id, name: READ_MODEL }] })
        .set(defaultHeaders)
        .expect('Content-Type', /json/)
        .expect(200)

      const customLevel = createRes.body

      await request
        .patch(`/api/${instanceId}/accesslevels/${customLevel._id}`)
        .send({
          _rev: customLevel._rev,
          addedPermissions:  [ { itemId: model._id, name: WRITE_MODEL } ] 
        })
        .set(defaultHeaders)
        .expect('Content-Type', /json/)
        .expect(200)

      const finalRes = await request
        .get(`/api/${instanceId}/accesslevels/${customLevel._id}`)
        .set(defaultHeaders)
        .expect(200) 

      expect(finalRes.body.permissions.length).toBe(2)
      expect(finalRes.body.permissions.some(p => p.name === WRITE_MODEL)).toBe(true)
      expect(finalRes.body.permissions.some(p => p.name === READ_MODEL)).toBe(true)
    })

    it("should remove given permissions", async () => {
      const createRes = await request
        .post(`/api/${instanceId}/accesslevels`)
        .send({ 
          name: "user", 
          permissions: [ 
            { itemId: model._id, name: READ_MODEL },
            { itemId: model._id, name: WRITE_MODEL },
          ] 
        })
        .set(defaultHeaders)
        .expect('Content-Type', /json/)
        .expect(200)

      const customLevel = createRes.body

      await request
        .patch(`/api/${instanceId}/accesslevels/${customLevel._id}`)
        .send({
          _rev: customLevel._rev,
          removedPermissions:  [ { itemId: model._id, name: WRITE_MODEL }] 
        })
        .set(defaultHeaders)
        .expect('Content-Type', /json/)
        .expect(200)

      const finalRes = await request
        .get(`/api/${instanceId}/accesslevels/${customLevel._id}`)
        .set(defaultHeaders)
        .expect(200) 

      expect(finalRes.body.permissions.length).toBe(1)
      expect(finalRes.body.permissions.some(p => p.name === READ_MODEL)).toBe(true)
    })
  })
});
