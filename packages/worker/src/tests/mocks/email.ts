import MailDev from "maildev"
import { promisify } from "util"
import TestConfiguration from "../TestConfiguration"

/**
 * @deprecated please use the `MailDev` email server instead of this mock.
 */
export function mock() {
  // mock the email system
  const sendMailMock = jest.fn()
  const nodemailer = require("nodemailer")
  nodemailer.createTransport.mockReturnValue({
    sendMail: sendMailMock,
    verify: jest.fn(),
  })
  return sendMailMock
}

export type Mailserver = InstanceType<typeof MailDev>
export type MailserverConfig = ConstructorParameters<typeof MailDev>[0]

export interface Attachment {
  checksum: string
  contentId: string
  contentType: string
  fileName: string
  generatedFileName: string
  length: number
  transferEncoding: string
  transformed: boolean
}

export interface Address {
  address: string
  args?: boolean
  name?: string
}

export interface Alternative {
  contentType: string
  content: string
  charset: string
  method: string
  transferEncoding: string
}

export interface Envelope {
  from: Address
  to: Address[]
  host: string
  remoteAddress: string
}

export interface Email {
  attachments: Attachment[]
  alternatives: Alternative[]
  calculatedBcc: Address[]
  cc: Address[]
  date: string
  envelope: Envelope
  from: Address[]
  headers: Record<string, string>
  html: string
  id: string
  messageId: string
  priority: string
  read: boolean
  size: number
  sizeHuman: string
  source: string
  time: Date
  to: Address[]
}

export function getUnusedPort(): Promise<number> {
  return new Promise((resolve, reject) => {
    const server = require("net").createServer()
    server.unref()
    server.on("error", reject)
    server.listen(0, () => {
      const port = server.address().port
      server.close(() => {
        resolve(port)
      })
    })
  })
}

export async function captureEmail(
  mailserver: Mailserver,
  f: () => Promise<void>
): Promise<Email> {
  const timeoutMs = 5000
  let timeout: ReturnType<typeof setTimeout> | undefined = undefined
  const cancel = () => {
    if (timeout) {
      clearTimeout(timeout)
      timeout = undefined
    }
  }
  const timeoutPromise = new Promise<never>((_, reject) => {
    timeout = setTimeout(() => {
      reject(new Error("Timed out waiting for email"))
    }, timeoutMs)
  })
  const mailPromise = new Promise<Email>(resolve => {
    // @ts-expect-error - types are wrong
    mailserver.once("new", email => {
      resolve(email as Email)
      cancel()
    })
  })
  const emailPromise = Promise.race([mailPromise, timeoutPromise])
  try {
    await f()
  } finally {
    cancel()
  }
  return await emailPromise
}

export async function startMailserver(
  config: TestConfiguration,
  opts?: MailserverConfig
): Promise<Mailserver> {
  if (!opts) {
    opts = {}
  }
  if (!opts.smtp) {
    opts.smtp = await getUnusedPort()
  }
  const mailserver = new MailDev(opts || {})
  await new Promise((resolve, reject) => {
    mailserver.listen(err => {
      if (err) {
        return reject(err)
      }
      resolve(mailserver)
    })
  })
  await config.saveSmtpConfig({
    host: "localhost",
    port: opts.smtp,
    secure: false,
    from: "test@example.com",
  })
  return mailserver
}

export function deleteAllEmail(mailserver: Mailserver) {
  return promisify(mailserver.deleteAllEmail).bind(mailserver)()
}

export function stopMailserver(mailserver: Mailserver) {
  return promisify(mailserver.close).bind(mailserver)()
}

export function getAttachment(
  mailserver: Mailserver,
  email: Email,
  attachment: Attachment
) {
  return new Promise<string>(resolve => {
    // @ts-expect-error - types are wrong
    mailserver.getEmailAttachment(
      email.id,
      attachment.generatedFileName,
      (err: any, _contentType: string, stream: ReadableStream) => {
        if (err) {
          throw err
        }
        resolve(new Response(stream).text())
      }
    )
  })
}

export function getAttachments(mailserver: Mailserver, email: Email) {
  return Promise.all(
    email.attachments.map(attachment =>
      getAttachment(mailserver, email, attachment)
    )
  )
}
