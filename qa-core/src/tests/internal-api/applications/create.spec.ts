import TestConfiguration from "../../../config/internal-api/TestConfiguration"
import { Application } from "@budibase/server/api/controllers/public/mapping/types"
import InternalAPIClient from "../../../config/internal-api/TestConfiguration/InternalAPIClient"

describe("Internal API - /applications endpoints", () => {
  const api = new InternalAPIClient()
  const config = new TestConfiguration<Application>(api)

  beforeAll(async () => {
    await config.beforeAll()
    await config.auth.login()
  })

  afterAll(async () => {
    await config.afterAll()
  })

  // it("POST - Can login", async () => {
  //   // const [response] = await config.auth.login()
  //   expect(response).toHaveStatusCode(200)
  // })

  it("POST - Create an application", async () => {
    const [response, app] = await config.applications.create({
      name: "abc123",
      url: "/foo",
      useTemplate: false
    })
    expect(response).toHaveStatusCode(200)
    expect(app._id).toBeDefined()
  })

  it("POST - Create an application with template", async () => {
    const [response, app] = await config.applications.create({
      name: "abc123",
      url: "/foo",
      useTemplate: true,
      templateName: "Car Rental Admin Panel",
      templateKey: "app/car-rental-admin-panel",
      templateFile: undefined
    })
    const canRender = await config.applications.canRender(app._id)

    expect(canRender).toBe(true)
    expect(response).toHaveStatusCode(200)
    expect(app._id).toBeDefined()
  })
})
