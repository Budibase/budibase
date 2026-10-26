import type { FetchMessageObject, MessageEnvelopeObject } from "imapflow"
import { htmlToText } from "html-to-text"
import {
  EMAIL_BODY_CHARACTER_LIMIT,
  EMAIL_BODY_TRUNCATION_SUFFIX,
  toOutputFields,
} from "../../email/utils/toOutputFields"

const buildMessage = ({
  raw,
  envelopeOverrides = {},
}: {
  raw: string
  envelopeOverrides?: Partial<MessageEnvelopeObject>
}): FetchMessageObject => {
  const source = Buffer.from(raw, "utf8")
  return {
    source,
    seq: 1,
    uid: 1,
    envelope: {
      from: [{ address: "sender@example.com" }],
      to: [{ address: "recipient@example.com" }],
      subject: "subject",
      date: new Date("2024-01-01T00:00:00.000Z"),
      ...envelopeOverrides,
    },
  }
}

describe("toOutputFields", () => {
  it.each([
    {
      name: "a valid Date",
      date: new Date("2024-01-01T00:00:00.000Z"),
      sentAt: "2024-01-01T00:00:00.000Z",
    },
    {
      name: "a date string with a timezone offset",
      date: "Mon, 01 Jan 2024 02:00:00 +0200",
      sentAt: "2024-01-01T00:00:00.000Z",
    },
    { name: "an invalid date string", date: "invalid date", sentAt: undefined },
    { name: "an empty date string", date: "", sentAt: undefined },
    { name: "an invalid Date", date: new Date(NaN), sentAt: undefined },
    { name: "a missing date", date: undefined, sentAt: undefined },
  ])("preserves the email output with $name", async ({ date, sentAt }) => {
    const message = buildMessage({
      raw: "Content-Type: text/plain; charset=utf-8\r\n\r\nHello",
      envelopeOverrides: { date },
    })

    const result = await toOutputFields(message)

    expect(result).toEqual({
      from: "sender@example.com",
      to: "recipient@example.com",
      cc: [],
      subject: "subject",
      sentAt,
      bodyText: "Hello",
      bodyTextTruncated: false,
    })
  })

  it("returns bodyText when under limit", async () => {
    const body = "Hello, world!"
    const message = buildMessage({
      raw: ["Content-Type: text/plain; charset=utf-8", "", body].join("\r\n"),
    })

    const result = await toOutputFields(message)

    expect(result).toEqual({
      from: "sender@example.com",
      to: "recipient@example.com",
      cc: [],
      subject: "subject",
      sentAt: "2024-01-01T00:00:00.000Z",
      bodyText: body,
      bodyTextTruncated: false,
    })
  })

  it("formats HTML body to readable text when plain body is empty", async () => {
    const boundary = "----=_Part_HTML"
    const html =
      "<h1>Welcome</h1><p>This is a <strong>test</strong> email.<br />Thanks!</p>"
    const message = buildMessage({
      raw: [
        `Content-Type: multipart/alternative; boundary="${boundary}"`,
        "",
        `--${boundary}`,
        "Content-Type: text/plain; charset=utf-8",
        "",
        "   ",
        `--${boundary}`,
        "Content-Type: text/html; charset=utf-8",
        "",
        html,
        `--${boundary}--`,
        "",
      ].join("\r\n"),
    })

    const result = await toOutputFields(message)

    expect(result.bodyText).toEqual(htmlToText(html))
    expect(result.bodyTextTruncated).toBe(false)
    expect(result.cc).toEqual([])
  })

  it("truncates bodyText when exceeding limit", async () => {
    const body = "a".repeat(EMAIL_BODY_CHARACTER_LIMIT + 10)
    const message = buildMessage({
      raw: ["Content-Type: text/plain; charset=utf-8", "", body].join("\r\n"),
    })

    const result = await toOutputFields(message)

    const expectedBody = `${body.slice(
      0,
      EMAIL_BODY_CHARACTER_LIMIT - EMAIL_BODY_TRUNCATION_SUFFIX.length
    )}${EMAIL_BODY_TRUNCATION_SUFFIX}`

    expect(result.bodyText).toBe(expectedBody)
    expect(result.bodyText?.length).toBe(EMAIL_BODY_CHARACTER_LIMIT)
    expect(result.bodyTextTruncated).toBe(true)
    expect(result.cc).toEqual([])
  })

  it("returns undefined body without truncation when source is missing", async () => {
    const message: FetchMessageObject = {
      ...buildMessage({ raw: "" }),
      source: undefined,
    }

    const result = await toOutputFields(message)

    expect(result.bodyText).toBeUndefined()
    expect(result.bodyTextTruncated).toBe(false)
    expect(result.cc).toEqual([])
  })

  it("returns all cc addresses as an array", async () => {
    const body = "Body with CC"
    const message = buildMessage({
      raw: ["Content-Type: text/plain; charset=utf-8", "", body].join("\r\n"),
      envelopeOverrides: {
        cc: [
          { address: "first@example.com" },
          { address: undefined },
          { address: "second@example.com" },
        ],
      },
    })

    const result = await toOutputFields(message)

    expect(result.cc).toEqual(["first@example.com", "second@example.com"])
    expect(result.bodyText).toEqual(body)
    expect(result.bodyTextTruncated).toBe(false)
  })

  it("falls back to unknown when sender or recipient addresses are missing", async () => {
    const message = buildMessage({
      raw: "",
      envelopeOverrides: {
        from: [{ address: undefined }],
        to: undefined,
        date: undefined,
        subject: undefined,
      },
    })

    const result = await toOutputFields(message)

    expect(result.from).toEqual("unknown")
    expect(result.to).toEqual("unknown")
    expect(result.subject).toBeUndefined()
    expect(result.sentAt).toBeUndefined()
  })

  it("returns undefined body when parsing fails", async () => {
    const message: FetchMessageObject = {
      ...buildMessage({ raw: "" }),
      source: Buffer.from([0xff, 0xfe, 0xfd]),
    }
    const consoleLog = jest.spyOn(console, "log").mockImplementation()

    const result = await toOutputFields(message)

    expect(result.bodyText).toBeUndefined()
    expect(result.bodyTextTruncated).toBe(false)
    consoleLog.mockRestore()
  })
})
