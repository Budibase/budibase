import TestConfiguration from "../../../config/internal-api/TestConfiguration"
import { App } from "@budibase/types"
import InternalAPIClient from "../../../config/internal-api/TestConfiguration/InternalAPIClient"
import generateApp from "../../../config/internal-api/fixtures/applications"
import { Screen } from "@budibase/types"
import generateScreen from "../../../config/internal-api/fixtures/screens"

describe("Internal API - /screens endpoints", () => {
  const api = new InternalAPIClient()
  const config = new TestConfiguration<Screen>(api)
  const appConfig = new TestConfiguration<App>(api)

  beforeAll(async () => {
    await config.beforeAll()
  })

  afterAll(async () => {
    await config.afterAll()
  })

  it("POST - Create a screen with each role type", async () => {
    // Create app
    const app = await appConfig.applications.create(generateApp())

    // Create Screen
    const roleArray = ["BASIC", "POWER", "ADMIN", "PUBLIC"]
    appConfig.applications.api.appId = app.appId
    for (let role in roleArray) {
      const [response, screen] = await config.screen.create(
        generateScreen(roleArray[role])
      )
      expect(response).toHaveStatusCode(200)
      expect(screen.routing.roleId).toEqual(roleArray[role])
    }
  })

  it("GET - Fetch screens", async () => {
    // Create app
    const app = await appConfig.applications.create(generateApp())

    // Create Screen
    appConfig.applications.api.appId = app.appId
    const [response, screen] = await config.screen.create(
      generateScreen("BASIC")
    )

    // Check screen exists
    const [routesResponse, routes] = await appConfig.applications.getRoutes()
    expect(routesResponse).toHaveStatusCode(200)
    expect(routes.routes["/test"]).toBeTruthy()
  })

  it("DELETE - Delete a screen", async () => {
    // Create app
    const app = await appConfig.applications.create(generateApp())

    // Create Screen
    appConfig.applications.api.appId = app.appId
    const [screenResponse, screen] = await config.screen.create(
      generateScreen("BASIC")
    )

    // Delete Screen
    const [response] = await config.screen.delete(screen._id!, screen._rev!)
    expect(response).toHaveStatusCode(200)
  })
})
