// mock the email system
jest.mock("nodemailer")
const setup = require("./utilities")
setup.emailMock()

describe("/api/global/configs/checklist", () => {
  let request = setup.getRequest()
  let config = setup.getConfig()

  beforeAll(async () => {
    await config.init()
  })

  afterAll(setup.afterAll)

  it("should return the correct checklist status based on the state of the budibase installation", async () => {
    await config.saveSmtpConfig()

    const res = await request
      .get(`/api/global/configs/checklist`)
      .set(config.defaultHeaders())
      .expect("Content-Type", /json/)
      .expect(200)

    const checklist = res.body

    expect(checklist.apps.checked).toBeFalsy()
    expect(checklist.smtp.checked).toBeTruthy()
    expect(checklist.adminUser.checked).toBeTruthy()
  })
})
