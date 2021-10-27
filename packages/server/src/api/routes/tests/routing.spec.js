const setup = require("./utilities")
const { basicScreen } = setup.structures
const { checkBuilderEndpoint } = require("./utilities/TestFunctions")
const { BUILTIN_ROLE_IDS } = require("@budibase/auth/roles")

const route = "/test"

describe("/routing", () => {
  let request = setup.getRequest()
  let config = setup.getConfig()
  let screen, screen2

  afterAll(setup.afterAll)

  beforeEach(async () => {
    await config.init()
    screen = basicScreen()
    screen.routing.route = route
    screen = await config.createScreen(screen)
    screen2 = basicScreen()
    screen2.routing.roleId = BUILTIN_ROLE_IDS.POWER
    screen2.routing.route = route
    screen2 = await config.createScreen(screen2)
    await config.deploy()
  })

  describe("fetch", () => {
    it("prevents a public user from accessing development app", async () => {
      await request
        .get(`/api/routing/client`)
        .set(config.publicHeaders({ prodApp: false }))
        .expect(302)
    })

    it("prevents a non builder from accessing development app", async () => {
      await request
        .get(`/api/routing/client`)
        .set(await config.roleHeaders({
          roleId: BUILTIN_ROLE_IDS.BASIC,
          prodApp: false
        }))
        .expect(302)
    })
    it("returns the correct routing for basic user", async () => {
      const res = await request
        .get(`/api/routing/client`)
        .set(await config.roleHeaders({
          roleId: BUILTIN_ROLE_IDS.BASIC
        }))
        .expect("Content-Type", /json/)
        .expect(200)
      expect(res.body.routes).toBeDefined()
      expect(res.body.routes[route]).toEqual({
        subpaths: {
          [route]: {
            screenId: screen._id,
            roleId: screen.routing.roleId
          }
        }
      })
    })

    it("returns the correct routing for power user", async () => {
      const res = await request
        .get(`/api/routing/client`)
        .set(await config.roleHeaders({
          roleId: BUILTIN_ROLE_IDS.POWER
        }))
        .expect("Content-Type", /json/)
        .expect(200)
      expect(res.body.routes).toBeDefined()
      expect(res.body.routes[route]).toEqual({
        subpaths: {
          [route]: {
            screenId: screen2._id,
            roleId: screen2.routing.roleId
          }
        }
      })
    })
  })

  describe("fetch all", () => {
    it("should fetch all routes for builder", async () => {
      const res = await request
        .get(`/api/routing`)
        .set(await config.roleHeaders({
          roleId: BUILTIN_ROLE_IDS.POWER,
          builder: true,
        }))
        .expect(200)
        .expect("Content-Type", /json/)
      expect(res.body.routes).toBeDefined()
      expect(res.body.routes[route].subpaths[route]).toBeDefined()
      const subpath = res.body.routes[route].subpaths[route]
      expect(subpath.screens[screen2.routing.roleId]).toEqual(screen2._id)
      expect(subpath.screens[screen.routing.roleId]).toEqual(screen._id)
    })

    it("make sure it is a builder only endpoint", async () => {
      await checkBuilderEndpoint({
        config,
        method: "GET",
        url: `/api/routing`,
      })
    })
  })
})