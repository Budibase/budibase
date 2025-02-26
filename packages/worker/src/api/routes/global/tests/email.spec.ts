import { EmailTemplatePurpose } from "@budibase/types"
import { TestConfiguration } from "../../../../tests"
import {
  captureEmail,
  deleteAllEmail,
  getAttachment,
  getUnusedPort,
  Mailserver,
  startMailserver,
  stopMailserver,
} from "../../../../tests/mocks/email"
import { objectStore } from "@budibase/backend-core"

describe("/api/global/email", () => {
  const config = new TestConfiguration()
  let mailserver: Mailserver

  beforeAll(async () => {
    await config.beforeAll()
    const port = await getUnusedPort()
    mailserver = await startMailserver(config, { smtp: port })
  })

  afterAll(async () => {
    await stopMailserver(mailserver)
    await config.afterAll()
  })

  beforeEach(async () => {
    await deleteAllEmail(mailserver)
  })

  it.each([
    {
      purpose: EmailTemplatePurpose.WELCOME,
      expectedText: `Thanks for getting started with Budibase's Budibase platform.`,
    },
    {
      purpose: EmailTemplatePurpose.INVITATION,
      expectedText: `Use the button below to set up your account and get started:`,
    },
    {
      purpose: EmailTemplatePurpose.PASSWORD_RECOVERY,
      expectedText: `You recently requested to reset your password for your Budibase account in your Budibase platform`,
    },
  ])("can send $purpose emails", async ({ purpose, expectedText }) => {
    const email = await captureEmail(mailserver, async () => {
      const res = await config.api.emails.sendEmail(purpose)
      expect(res.body.message).toBeDefined()
      expect(res.status).toBe(200)
    })

    expect(email.html).toContain(expectedText)
    expect(email.html).not.toContain("Invalid binding")
  })

  it("should be able to send an email with an attachment", async () => {
    let bucket = "testbucket"
    let filename = "test.txt"
    await objectStore.upload({
      bucket,
      filename,
      body: Buffer.from("test data"),
    })
    let presignedUrl = await objectStore.getPresignedUrl(
      bucket,
      filename,
      60000
    )

    let attachmentObject = {
      url: presignedUrl,
      filename,
    }

    const email = await captureEmail(mailserver, async () => {
      const res = await config.api.emails.sendEmail(
        EmailTemplatePurpose.WELCOME,
        [attachmentObject]
      )
      expect(res.body.message).toBeDefined()
      expect(res.status).toBe(200)
    })

    expect(email.html).toContain(
      "Thanks for getting started with Budibase's Budibase platform."
    )
    expect(email.html).not.toContain("Invalid binding")

    const attachment = await getAttachment(
      mailserver,
      email,
      email.attachments[0]
    )
    expect(attachment).toEqual("test data")
  })
})
