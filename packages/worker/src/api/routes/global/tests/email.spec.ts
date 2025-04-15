import { EmailTemplatePurpose, SendEmailRequest } from "@budibase/types"
import { TestConfiguration } from "../../../../tests"
import {
  captureEmail,
  deleteAllEmail,
  getAttachments,
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
    mailserver = await startMailserver(config)
  })

  afterAll(async () => {
    await stopMailserver(mailserver)
    await config.afterAll()
  })

  beforeEach(async () => {
    await deleteAllEmail(mailserver)
  })

  interface TestCase {
    req: Partial<SendEmailRequest>
    expectedStatus?: number
    expectedContents?: string
  }

  const testCases: TestCase[] = [
    {
      req: {
        purpose: EmailTemplatePurpose.WELCOME,
      },
      expectedContents: `Thanks for getting started with Budibase's Budibase platform.`,
    },
    {
      req: {
        purpose: EmailTemplatePurpose.INVITATION,
      },
      expectedContents: `Use the button below to set up your account and get started:`,
    },
    {
      req: {
        purpose: EmailTemplatePurpose.PASSWORD_RECOVERY,
      },
      expectedContents: `You recently requested to reset your password for your Budibase account in your Budibase platform`,
    },
    {
      req: {
        purpose: EmailTemplatePurpose.CUSTOM,
        contents: "Hello, world!",
      },
      expectedContents: "Hello, world!",
    },
  ]

  it.each(testCases)(
    "can send $req.purpose emails",
    async ({ req, expectedContents, expectedStatus }) => {
      const email = await captureEmail(mailserver, async () => {
        const res = await config.api.emails.sendEmail(
          {
            email: "to@example.com",
            subject: "Test",
            userId: config.user!._id,
            purpose: EmailTemplatePurpose.WELCOME,
            ...req,
          },
          {
            status: expectedStatus || 200,
          }
        )
        expect(res.message).toBeDefined()
      })

      expect(email.html).toContain(expectedContents)
      expect(email.html).not.toContain("Invalid binding")
    }
  )

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
      const res = await config.api.emails.sendEmail({
        email: "to@example.com",
        subject: "Test",
        userId: config.user!._id,
        purpose: EmailTemplatePurpose.WELCOME,
        attachments: [attachmentObject],
      })
      expect(res.message).toBeDefined()
    })

    expect(email.html).toContain(
      "Thanks for getting started with Budibase's Budibase platform."
    )
    expect(email.html).not.toContain("Invalid binding")

    const attachments = await getAttachments(mailserver, email)
    expect(attachments).toEqual(["test data"])
  })

  it("should be able to send email without a userId", async () => {
    const res = await config.api.emails.sendEmail({
      email: "to@example.com",
      subject: "Test",
      purpose: EmailTemplatePurpose.WELCOME,
    })
    expect(res.message).toBeDefined()
  })

  it("should fail to send a password reset email without a userId", async () => {
    const res = await config.api.emails.sendEmail(
      {
        email: "to@example.com",
        subject: "Test",
        purpose: EmailTemplatePurpose.PASSWORD_RECOVERY,
      },
      {
        status: 400,
      }
    )
    expect(res.message).toBeDefined()
  })

  it("can cc people", async () => {
    const email = await captureEmail(mailserver, async () => {
      await config.api.emails.sendEmail({
        email: "to@example.com",
        cc: "cc@example.com",
        subject: "Test",
        purpose: EmailTemplatePurpose.CUSTOM,
        contents: "Hello, world!",
      })
    })

    expect(email.cc).toEqual([{ address: "cc@example.com", name: "" }])
  })

  it("can bcc people", async () => {
    const email = await captureEmail(mailserver, async () => {
      await config.api.emails.sendEmail({
        email: "to@example.com",
        bcc: "bcc@example.com",
        subject: "Test",
        purpose: EmailTemplatePurpose.CUSTOM,
        contents: "Hello, world!",
      })
    })

    expect(email.calculatedBcc).toEqual([
      { address: "bcc@example.com", name: "" },
    ])
  })

  it("can change the from address", async () => {
    const email = await captureEmail(mailserver, async () => {
      const res = await config.api.emails.sendEmail({
        email: "to@example.com",
        from: "from@example.com",
        subject: "Test",
        purpose: EmailTemplatePurpose.CUSTOM,
        contents: "Hello, world!",
      })
      expect(res.message).toBeDefined()
    })

    expect(email.to).toEqual([{ address: "to@example.com", name: "" }])
    expect(email.from).toEqual([{ address: "from@example.com", name: "" }])
  })

  it("can send a calendar invite", async () => {
    const startTime = new Date()
    const endTime = new Date()

    const email = await captureEmail(mailserver, async () => {
      await config.api.emails.sendEmail({
        email: "to@example.com",
        subject: "Test",
        purpose: EmailTemplatePurpose.CUSTOM,
        contents: "Hello, world!",
        invite: {
          startTime,
          endTime,
          summary: "Summary",
          location: "Location",
          url: "http://example.com",
        },
      })
    })

    expect(email.alternatives).toEqual([
      {
        charset: "utf-8",
        contentType: "text/calendar",
        method: "REQUEST",
        transferEncoding: "7bit",
        content: expect.any(String),
      },
    ])

    // Reference iCal invite:
    //   BEGIN:VCALENDAR
    //   VERSION:2.0
    //   PRODID:-//sebbo.net//ical-generator//EN
    //   NAME:Invite
    //   X-WR-CALNAME:Invite
    //   BEGIN:VEVENT
    //   UID:2b5947b7-ec5a-4341-8d70-8d8130183f2a
    //   SEQUENCE:0
    //   DTSTAMP:20200101T000000Z
    //   DTSTART:20200101T000000Z
    //   DTEND:20200101T000000Z
    //   SUMMARY:Summary
    //   LOCATION:Location
    //   URL;VALUE=URI:http://example.com
    //   END:VEVENT
    //   END:VCALENDAR
    expect(email.alternatives[0].content).toContain("BEGIN:VCALENDAR")
    expect(email.alternatives[0].content).toContain("BEGIN:VEVENT")
    expect(email.alternatives[0].content).toContain("UID:")
    expect(email.alternatives[0].content).toContain("SEQUENCE:0")
    expect(email.alternatives[0].content).toContain("SUMMARY:Summary")
    expect(email.alternatives[0].content).toContain("LOCATION:Location")
    expect(email.alternatives[0].content).toContain(
      "URL;VALUE=URI:http://example.com"
    )
    expect(email.alternatives[0].content).toContain("END:VEVENT")
    expect(email.alternatives[0].content).toContain("END:VCALENDAR")

    const formatDate = (date: Date) =>
      date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z"

    expect(email.alternatives[0].content).toContain(
      `DTSTAMP:${formatDate(startTime)}`
    )
    expect(email.alternatives[0].content).toContain(
      `DTSTART:${formatDate(startTime)}`
    )
    expect(email.alternatives[0].content).toContain(
      `DTEND:${formatDate(endTime)}`
    )
  })
})
