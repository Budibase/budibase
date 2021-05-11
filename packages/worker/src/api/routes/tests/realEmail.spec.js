const setup = require("./utilities")
const { EmailTemplatePurpose } = require("../../../constants")
const nodemailer = require("nodemailer")
const fetch = require("node-fetch")

describe("/api/admin/email", () => {
  let request = setup.getRequest()
  let config = setup.getConfig()

  beforeAll(async () => {
    await config.init()
  })

  afterAll(setup.afterAll)

  async function sendRealEmail(purpose) {
    await config.saveEtherealSmtpConfig()
    await config.saveSettingsConfig()
    const user = await config.getUser("test@test.com")
    const res = await request
      .post(`/api/admin/email/send`)
      .send({
        email: "test@test.com",
        purpose,
        userId: user._id,
      })
      .set(config.defaultHeaders())
      .expect("Content-Type", /json/)
      .expect(200)
    expect(res.body.message).toBeDefined()
    const testUrl = nodemailer.getTestMessageUrl(res.body)
    console.log(`${purpose} URL: ${testUrl}`)
    expect(testUrl).toBeDefined()
    const response = await fetch(testUrl)
    const text = await response.text()
    let toCheckFor
    switch (purpose) {
      case EmailTemplatePurpose.WELCOME:
        toCheckFor = `Thanks for getting started with Budibase's Budibase platform.`
        break
      case EmailTemplatePurpose.INVITATION:
        toCheckFor = `Use the button below to set up your account and get started:`
        break
      case EmailTemplatePurpose.PASSWORD_RECOVERY:
        toCheckFor = `You recently requested to reset your password for your Budibase account in your Budibase platform`
        break
    }
    expect(text).toContain(toCheckFor)
  }

  it("should be able to send a welcome email", async () => {
    await sendRealEmail(EmailTemplatePurpose.WELCOME)

  })

  it("should be able to send a invitation email", async () => {
    await sendRealEmail(EmailTemplatePurpose.INVITATION)
  })

  it("should be able to send a password recovery email", async () => {
    await sendRealEmail(EmailTemplatePurpose.PASSWORD_RECOVERY)
  })
})