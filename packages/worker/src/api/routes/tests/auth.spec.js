const setup = require("./utilities")

jest.mock("nodemailer")
const sendMailMock = setup.emailMock()

describe("/api/admin/auth", () => {
  let request = setup.getRequest()
  let config = setup.getConfig()
  let code

  beforeAll(async () => {
    await config.init()
  })

  afterAll(setup.afterAll)

  it("should be able to generate password reset email", async () => {
    // initially configure settings
    await config.saveSmtpConfig()
    await config.saveSettingsConfig()
    await config.createUser("test@test.com")
    const res = await request
      .post(`/api/admin/auth/reset`)
      .send({
        email: "test@test.com",
      })
      .expect("Content-Type", /json/)
      .expect(200)
    expect(res.body).toEqual({ message: "Please check your email for a reset link." })
    expect(sendMailMock).toHaveBeenCalled()
    const emailCall = sendMailMock.mock.calls[0][0]
    // after this URL there should be a code
    const parts = emailCall.html.split("http://localhost:10000/builder/auth/reset?code=")
    code = parts[1].split("\"")[0]
    expect(code).toBeDefined()
  })

  it("should allow resetting user password with code", async () => {
    const res = await request
      .post(`/api/admin/auth/reset/update`)
      .send({
        password: "newpassword",
        resetCode: code,
      })
      .expect("Content-Type", /json/)
      .expect(200)
    expect(res.body).toEqual({ message: "password reset successfully." })
  })
})