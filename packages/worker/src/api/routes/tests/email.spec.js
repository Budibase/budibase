const setup = require("./utilities")
const { EmailTemplatePurpose } = require("../../../constants")

// mock the email system
const sendMailMock = jest.fn()
jest.mock("nodemailer")
const nodemailer = require("nodemailer")
nodemailer.createTransport.mockReturnValue({
  sendMail: sendMailMock,
  verify: jest.fn()
})

describe("/api/admin/email", () => {
  let request = setup.getRequest()
  let config = setup.getConfig()

  beforeAll(async () => {
    await config.init()
  })

  afterAll(setup.afterAll)

  it("should be able to send an email (with mocking)", async () => {
    // initially configure settings
    await config.saveSmtpConfig()
    await config.saveSettingsConfig()
    const res = await request
      .post(`/api/admin/email/send`)
      .send({
        email: "test@test.com",
        purpose: EmailTemplatePurpose.INVITATION,
      })
      .set(config.defaultHeaders())
      .expect("Content-Type", /json/)
      .expect(200)
    expect(res.body.message).toBeDefined()
    expect(sendMailMock).toHaveBeenCalled()
    const emailCall = sendMailMock.mock.calls[0][0]
    expect(emailCall.subject).toBe("Hello!")
    expect(emailCall.html).not.toContain("Invalid Binding")
  })
})