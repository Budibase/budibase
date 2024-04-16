jest.unmock("node-fetch")
jest.unmock("aws-sdk")
import { TestConfiguration } from "../../../../tests"
import { EmailTemplatePurpose } from "../../../../constants"
import { objectStoreTestProviders, mocks } from "@budibase/backend-core/tests"
import { objectStore } from "@budibase/backend-core"
import tk from "timekeeper"
import { EmailAttachment } from "@budibase/types"

const fetch = require("node-fetch")

const nodemailer = require("nodemailer")

// for the real email tests give them a long time to try complete/fail
jest.setTimeout(30000)

describe("/api/global/email", () => {
  const config = new TestConfiguration()

  beforeAll(async () => {
    await objectStoreTestProviders.minio.start()
    await config.beforeAll()
  })

  afterAll(async () => {
    await objectStoreTestProviders.minio.stop()
    await config.afterAll()
  })

  async function sendRealEmail(
    purpose: string,
    attachments?: EmailAttachment[]
  ) {
    let response, text
    try {
      const timeout = () =>
        new Promise((resolve, reject) =>
          setTimeout(
            () =>
              reject({
                status: 301,
                errno: "ETIME",
              }),
            20000
          )
        )
      await Promise.race([config.saveEtherealSmtpConfig(), timeout()])
      await Promise.race([config.saveSettingsConfig(), timeout()])
      let res
      if (attachments) {
        res = await config.api.emails
          .sendEmail(purpose, attachments)
          .timeout(20000)
      } else {
        res = await config.api.emails.sendEmail(purpose).timeout(20000)
      }
      // ethereal hiccup, can't test right now
      if (res.status >= 300) {
        return
      }
      expect(res.body.message).toBeDefined()
      const testUrl = nodemailer.getTestMessageUrl(res.body)
      expect(testUrl).toBeDefined()
      response = await fetch(testUrl)
      text = await response.text()
    } catch (err: any) {
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

  it("should be able to send an email with attachments", async () => {
    tk.reset()
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
    tk.freeze(mocks.date.MOCK_DATE)
    await sendRealEmail(EmailTemplatePurpose.WELCOME, [attachmentObject])
  })
})
