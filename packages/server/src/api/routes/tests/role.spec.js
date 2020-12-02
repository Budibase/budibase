const { 
  createApplication,
  createTable,
  createView,
  supertest,
  defaultHeaders
} = require("./couchTestUtils")
const {
  BUILTIN_ROLE_IDS,
} = require("../../../utilities/security/roles")
const { BUILTIN_PERMISSION_IDS } = require("../../../utilities/security/permissions")

const roleBody = { name: "NewRole", inherits: BUILTIN_ROLE_IDS.BASIC, permissionId: BUILTIN_PERMISSION_IDS.READ_ONLY }

describe("/roles", () => {
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

    it("returns a success message when role is successfully created", async () => {
      const res = await request
        .post(`/api/roles`)
        .send(roleBody)
        .set(defaultHeaders(appId))
        .expect('Content-Type', /json/)
        .expect(200)

      expect(res.res.statusMessage).toEqual("Role 'NewRole' created successfully.")
      expect(res.body._id).toBeDefined()
      expect(res.body._rev).toBeDefined()
    })

  });

  describe("fetch", () => {

    it("should list custom roles, plus 2 default roles", async () => {
      const createRes = await request
        .post(`/api/roles`)
        .send(roleBody)
        .set(defaultHeaders(appId))
        .expect('Content-Type', /json/)
        .expect(200)

      const customRole = createRes.body

      const res = await request
        .get(`/api/roles`)
        .set(defaultHeaders(appId))
        .expect('Content-Type', /json/)
        .expect(200)

      expect(res.body.length).toBe(3)

      const adminRole = res.body.find(r => r._id === BUILTIN_ROLE_IDS.ADMIN)
      expect(adminRole).toBeDefined()
      expect(adminRole.inherits).toEqual(BUILTIN_ROLE_IDS.POWER)
      expect(adminRole.permissionId).toEqual(BUILTIN_PERMISSION_IDS.ADMIN)

      const powerUserRole = res.body.find(r => r._id === BUILTIN_ROLE_IDS.POWER)
      expect(powerUserRole).toBeDefined()
      expect(powerUserRole.inherits).toEqual(BUILTIN_ROLE_IDS.BASIC)
      expect(powerUserRole.permissionId).toEqual(BUILTIN_PERMISSION_IDS.POWER)

      const customRoleFetched = res.body.find(r => r._id === customRole._id)
      expect(customRoleFetched).toBeDefined()
      expect(customRoleFetched.inherits).toEqual(BUILTIN_ROLE_IDS.BASIC)
      expect(customRoleFetched.permissionId).toEqual(BUILTIN_PERMISSION_IDS.READ_ONLY)
    })
    
  });

  describe("destroy", () => {
    it("should delete custom roles", async () => {
      const createRes = await request
        .post(`/api/roles`)
        .send({ name: "user", permissionId: BUILTIN_PERMISSION_IDS.READ_ONLY })
        .set(defaultHeaders(appId))
        .expect('Content-Type', /json/)
        .expect(200)

      const customRole = createRes.body

      await request
        .delete(`/api/roles/${customRole._id}/${customRole._rev}`)
        .set(defaultHeaders(appId))
        .expect(200)

      await request
        .get(`/api/roles/${customRole._id}`)
        .set(defaultHeaders(appId))
        .expect(404)
    })
  })
});
