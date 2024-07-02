import { Screen } from "@budibase/types"
import TestConfiguration from "../../../tests/utilities/TestConfiguration"
import { structures } from "./utilities"
import { checkBuilderEndpoint, runInProd } from "./utilities/TestFunctions"
import { roles } from "@budibase/backend-core"

const { BUILTIN_ROLE_IDS } = roles
const { basicScreen, powerScreen } = structures
const route = "/test"

// there are checks which are disabled in test env,
// these checks need to be enabled for this test

describe("/routing", () => {
  const config = new TestConfiguration()
  let basic: Screen, power: Screen

  beforeAll(async () => {
    await config.init()
    basic = await config.createScreen(basicScreen(route))
    power = await config.createScreen(powerScreen(route))
    await config.publish()
  })

  afterAll(() => {
    config.end()
  })

  describe("fetch", () => {
    it("prevents a public user from accessing development app", async () => {
      await runInProd(() => {
        return config
          .request!.get(`/api/routing/client`)
          .set(config.publicHeaders({ prodApp: false }))
          .expect(302)
      })
    })

    it("prevents a non builder from accessing development app", async () => {
      await runInProd(async () => {
        return config
          .request!.get(`/api/routing/client`)
          .set(
            await config.roleHeaders({
              roleId: BUILTIN_ROLE_IDS.BASIC,
              prodApp: false,
            })
          )
          .expect(302)
      })
    })
    it("returns the correct routing for basic user", async () => {
      const res = await config
        .request!.get(`/api/routing/client`)
        .set(
          await config.roleHeaders({
            roleId: BUILTIN_ROLE_IDS.BASIC,
          })
        )
        .expect("Content-Type", /json/)
        .expect(200)
      expect(res.body.routes).toBeDefined()
      expect(res.body.routes[route]).toEqual({
        subpaths: {
          [route]: {
            screenId: basic._id,
            roleId: basic.routing.roleId,
          },
        },
      })
    })

    it("returns the correct routing for power user", async () => {
      const res = await config
        .request!.get(`/api/routing/client`)
        .set(
          await config.roleHeaders({
            roleId: BUILTIN_ROLE_IDS.POWER,
          })
        )
        .expect("Content-Type", /json/)
        .expect(200)
      expect(res.body.routes).toBeDefined()
      expect(res.body.routes[route]).toEqual({
        subpaths: {
          [route]: {
            screenId: power._id,
            roleId: power.routing.roleId,
          },
        },
      })
    })
  })

  describe("fetch all", () => {
    it("should fetch all routes for builder", async () => {
      const res = await config
        .request!.get(`/api/routing`)
        .set(
          await config.roleHeaders({
            roleId: BUILTIN_ROLE_IDS.POWER,
            builder: true,
          })
        )
        .expect(200)
        .expect("Content-Type", /json/)
      expect(res.body.routes).toBeDefined()
      expect(res.body.routes[route].subpaths[route]).toBeDefined()
      const subpath = res.body.routes[route].subpaths[route]
      expect(subpath.screens[power.routing.roleId]).toEqual(power._id)
      expect(subpath.screens[basic.routing.roleId]).toEqual(basic._id)
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
