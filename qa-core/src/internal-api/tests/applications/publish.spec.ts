import TestConfiguration from "../../config/TestConfiguration"
import { db } from "@budibase/backend-core"
import * as fixtures from "../../fixtures"

describe("Internal API - Application creation, update, publish and delete", () => {
  const config = new TestConfiguration()

  beforeAll(async () => {
    await config.beforeAll()
  })

  afterAll(async () => {
    await config.afterAll()
  })

  it("Publish app", async () => {
    // create the app
    const app = await config.createApp(fixtures.apps.appFromTemplate())

    // check preview renders
    await config.api.apps.canRender()

    // publish app
    await config.api.apps.publish(app.appId)

    // check published app renders
    config.state.appId = db.getProdAppID(app.appId!)
    await config.api.apps.canRender()

    // unpublish app
    await config.api.apps.unpublish(app.appId!)
  })

  it("Sync application before deployment", async () => {
    const app = await config.createApp()

    const [syncResponse, sync] = await config.api.apps.sync(app.appId!)
    expect(sync).toEqual({
      message: "App sync completed successfully.",
    })
  })

  it("Sync application after deployment", async () => {
    const app = await config.createApp()

    // publish app
    await config.api.apps.publish(app._id)

    const [syncResponse, sync] = await config.api.apps.sync(app.appId!)
    expect(sync).toEqual({
      message: "App sync completed successfully.",
    })
  })
})
