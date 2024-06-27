import TestConfiguration from "../../../src/tests/utilities/TestConfiguration"
import * as workerRequests from "../../utilities/workerRequests"
import { runStep } from "./utilities"
import { AutomationActionStepId } from "@budibase/types"

jest.mock("../../utilities/workerRequests", () => ({
  sendSmtpEmail: jest.fn(),
}))

function generateResponse(to: string, from: string) {
  return {
    success: true,
    response: {
      accepted: [to],
      envelope: {
        from: from,
        to: [to],
      },
      message: `Email sent to ${to}.`,
    },
  }
}

describe("test the outgoing webhook action", () => {
  const config = new TestConfiguration()

  beforeAll(async () => {
    await config.init()
  })

  afterAll(() => {
    config.end()
  })

  it("should be able to run the action", async () => {
    jest
      .spyOn(workerRequests, "sendSmtpEmail")
      .mockImplementationOnce(async () =>
        generateResponse("user1@example.com", "admin@example.com")
      )
    const invite = {
      startTime: new Date(),
      endTime: new Date(),
      summary: "summary",
      location: "location",
      url: "url",
    }
    const inputs = {
      to: "user1@example.com",
      from: "admin@example.com",
      subject: "hello",
      contents: "testing",
      cc: "cc",
      bcc: "bcc",
      addInvite: true,
      attachments: [
        { url: "attachment1", filename: "attachment1.txt" },
        { url: "attachment2", filename: "attachment2.txt" },
      ],
      ...invite,
    }
    let resp = generateResponse(inputs.to, inputs.from)
    const res = await runStep(
      config,
      AutomationActionStepId.SEND_EMAIL_SMTP,
      inputs
    )
    expect(res.response).toEqual(resp)
    expect(res.success).toEqual(true)
    expect(workerRequests.sendSmtpEmail).toHaveBeenCalledTimes(1)
    expect(workerRequests.sendSmtpEmail).toHaveBeenCalledWith({
      to: "user1@example.com",
      from: "admin@example.com",
      subject: "hello",
      contents: "testing",
      cc: "cc",
      bcc: "bcc",
      invite,
      automation: true,
      attachments: [
        { url: "attachment1", filename: "attachment1.txt" },
        { url: "attachment2", filename: "attachment2.txt" },
      ],
    })
  })
})
