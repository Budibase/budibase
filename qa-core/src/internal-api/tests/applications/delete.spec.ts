import TestConfiguration from "../../config/TestConfiguration"

describe("Internal API - Application creation, update, publish and delete", () => {
  const config = new TestConfiguration()

  beforeAll(async () => {
    await config.beforeAll()
  })

  afterAll(async () => {
    await config.afterAll()
  })

  it("DELETE - Delete an application", async () => {
    const app = await config.createApp()

    await config.api.apps.delete(app.appId!)
  })
})
