import { AutomationActionStepId } from "@budibase/types"
import TestConfiguration from "../../tests/utilities/TestConfiguration"
import { runStep } from "./utilities"

jest.mock("node-fetch")

describe("test the outgoing webhook action", () => {
  const config = new TestConfiguration()

  beforeAll(async () => {
    await config.init()
  })

  afterAll(() => {
    config.end()
  })

  it("should be able to run the action", async () => {
    const res = await runStep(config, AutomationActionStepId.discord, {
      username: "joe_bloggs",
      url: "http://www.example.com",
    })
    expect(res.response.url).toEqual("http://www.example.com")
    expect(res.response.method).toEqual("post")
    expect(res.success).toEqual(true)
  })
})
