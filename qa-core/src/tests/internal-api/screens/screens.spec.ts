import TestConfiguration from "../../../config/internal-api/TestConfiguration"
import { App } from "@budibase/types"
import InternalAPIClient from "../../../config/internal-api/TestConfiguration/InternalAPIClient"
import generateApp from "../../../config/internal-api/fixtures/applications"
import { Screen } from  "@budibase/types"
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
    const [appResponse, app] = await appConfig.applications.create(generateApp())
    expect(appResponse).toHaveStatusCode(200)
    expect(app._id).toBeDefined()
    
    // Create Screen
    const roleArray = ["BASIC", "POWER", "ADMIN", "PUBLIC"]
    appConfig.applications.api.appId = app.appId
    for (let i = 0; i < 4; i++) {
      const [response, screen] = await config.screen.createScreen(generateScreen(roleArray[i]))
      expect(response).toHaveStatusCode(200)
      expect(screen.routing.roleId).toEqual(roleArray[i])
    }
  })

  it("GET - Fetch screens", async () => {
    // Create app
    const [appResponse, app] = await appConfig.applications.create(generateApp())
    expect(appResponse).toHaveStatusCode(200)
    expect(app._id).toBeDefined()
    
    // Create Screen
    appConfig.applications.api.appId = app.appId
    const [response, screen] = await config.screen.createScreen(generateScreen("BASIC"))
    expect(response).toHaveStatusCode(200)

    // Check screen exists
    const [routesResponse, routes] = await appConfig.applications.getRoutes()
    expect(routesResponse).toHaveStatusCode(200)
    expect(routes.routes["/test"]).toBeTruthy()
  })

  it("DELETE - Delete a screen", async () => {
    // Create app
    const [appResponse, app] = await appConfig.applications.create(generateApp())
    expect(appResponse).toHaveStatusCode(200)
    expect(app._id).toBeDefined()
    
    // Create Screen
    appConfig.applications.api.appId = app.appId
    const [screenResponse, screen] = await config.screen.createScreen(generateScreen("BASIC"))
    expect(screenResponse).toHaveStatusCode(200)
    expect(screen._id).toBeDefined()

    // Delete Screen
    const [response] = await config.screen.deleteScreen(screen._id, screen._rev)
    expect(response).toHaveStatusCode(200)
  })
})
