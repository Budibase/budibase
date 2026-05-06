import { FilterCondition, RequestType } from "@budibase/types"
import nock from "nock"
import TestConfiguration from "../../../tests/utilities/TestConfiguration"
import * as automation from "../../index"
import { createAutomationBuilder } from "../utilities/AutomationTestBuilder"

describe("External action automations", () => {
  const config = new TestConfiguration()

  beforeAll(async () => {
    await config.init()
    await automation.init()
  })

  beforeEach(async () => {
    await config.api.automation.deleteAll()
    nock.cleanAll()
  })

  afterEach(() => {
    nock.cleanAll()
  })

  afterAll(async () => {
    await automation.shutdown()
    config.end()
  })

  it("uses outgoing webhook responses to gate and compose follow-up actions", async () => {
    nock("http://www.example.com")
      .post("/tickets", { action: "created" })
      .matchHeader("x-test", "yes")
      .reply(201, { id: "T-100", priority: "high" })
      .post("/slack", { text: "Escalated T-100" })
      .reply(200, "ok")

    const results = await createAutomationBuilder(config)
      .onAppAction()
      .outgoingWebhook(
        {
          requestMethod: RequestType.POST,
          url: "http://www.example.com/tickets",
          requestBody: JSON.stringify({ action: "created" }),
          headers: {
            "x-test": "yes",
          },
        },
        { stepName: "CreateTicket" }
      )
      .filter({
        field: "{{ stepsByName.CreateTicket.response.priority }}",
        condition: FilterCondition.EQUAL,
        value: "high",
      })
      .slack({
        url: "http://www.example.com/slack",
        text: "Escalated {{ stepsByName.CreateTicket.response.id }}",
      })
      .test({ fields: {} })

    expect(results.steps[0].outputs).toMatchObject({
      httpStatus: 201,
      response: { id: "T-100", priority: "high" },
      success: true,
    })
    expect(results.steps[1].outputs.result).toBe(true)
    expect(results.steps[2].outputs).toMatchObject({
      httpStatus: 200,
      response: "ok",
      success: true,
    })
    expect(nock.isDone()).toBe(true)
  })
})
