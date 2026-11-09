import type { FetchMessageObject } from "imapflow"
import { htmlToText } from "html-to-text"
import {
  EMAIL_BODY_CHARACTER_LIMIT,
  EMAIL_BODY_TRUNCATION_SUFFIX,
  EMAIL_HTML_CHARACTER_LIMIT,
  toOutputFields,
} from "../../email/utils/toOutputFields"

const buildMessage = (
  raw: string,
  envelopeOverrides: Partial<NonNullable<FetchMessageObject["envelope"]>> = {}
): FetchMessageObject => {
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
  it("returns bodyText when under limit", async () => {
    const body = "Hello, world!"
    const message = buildMessage(
      ["Content-Type: text/plain; charset=utf-8", "", body].join("\r\n")
    )

    const result = await toOutputFields(message)

    expect(result).toEqual({
      from: "sender@example.com",
      to: "recipient@example.com",
      cc: [],
      subject: "subject",
      sentAt: "2024-01-01T00:00:00.000Z",
      bodyText: body,
      bodyTextTruncated: false,
      bodyHtml: undefined,
      bodyHtmlTruncated: false,
    })
  })

  it("formats HTML body to readable text when plain body is empty", async () => {
    const boundary = "----=_Part_HTML"
    const html =
      "<h1>Welcome</h1><p>This is a <strong>test</strong> email.<br />Thanks!</p>"
    const message = buildMessage(
      [
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
      ].join("\r\n")
    )

    const result = await toOutputFields(message)

    expect(result.bodyText).toEqual(htmlToText(html))
    expect(result.bodyTextTruncated).toBe(false)
    expect(result.bodyHtml).toEqual(html)
    expect(result.bodyHtmlTruncated).toBe(false)
    expect(result.cc).toEqual([])
  })

  it("returns HTML body alongside the plain-text alternative", async () => {
    const boundary = "----=_Part_HTML"
    const plainText = "Your invoice is ready"
    const html =
      '<p>Your invoice is ready. <a href="https://example.com/invoices/123">View invoice</a></p>'
    const message = buildMessage(
      [
        `Content-Type: multipart/alternative; boundary="${boundary}"`,
        "",
        `--${boundary}`,
        "Content-Type: text/plain; charset=utf-8",
        "",
        plainText,
        `--${boundary}`,
        "Content-Type: text/html; charset=utf-8",
        "",
        html,
        `--${boundary}--`,
        "",
      ].join("\r\n")
    )

    const result = await toOutputFields(message)

    expect(result.bodyText).toEqual(plainText)
    expect(result.bodyHtml).toEqual(html)
    expect(result.bodyHtmlTruncated).toBe(false)
  })

  it("truncates bodyText when exceeding limit", async () => {
    const body = "a".repeat(EMAIL_BODY_CHARACTER_LIMIT + 10)
    const message = buildMessage(
      ["Content-Type: text/plain; charset=utf-8", "", body].join("\r\n")
    )

    const result = await toOutputFields(message)

    const expectedBody = `${body.slice(
      0,
      EMAIL_BODY_CHARACTER_LIMIT - EMAIL_BODY_TRUNCATION_SUFFIX.length
    )}${EMAIL_BODY_TRUNCATION_SUFFIX}`

    expect(result.bodyText).toBe(expectedBody)
    expect(result.bodyText?.length).toBe(EMAIL_BODY_CHARACTER_LIMIT)
    expect(result.bodyTextTruncated).toBe(true)
    expect(result.bodyHtml).toBeUndefined()
    expect(result.bodyHtmlTruncated).toBe(false)
    expect(result.cc).toEqual([])
  })

  it("truncates HTML body when exceeding the limit", async () => {
    const html = `<p>${"a".repeat(EMAIL_HTML_CHARACTER_LIMIT + 10)}</p>`
    const message = buildMessage(
      ["Content-Type: text/html; charset=utf-8", "", html].join("\r\n")
    )

    const result = await toOutputFields(message)

    const suffix = `<p>${EMAIL_BODY_TRUNCATION_SUFFIX.trim()}</p>`
    const expectedHtml = `<p>${"a".repeat(
      EMAIL_HTML_CHARACTER_LIMIT - suffix.length - "<p></p>".length
    )}</p>${suffix}`

    expect(result.bodyHtml).toBe(expectedHtml)
    expect(result.bodyHtml).toHaveLength(EMAIL_HTML_CHARACTER_LIMIT)
    expect(result.bodyHtmlTruncated).toBe(true)
  })

  it("sanitizes HTML body before returning it", async () => {
    const html =
      '<p onclick="alert(1)">Hello</p><script>alert(1)</script><img src="data:image/png;base64,abc" />'
    const message = buildMessage(
      ["Content-Type: text/html; charset=utf-8", "", html].join("\r\n")
    )

    const result = await toOutputFields(message)

    expect(result.bodyHtml).toBe("<p>Hello</p>")
  })

  it("returns undefined body without truncation when source is missing", async () => {
    const message: FetchMessageObject = {
      ...buildMessage(""),
      source: undefined,
    }

    const result = await toOutputFields(message)

    expect(result.bodyText).toBeUndefined()
    expect(result.bodyTextTruncated).toBe(false)
    expect(result.bodyHtml).toBeUndefined()
    expect(result.bodyHtmlTruncated).toBe(false)
    expect(result.cc).toEqual([])
  })

  it("returns all cc addresses as an array", async () => {
    const body = "Body with CC"
    const message = buildMessage(
      ["Content-Type: text/plain; charset=utf-8", "", body].join("\r\n"),
      {
        cc: [
          { address: "first@example.com" },
          { address: undefined },
          { address: "second@example.com" },
        ],
      }
    )

    const result = await toOutputFields(message)

    expect(result.cc).toEqual(["first@example.com", "second@example.com"])
    expect(result.bodyText).toEqual(body)
    expect(result.bodyTextTruncated).toBe(false)
    expect(result.bodyHtml).toBeUndefined()
    expect(result.bodyHtmlTruncated).toBe(false)
  })

  it("falls back to unknown when sender or recipient addresses are missing", async () => {
    const message = buildMessage("", {
      from: [{ address: undefined }],
      to: undefined,
      date: undefined,
      subject: undefined,
    })

    const result = await toOutputFields(message)

    expect(result.from).toEqual("unknown")
    expect(result.to).toEqual("unknown")
    expect(result.subject).toBeUndefined()
    expect(result.sentAt).toBeUndefined()
  })

  it("returns undefined body when parsing fails", async () => {
    const message: FetchMessageObject = {
      ...buildMessage(""),
      source: Buffer.from([0xff, 0xfe, 0xfd]),
    }
    const consoleLog = jest.spyOn(console, "log").mockImplementation()

    const result = await toOutputFields(message)

    expect(result.bodyText).toBeUndefined()
    expect(result.bodyTextTruncated).toBe(false)
    expect(result.bodyHtml).toBeUndefined()
    expect(result.bodyHtmlTruncated).toBe(false)
    consoleLog.mockRestore()
  })
})
