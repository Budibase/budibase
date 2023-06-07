import { db as dbCore } from "@budibase/backend-core"
import { TestConfiguration } from "../../config"
import { Application } from "../../../types"
import * as fixtures from "../../fixtures"

describe("Public API - /applications endpoints", () => {
  const config = new TestConfiguration<Application>()

  beforeAll(async () => {
    await config.beforeAll()
    await config.createApp()
    config.context = (await config.api.apps.read(config.state.appId!))[1]
  })

  afterAll(async () => {
    await config.afterAll()
  })

  it("POST - Create an application", async () => {
    const [response, app] = await config.api.apps.create(
      fixtures.apps.generateApp()
    )
    expect(response).toHaveStatusCode(200)
    expect(app._id).toBeDefined()
  })

  it("POST - Search applications", async () => {
    const [response, apps] = await config.api.apps.search({
      name: config.context.name,
    })
    expect(response).toHaveStatusCode(200)
    expect(apps[0]).toEqual(config.context)
  })

  it("GET - Retrieve an application", async () => {
    const [response, app] = await config.api.apps.read(config.context._id)
    expect(response).toHaveStatusCode(200)
    expect(app).toEqual(config.context)
  })

  it("PUT - update an application", async () => {
    config.context.name = "UpdatedName"
    const [response, app] = await config.api.apps.update(
      config.context._id,
      config.context
    )
    expect(response).toHaveStatusCode(200)
    expect(app.updatedAt).not.toEqual(config.context.updatedAt)
    expect(app.name).toEqual(config.context.name)
  })

  it("POST - publish an application", async () => {
    config.context.name = "UpdatedName"
    const [response, deployment] = await config.api.apps.publish(
      config.context._id
    )
    expect(response).toHaveStatusCode(200)
    expect(deployment).toEqual({
      status: "SUCCESS",
    })

    // Verify publish
    const prodAppId = dbCore.getProdAppID(config.context._id)
    const [_, publishedApp] = await config.api.apps.read(prodAppId)
    expect(response).toHaveStatusCode(200)
    expect(publishedApp._id).toEqual(prodAppId)
  })

  it("POST - unpublish a published application", async () => {
    await config.api.apps.publish(config.context._id)
    const [response] = await config.api.apps.unpublish(config.context._id)
    expect(response).toHaveStatusCode(204)
  })

  it("POST - unpublish an unpublished application", async () => {
    const [response] = await config.api.apps.unpublish(config.context._id)
    expect(response).toHaveStatusCode(400)
  })

  it("DELETE - delete a published application and the dev application", async () => {
    await config.api.apps.publish(config.context._id)
    const [response, deletion] = await config.api.apps.delete(
      config.context._id
    )
    expect(response).toHaveStatusCode(200)
    expect(deletion._id).toEqual(config.context._id)

    // verify dev app deleted
    const [devAppResponse] = await config.api.apps.read(config.context._id)
    expect(devAppResponse).toHaveStatusCode(404)

    // verify prod app deleted
    const prodAppId = dbCore.getProdAppID(config.context._id)
    const [publishedAppResponse] = await config.api.apps.read(prodAppId)
    expect(publishedAppResponse).toHaveStatusCode(404)
  })
})
