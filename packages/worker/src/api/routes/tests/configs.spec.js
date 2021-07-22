const setup = require("./utilities")

// mock the email system
const sendMailMock = jest.fn()
jest.mock("nodemailer")
const nodemailer = require("nodemailer")
nodemailer.createTransport.mockReturnValue({
  verify: jest.fn()
})

describe("/api/global/configs/checklist", () => {
  let request = setup.getRequest()
  let config = setup.getConfig()

  beforeAll(async () => {
    await config.init(false)
  })

  afterAll(setup.afterAll)

  it("should return the correct checklist status based on the state of the budibase installation", async () => {
    // initially configure settings
    await config.saveAdminUser()
    await config.saveSmtpConfig()

    const res = await request
      .get(`/api/global/configs/checklist`)
      .set(config.defaultHeaders())
      .expect("Content-Type", /json/)
      .expect(200)
    
    const checklist = res.body

    expect(checklist.apps).toBe(0)
    expect(checklist.smtp).toBe(true)
    expect(checklist.adminUser).toBe(true)
  })
})