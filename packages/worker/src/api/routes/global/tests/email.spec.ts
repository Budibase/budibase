jest.mock("nodemailer")
import { EmailTemplatePurpose } from "@budibase/types"
import { TestConfiguration, mocks } from "../../../../tests"

const sendMailMock = mocks.email.mock()

describe("/api/global/email", () => {
  const config = new TestConfiguration()

  beforeAll(async () => {
    await config.beforeAll()
  })

  afterAll(async () => {
    await config.afterAll()
  })

  it("should be able to send an email (with mocking)", async () => {
    // initially configure settings
    await config.saveSmtpConfig()
    await config.saveSettingsConfig()

    const res = await config.api.emails.sendEmail(
      EmailTemplatePurpose.INVITATION
    )

    expect(res.body.message).toBeDefined()
    expect(sendMailMock).toHaveBeenCalled()
    const emailCall = sendMailMock.mock.calls[0][0]
    expect(emailCall.subject).toBe("Hello!")
    expect(emailCall.html).not.toContain("Invalid binding")
  })
})
