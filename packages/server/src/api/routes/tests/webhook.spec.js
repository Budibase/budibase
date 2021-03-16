const setup = require("./utilities")
const { checkBuilderEndpoint } = require("./utilities/TestFunctions")
const { basicWebhook, basicAutomation } = setup.structures

describe("/webhooks", () => {
  let request = setup.getRequest()
  let config = setup.getConfig()
  let webhook

  afterAll(setup.afterAll)

  beforeEach(async () => {
    await config.init()
    const autoConfig = basicAutomation()
    autoConfig.definition.trigger = {
      schema: { outputs: { properties: {} } },
      inputs: {},
    }
    await config.createAutomation(autoConfig)
    webhook = await config.createWebhook()
  })

  describe("create", () => {
    it("should create a webhook successfully", async () => {
      const automation = await config.createAutomation()
      const res = await request
        .put(`/api/webhooks`)
        .send(basicWebhook(automation._id))
        .set(config.defaultHeaders())
        .expect("Content-Type", /json/)
        .expect(200)
      expect(res.body.webhook).toBeDefined()
      expect(typeof res.body.webhook._id).toEqual("string")
      expect(typeof res.body.webhook._rev).toEqual("string")
    })

    it("should apply authorization to endpoint", async () => {
      await checkBuilderEndpoint({
        config,
        method: "PUT",
        url: `/api/webhooks`,
      })
    })
  })

  describe("fetch", () => {
    it("returns the correct routing for basic user", async () => {
      const res = await request
        .get(`/api/webhooks`)
        .set(config.defaultHeaders())
        .expect("Content-Type", /json/)
        .expect(200)
      expect(Array.isArray(res.body)).toEqual(true)
      expect(res.body[0]._id).toEqual(webhook._id)
    })

    it("should apply authorization to endpoint", async () => {
      await checkBuilderEndpoint({
        config,
        method: "GET",
        url: `/api/webhooks`,
      })
    })
  })

  describe("delete", () => {
    it("should successfully delete", async () => {
      const res = await request
        .delete(`/api/webhooks/${webhook._id}/${webhook._rev}`)
        .set(config.defaultHeaders())
        .expect("Content-Type", /json/)
        .expect(200)
      expect(res.body).toBeDefined()
      expect(res.body.ok).toEqual(true)
    })

    it("should apply authorization to endpoint", async () => {
      await checkBuilderEndpoint({
        config,
        method: "DELETE",
        url: `/api/webhooks/${webhook._id}/${webhook._rev}`,
      })
    })
  })

  describe("build schema", () => {
    it("should allow building a schema", async () => {
      const res = await request
        .post(`/api/webhooks/schema/${config.getAppId()}/${webhook._id}`)
        .send({
          a: 1
        })
        .set(config.defaultHeaders())
        .expect("Content-Type", /json/)
        .expect(200)
      expect(res.body).toBeDefined()
      // fetch to see if the schema has been updated
      const fetch = await request
        .get(`/api/webhooks`)
        .set(config.defaultHeaders())
        .expect("Content-Type", /json/)
        .expect(200)
      expect(fetch.body[0]).toBeDefined()
      expect(fetch.body[0].bodySchema).toEqual({
        properties: {
          a: { type: "integer" }
        },
        type: "object",
      })
    })

    it("should apply authorization to endpoint", async () => {
      await checkBuilderEndpoint({
        config,
        method: "POST",
        url: `/api/webhooks/schema/${config.getAppId()}/${webhook._id}`,
      })
    })
  })

  describe("trigger", () => {
    it("should allow triggering from public", async () => {
      const res = await request
        .post(`/api/webhooks/trigger/${config.getAppId()}/${webhook._id}`)
        .expect("Content-Type", /json/)
        .expect(200)
      expect(res.body.message).toBeDefined()
    })
  })
})