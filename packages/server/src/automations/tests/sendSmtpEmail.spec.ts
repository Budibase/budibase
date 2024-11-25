import * as workerRequests from "../../utilities/workerRequests"

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

import * as setup from "./utilities"

describe("test the outgoing webhook action", () => {
  let inputs
  let config = setup.getConfig()
  beforeAll(async () => {
    await config.init()
  })

  afterAll(setup.afterAll)

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
    inputs = {
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
    const res = await setup.runStep(
      config,
      setup.actions.SEND_EMAIL_SMTP.stepId,
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
