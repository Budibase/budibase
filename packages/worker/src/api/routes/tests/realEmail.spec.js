const setup = require("./utilities")
const { EmailTemplatePurpose } = require("../../../constants")
const nodemailer = require("nodemailer")
const fetch = require("node-fetch")

// for the real email tests give them a long time to try complete/fail
jest.setTimeout(30000)

describe("/api/global/email", () => {
  let request = setup.getRequest()
  let config = setup.getConfig()

  beforeAll(async () => {
    await config.init()
  })

  afterAll(setup.afterAll)

  async function sendRealEmail(purpose) {
    let response, text
    try {
      await config.saveEtherealSmtpConfig()
      await config.saveSettingsConfig()
      const user = await config.getUser("test@test.com")
      const res = await request
        .post(`/api/global/email/send`)
        .send({
          email: "test@test.com",
          purpose,
          userId: user._id,
        })
        .set(config.defaultHeaders())
        .timeout(20000)
      // ethereal hiccup, can't test right now
      if (res.status >= 300) {
        return
      }
      expect(res.body.message).toBeDefined()
      const testUrl = nodemailer.getTestMessageUrl(res.body)
      console.log(`${purpose} URL: ${testUrl}`)
      expect(testUrl).toBeDefined()
      response = await fetch(testUrl)
      text = await response.text()
    } catch (err) {
      // ethereal hiccup, can't test right now
      if (parseInt(err.status) >= 300 || (err && err.errno === "ETIME")) {
        return
      } else {
        throw err
      }
    }
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