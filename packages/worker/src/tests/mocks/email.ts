import { simpleParser } from "mailparser"
import type { AddressObject, ParsedMail } from "mailparser"
import { SMTPServer } from "smtp-server"
import type { SMTPServerOptions, SMTPServerSession } from "smtp-server"
import TestConfiguration from "../TestConfiguration"

export function mock() {
  const sendMailMock = jest.fn()
  const nodemailer = require("nodemailer")
  nodemailer.createTransport.mockReturnValue({
    sendMail: sendMailMock,
    verify: jest.fn(),
  })
  return sendMailMock
}

export interface Address {
  address: string
  name: string
}

export interface Email {
  attachments: ParsedMail["attachments"]
  calculatedBcc: Address[]
  cc: Address[]
  from: Address[]
  html: string
  to: Address[]
}

export class Mailserver {
  private readonly emails: Email[] = []
  private readonly listeners = new Set<(email: Email) => void>()

  constructor(public readonly server: SMTPServer) {}

  addEmail(email: Email) {
    this.emails.push(email)
    for (const listener of this.listeners) {
      listener(email)
    }
  }

  onNewEmail(listener: (email: Email) => void) {
    this.listeners.add(listener)
    return () => {
      this.listeners.delete(listener)
    }
  }

  deleteAllEmail() {
    this.emails.length = 0
  }
}

export interface MailserverConfig extends SMTPServerOptions {
  smtp?: number
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

function getAddresses(
  addresses: AddressObject | AddressObject[] | undefined
): Address[] {
  const addressObjects = Array.isArray(addresses)
    ? addresses
    : addresses
      ? [addresses]
      : []

  return addressObjects.flatMap(addressObject =>
    addressObject.value.flatMap(({ address, name }) =>
      address ? [{ address, name }] : []
    )
  )
}

function parseEmail(message: ParsedMail, session: SMTPServerSession): Email {
  if (message.html === false) {
    throw new Error("Expected email to contain an HTML body")
  }

  const to = getAddresses(message.to)
  const cc = getAddresses(message.cc)
  const visibleRecipients = new Set(
    [...to, ...cc].map(recipient => recipient.address)
  )
  const calculatedBcc = session.envelope.rcptTo
    .map(recipient => recipient.address)
    .filter(address => !visibleRecipients.has(address))
    .map(address => ({ address, name: "" }))

  return {
    attachments: message.attachments,
    calculatedBcc,
    cc,
    from: getAddresses(message.from),
    html: message.html,
    to,
  }
}

export async function captureEmail(
  mailserver: Mailserver,
  f: () => Promise<void>
): Promise<Email> {
  const timeoutMs = 5000
  let timeout: ReturnType<typeof setTimeout> | undefined
  let removeListener: () => void = () => {}
  const emailPromise = new Promise<Email>(resolve => {
    removeListener = mailserver.onNewEmail(email => {
      removeListener()
      resolve(email)
    })
  })
  const timeoutPromise = new Promise<never>((_, reject) => {
    timeout = setTimeout(() => {
      reject(new Error("Timed out waiting for email"))
    }, timeoutMs)
  })

  try {
    await f()
    return await Promise.race([emailPromise, timeoutPromise])
  } finally {
    removeListener()
    if (timeout) {
      clearTimeout(timeout)
    }
  }
}

export async function startMailserver(
  config: TestConfiguration,
  opts: MailserverConfig = {}
): Promise<Mailserver> {
  if (!opts.smtp) {
    opts.smtp = await getUnusedPort()
  }

  const { smtp: smtpPort, ...serverOptions } = opts
  const server = new SMTPServer({
    ...serverOptions,
    authOptional: true,
    disabledCommands: ["AUTH", "STARTTLS"],
    onData(stream, session, callback) {
      const chunks: Buffer[] = []
      stream.on("data", chunk => {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
      })
      stream.on("error", error => callback(error))
      stream.on("end", async () => {
        try {
          const message = await simpleParser(Buffer.concat(chunks))
          mailserver.addEmail(parseEmail(message, session))
          callback()
        } catch (error) {
          callback(error instanceof Error ? error : new Error(String(error)))
        }
      })
    },
  })
  const mailserver = new Mailserver(server)

  if (!smtpPort) {
    throw new Error("SMTP port was not configured")
  }

  await new Promise<void>((resolve, reject) => {
    const onError = (error: Error) => reject(error)
    server.once("error", onError)
    server.listen(smtpPort, "127.0.0.1", () => {
      server.removeListener("error", onError)
      resolve()
    })
  })

  await config.saveSmtpConfig({
    host: "127.0.0.1",
    port: smtpPort,
    secure: false,
    from: "test@example.com",
  })
  return mailserver
}

export function deleteAllEmail(mailserver: Mailserver) {
  mailserver.deleteAllEmail()
}

export function stopMailserver(mailserver: Mailserver) {
  return new Promise<void>(resolve => {
    mailserver.server.close(() => resolve())
  })
}
