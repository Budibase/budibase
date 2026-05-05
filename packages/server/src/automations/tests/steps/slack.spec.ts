import nock from "nock"
import { run } from "../../steps/slack"

describe("slack step", () => {
  beforeEach(() => {
    nock.cleanAll()
  })

  afterEach(() => {
    nock.cleanAll()
  })

  it("requires a webhook URL", async () => {
    const result = await run({
      inputs: {
        url: " ",
        text: "Hello",
      },
    })

    expect(result).toEqual({
      httpStatus: 400,
      response: "Missing Webhook URL",
      success: false,
    })
  })

  it("posts the message text to Slack", async () => {
    nock("http://www.example.com").post("/", { text: "Hello" }).reply(200, "ok")

    const result = await run({
      inputs: {
        url: "http://www.example.com",
        text: "Hello",
      },
    })

    expect(result).toEqual({
      httpStatus: 200,
      response: "ok",
      success: true,
    })
    expect(nock.isDone()).toEqual(true)
  })

  it("reports fetch failures", async () => {
    nock("http://www.example.com").post("/").replyWithError("network failed")

    const result = await run({
      inputs: {
        url: "http://www.example.com",
        text: "Hello",
      },
    })

    expect(result.httpStatus).toEqual(400)
    expect(result.response).toContain("network failed")
    expect(result.success).toEqual(false)
  })
})
