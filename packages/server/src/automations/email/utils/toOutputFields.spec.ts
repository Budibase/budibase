import type { FetchMessageObject } from "imapflow"
import { htmlToText } from "html-to-text"
import {
  EMAIL_BODY_CHARACTER_LIMIT,
  EMAIL_BODY_TRUNCATION_SUFFIX,
  toOutputFields,
} from "./toOutputFields"

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

    expect(result.bodyText).toEqual(body)
    expect(result.bodyTextTruncated).toBe(false)
    expect(result.cc).toEqual([])
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
    expect(result.cc).toEqual([])
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
    expect(result.cc).toEqual([])
  })

  it("returns undefined body without truncation when source is missing", async () => {
    const message: FetchMessageObject = {
      ...buildMessage(""),
      source: undefined,
    }

    const result = await toOutputFields(message)

    expect(result.bodyText).toBeUndefined()
    expect(result.bodyTextTruncated).toBe(false)
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
  })
})
