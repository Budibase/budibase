import TestConfiguration from "../../../config/internal-api/TestConfiguration"
import { Application } from "@budibase/server/api/controllers/public/mapping/types"
import { db } from "@budibase/backend-core"
import InternalAPIClient from "../../../config/internal-api/TestConfiguration/InternalAPIClient"
import AccountsAPIClient from "../../../config/internal-api/TestConfiguration/accountsAPIClient"
import {
  generateApp,
  appFromTemplate,
} from "../../../config/internal-api/fixtures/applications"
import generator from "../../../config/generator"
import generateScreen from "../../../config/internal-api/fixtures/screens"

describe("Internal API - Application creation, update, publish and delete", () => {
  const api = new InternalAPIClient()
  const accountsAPI = new AccountsAPIClient()
  const config = new TestConfiguration<Application>(api, accountsAPI)

  beforeAll(async () => {
    await config.setupAccountAndTenant()
  })

  afterAll(async () => {
    await config.afterAll()
  })

  it("Publish app", async () => {
    // create the app
    const app = await config.applications.create(appFromTemplate())
    config.applications.api.appId = app.appId

    // check preview renders
    await config.applications.canRender()

    // publish app
    await config.applications.publish(<string>app.appId)

    // check published app renders
    config.applications.api.appId = db.getProdAppID(app.appId!)
    await config.applications.canRender()

    // unpublish app
    await config.applications.unpublish(<string>app.appId)
  })

  it("Sync application before deployment", async () => {
    const app = await config.applications.create(generateApp())
    config.applications.api.appId = app.appId

    const [syncResponse, sync] = await config.applications.sync(
      <string>app.appId
    )
    expect(sync).toEqual({
      message: "App sync not required, app not deployed.",
    })
  })

  it("Sync application after deployment", async () => {
    const app = await config.applications.create(generateApp())
    config.applications.api.appId = app.appId

    // publish app
    await config.applications.publish(<string>app._id)

    const [syncResponse, sync] = await config.applications.sync(
      <string>app.appId
    )
    expect(sync).toEqual({
      message: "App sync completed successfully.",
    })
  })
})
