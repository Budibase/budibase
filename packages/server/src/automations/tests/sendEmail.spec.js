const setup = require("./utilities")

jest.mock("@sendgrid/mail")

describe("test the send email action", () => {
  let inputs
  let config = setup.getConfig()

  beforeEach(async () => {
    await config.init()
    inputs = {
      to: "me@test.com",
      from: "budibase@test.com",
      subject: "Testing",
      text: "Email contents",
    }
  })

  afterAll(setup.afterAll)

  it("should be able to run the action", async () => {
    const res = await setup.runStep(setup.actions.SEND_EMAIL.stepId, inputs)
    expect(res.success).toEqual(true)
    // the mocked module throws back the input
    expect(res.response.to).toEqual("me@test.com")
  })

  it("should return an error if input an invalid email address", async () => {
    const res = await setup.runStep(setup.actions.SEND_EMAIL.stepId, {
      ...inputs,
      to: "invalid@test.com",
    })
    expect(res.success).toEqual(false)
  })

})
