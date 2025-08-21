import * as setup from "./utilities"
import { checkBuilderEndpoint, runInProd } from "./utilities/TestFunctions"
import { roles } from "@budibase/backend-core"
import { Screen } from "@budibase/types"
import { structures } from "@budibase/backend-core/tests"

const { BUILTIN_ROLE_IDS } = roles
const { basicScreen, powerScreen } = setup.structures
const route = "/test"

// there are checks which are disabled in test env,
// these checks need to be enabled for this test

describe("/routing", () => {
  let config = setup.getConfig()
  let basic: Screen, power: Screen

  afterAll(setup.afterAll)

  beforeAll(async () => {
    await config.init()
    basic = await config.createScreen(basicScreen(route))
    power = await config.createScreen(powerScreen(route))
    await config.publish()
  })

  describe("fetch", () => {
    it("prevents a public user from accessing development app", async () => {
      await config.withHeaders(
        {
          ...config.publicHeaders({ prodApp: false }),
          "User-Agent": config.browserUserAgent(),
        },
        async () => {
          await runInProd(() => {
            return config.api.routing.client({ status: 302 })
          })
        }
      )
    })

    it("prevents a non builder from accessing development app", async () => {
      await config.withHeaders(
        {
          ...(await config.roleHeaders({
            roleId: BUILTIN_ROLE_IDS.BASIC,
            prodApp: false,
          })),
          "User-Agent": config.browserUserAgent(),
        },
        async () => {
          await runInProd(() => {
            return config.api.routing.client({ status: 302 })
          })
        }
      )
    })

    it("returns the correct routing for basic user", async () => {
      await config.withHeaders(
        await config.roleHeaders({
          roleId: BUILTIN_ROLE_IDS.BASIC,
        }),
        async () => {
          const res = await config.api.routing.client({
            status: 200,
          })
          expect(res.routes).toBeDefined()
          expect(res.routes[route]).toEqual({
            subpaths: {
              [route]: {
                screenId: basic._id,
                roleId: basic.routing.roleId,
              },
            },
          })
        }
      )
    })

    it("returns the correct routing for power user", async () => {
      await config.withHeaders(
        await config.roleHeaders({
          roleId: BUILTIN_ROLE_IDS.POWER,
        }),
        async () => {
          const res = await config.api.routing.client({
            status: 200,
          })
          expect(res.routes).toBeDefined()
          expect(res.routes[route]).toEqual({
            subpaths: {
              [route]: {
                screenId: power._id,
                roleId: power.routing.roleId,
              },
            },
          })
        }
      )
    })

    it("shouldn't return screens if workspace app disabled", async () => {
      const { workspaceApp } = await config.api.workspaceApp.create(
        structures.workspaceApps.createRequest({
          name: "Test Workspace App",
          url: "/testapp",
          disabled: true,
        })
      )
      await config.api.screen.save({
        ...basicScreen("/disabled"),
        workspaceAppId: workspaceApp._id!,
      })
      await config.withHeaders(
        await config.roleHeaders({
          roleId: BUILTIN_ROLE_IDS.BASIC,
        }),
        async () => {
          const res = await config.api.routing.client({ status: 200 })
          expect(res.routes["/disabled"]).toBeUndefined()
        }
      )
    })
  })

  describe("fetch all", () => {
    it("should fetch all routes for builder", async () => {
      await config.withHeaders(
        await config.roleHeaders({
          roleId: BUILTIN_ROLE_IDS.POWER,
          builder: true,
        }),
        async () => {
          const res = await config.api.routing.fetchAll({
            status: 200,
          })
          expect(res.routes).toBeDefined()
          expect(res.routes[route].subpaths[route]).toBeDefined()
          const subpath = res.routes[route].subpaths[route]
          expect(subpath.screens[power.routing.roleId]).toEqual(power._id)
          expect(subpath.screens[basic.routing.roleId]).toEqual(basic._id)
        }
      )
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
