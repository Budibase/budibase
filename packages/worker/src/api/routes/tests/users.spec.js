const setup = require("./utilities")

jest.mock("nodemailer")
const sendMailMock = setup.emailMock()

describe("/api/admin/users", () => {
  let request = setup.getRequest()
  let config = setup.getConfig()
  let code

  beforeAll(async () => {
    await config.init()
  })

  afterAll(setup.afterAll)

  it("should be able to generate an invitation", async () => {
    // initially configure settings
    await config.saveSmtpConfig()
    await config.saveSettingsConfig()
    const res = await request
      .post(`/api/admin/users/invite`)
      .send({
        email: "invite@test.com",
      })
      .set(config.defaultHeaders())
      .expect("Content-Type", /json/)
      .expect(200)
    expect(res.body).toEqual({ message: "Invitation has been sent." })
    expect(sendMailMock).toHaveBeenCalled()
    const emailCall = sendMailMock.mock.calls[0][0]
    // after this URL there should be a code
    const parts = emailCall.html.split("http://localhost:10000/invite/")
    code = parts[1].split("\"")[0]
    expect(code).toBeDefined()
  })

  it("should be able to create new user from invite", async () => {
    const res = await request
      .post(`/api/admin/users/invite/accept`)
      .send({
        password: "newpassword",
        inviteCode: code,
      })
      .expect("Content-Type", /json/)
      .expect(200)
    expect(res.body._id).toBeDefined()
    const user = await config.getUser("invite@test.com")
    expect(user).toBeDefined()
    expect(user._id).toEqual(res.body._id)
  })
})