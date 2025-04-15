import { SendEmailResponse } from "@budibase/types"
import TestConfiguration from "../../../tests/utilities/TestConfiguration"
import * as workerRequests from "../../../utilities/workerRequests"

jest.mock("../../../utilities/workerRequests", () => ({
  sendSmtpEmail: jest.fn(),
}))

function generateResponse(to: string, from: string): SendEmailResponse {
  return {
    message: `Email sent to ${to}.`,
    accepted: [to],
    envelope: {
      from: from,
      to: [to],
    },
    messageId: "messageId",
    pending: [],
    rejected: [],
    response: "response",
  }
}

import { createAutomationBuilder } from "../utilities/AutomationTestBuilder"

describe("test the outgoing webhook action", () => {
  const config = new TestConfiguration()

  beforeAll(async () => {
    await config.init()
    await config.api.automation.deleteAll()
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

    const { steps } = await createAutomationBuilder(config)
      .onAppAction()
      .sendSmtpEmail(inputs)
      .test({ fields: {} })

    expect(steps[0].outputs.response).toEqual(resp)
    expect(steps[0].outputs.success).toEqual(true)
    expect(workerRequests.sendSmtpEmail).toHaveBeenCalledTimes(1)
    expect(workerRequests.sendSmtpEmail).toHaveBeenCalledWith({
      to: "user1@example.com",
      from: "admin@example.com",
      subject: "hello",
      contents: "testing",
      cc: "cc",
      bcc: "bcc",
      invite: {
        ...invite,
        startTime: invite.startTime.toISOString(),
        endTime: invite.endTime.toISOString(),
      },
      automation: true,
      attachments: [
        { url: "attachment1", filename: "attachment1.txt" },
        { url: "attachment2", filename: "attachment2.txt" },
      ],
    })
  })
})
