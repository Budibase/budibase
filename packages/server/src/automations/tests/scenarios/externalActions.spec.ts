import { HttpMethod, RequestType } from "@budibase/types"
import nock from "nock"
import TestConfiguration from "../../../tests/utilities/TestConfiguration"
import * as automation from "../../index"
import { createAutomationBuilder } from "../utilities/AutomationTestBuilder"

describe("External action automations", () => {
  const config = new TestConfiguration()

  beforeAll(async () => {
    await config.init()
  })

  beforeEach(async () => {
    await automation.init()
    await config.api.automation.deleteAll()
    nock.cleanAll()
  })

  afterEach(() => {
    nock.cleanAll()
  })

  afterAll(() => {
    config.end()
  })

  it("runs webhook integrations and exposes parsed responses", async () => {
    nock("http://www.example.com")
      .post("/slack", { text: "Slack message" })
      .reply(200, "ok")
      .post("/discord", body => {
        return (
          body.username === "Budibase Automate" &&
          body.content === "Discord message"
        )
      })
      .reply(204, "")
      .post("/zapier", { platform: "budibase", name: "Ada" })
      .reply(200, { zapier: true })
      .post("/make", { nested: { value: true }, count: 2 })
      .reply(200, { make: true })
      .post("/n8n", { name: "Nora" })
      .matchHeader("authorization", "Bearer test")
      .reply(200, { n8n: true })
      .post("/outgoing", { action: "created" })
      .matchHeader("x-test", "yes")
      .reply(201, { webhook: true })

    const results = await createAutomationBuilder(config)
      .onAppAction()
      .slack({
        url: "http://www.example.com/slack",
        text: "Slack message",
      })
      .discord({
        url: "http://www.example.com/discord",
        content: "Discord message",
      })
      .zapier({
        url: "http://www.example.com/zapier",
        body: {
          value: JSON.stringify({ name: "Ada" }),
        },
      })
      .make({
        url: "http://www.example.com/make",
        body: {
          value: JSON.stringify({
            nested: JSON.stringify({ value: true }),
            count: 2,
          }),
        },
      })
      .n8n({
        url: "http://www.example.com/n8n",
        method: HttpMethod.POST,
        authorization: "Bearer test",
        body: {
          value: JSON.stringify({ name: "Nora" }),
        },
      })
      .outgoingWebhook({
        requestMethod: RequestType.POST,
        url: "http://www.example.com/outgoing",
        requestBody: JSON.stringify({ action: "created" }),
        headers: {
          "x-test": "yes",
        },
      })
      .test({ fields: {} })

    expect(results.steps[0].outputs).toEqual({
      httpStatus: 200,
      response: "ok",
      success: true,
    })
    expect(results.steps[1].outputs).toMatchObject({
      httpStatus: 204,
      success: true,
    })
    expect(results.steps[2].outputs).toMatchObject({
      httpStatus: 200,
      response: { zapier: true },
      success: true,
    })
    expect(results.steps[3].outputs).toMatchObject({
      httpStatus: 200,
      response: { make: true },
      success: true,
    })
    expect(results.steps[4].outputs).toMatchObject({
      httpStatus: 200,
      response: { n8n: true },
      success: true,
    })
    expect(results.steps[5].outputs).toMatchObject({
      httpStatus: 201,
      response: { webhook: true },
      success: true,
    })
    expect(nock.isDone()).toBe(true)
  })

  it("reports missing Slack webhook URLs", async () => {
    const results = await createAutomationBuilder(config)
      .onAppAction()
      .slack({
        url: " ",
        text: "Slack message",
      })
      .test({ fields: {} })

    expect(results.steps[0].outputs).toMatchObject({
      httpStatus: 400,
      response: "Missing Webhook URL",
      success: false,
    })
  })

  it("reports missing Discord webhook URLs", async () => {
    const results = await createAutomationBuilder(config)
      .onAppAction()
      .discord({
        url: "",
        content: "Discord message",
      })
      .test({ fields: {} })

    expect(results.steps[0].outputs).toMatchObject({
      httpStatus: 400,
      response: "Missing Webhook URL",
      success: false,
    })
  })

  it("reports invalid Zapier payloads", async () => {
    const results = await createAutomationBuilder(config)
      .onAppAction()
      .zapier({
        url: "http://www.example.com/zapier",
        body: {
          value: "{not-json",
        },
      })
      .test({ fields: {} })

    expect(results.steps[0].outputs).toMatchObject({
      httpStatus: 400,
      response: "Invalid payload JSON",
      success: false,
    })
  })

  it("reports invalid Make payloads", async () => {
    const results = await createAutomationBuilder(config)
      .onAppAction()
      .make({
        url: "http://www.example.com/make",
        body: {
          value: "{not-json",
        },
      })
      .test({ fields: {} })

    expect(results.steps[0].outputs).toMatchObject({
      httpStatus: 400,
      response: "Invalid payload JSON",
      success: false,
    })
  })

  it("reports missing n8n webhook URLs", async () => {
    const results = await createAutomationBuilder(config)
      .onAppAction()
      .n8n({
        url: "",
        method: HttpMethod.POST,
        authorization: "Bearer test",
        body: {
          value: JSON.stringify({ name: "Nora" }),
        },
      })
      .test({ fields: {} })

    expect(results.steps[0].outputs).toMatchObject({
      httpStatus: 400,
      response: "Missing Webhook URL",
      success: false,
    })
  })

  it("reports invalid outgoing webhook headers", async () => {
    const results = await createAutomationBuilder(config)
      .onAppAction()
      .outgoingWebhook({
        requestMethod: RequestType.POST,
        url: "http://www.example.com/outgoing",
        requestBody: JSON.stringify({ action: "created" }),
        headers: "{not-json",
      })
      .test({ fields: {} })

    expect(results.steps[0].outputs).toMatchObject({
      response: "Unable to process headers, must be a JSON object.",
      success: false,
    })
  })

  it("handles redirects", async () => {
    nock("http://www.redirect.com")
      .post("/start", { redirected: true })
      .reply(302, "", {
        location: "http://www.redirected.com/final",
      })

    nock("http://www.redirected.com")
      .get("/final")
      .reply(200, { redirected: true })

    const results = await createAutomationBuilder(config)
      .onAppAction()
      .outgoingWebhook({
        requestMethod: RequestType.POST,
        url: "http://www.redirect.com/start",
        requestBody: JSON.stringify({ redirected: true }),
        headers: {},
      })
      .test({ fields: {} })

    expect(results.steps[0].outputs).toMatchObject({
      httpStatus: 200,
      response: { redirected: true },
      success: true,
    })
  })

  it("reports Slack fetch failures", async () => {
    nock("http://www.example.com").post("/slack").replyWithError("slack failed")

    const results = await createAutomationBuilder(config)
      .onAppAction()
      .slack({
        url: "http://www.example.com/slack",
        text: "Slack message",
      })
      .test({ fields: {} })

    expect(results.steps[0].outputs).toMatchObject({
      httpStatus: 400,
      success: false,
    })
    expect(results.steps[0].outputs.response).toContain("slack failed")
  })

  it("reports Discord fetch failures", async () => {
    nock("http://www.example.com")
      .post("/discord")
      .replyWithError("discord failed")

    const results = await createAutomationBuilder(config)
      .onAppAction()
      .discord({
        url: "http://www.example.com/discord",
        content: "Discord message",
      })
      .test({ fields: {} })

    expect(results.steps[0].outputs.response).toContain("discord failed")
  })

  it("reports Zapier fetch failures", async () => {
    nock("http://www.example.com")
      .post("/zapier")
      .replyWithError("zapier failed")

    const results = await createAutomationBuilder(config)
      .onAppAction()
      .zapier({
        url: "http://www.example.com/zapier",
        body: {
          value: JSON.stringify({ name: "Ada" }),
        },
      })
      .test({ fields: {} })

    expect(results.steps[0].outputs.response).toContain("zapier failed")
  })

  it("reports Make fetch failures", async () => {
    nock("http://www.example.com").post("/make").replyWithError("make failed")

    const results = await createAutomationBuilder(config)
      .onAppAction()
      .make({
        url: "http://www.example.com/make",
        body: {
          value: JSON.stringify({ name: "Ada" }),
        },
      })
      .test({ fields: {} })

    expect(results.steps[0].outputs.response).toContain("make failed")
  })

  it("reports n8n fetch failures", async () => {
    nock("http://www.example.com").get("/n8n").replyWithError("n8n failed")

    const results = await createAutomationBuilder(config)
      .onAppAction()
      .n8n({
        url: "http://www.example.com/n8n",
        method: HttpMethod.GET,
        authorization: "Bearer test",
        body: {},
      })
      .test({ fields: {} })

    expect(results.steps[0].outputs).toMatchObject({
      httpStatus: 400,
      success: false,
    })
    expect(results.steps[0].outputs.response).toContain("n8n failed")
  })
})
