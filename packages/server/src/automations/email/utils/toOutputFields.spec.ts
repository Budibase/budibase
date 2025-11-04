import type { FetchMessageObject } from "imapflow"
import { simpleParser } from "mailparser"
import type { ParsedMail } from "mailparser"
import {
  EMAIL_BODY_CHARACTER_LIMIT,
  EMAIL_BODY_TRUNCATION_SUFFIX,
  toOutputFields,
} from "./toOutputFields"

jest.mock("mailparser", () => ({
  simpleParser: jest.fn(),
}))

const simpleParserMock = simpleParser as jest.MockedFunction<
  typeof simpleParser
>

const createMessage = (): FetchMessageObject =>
  ({
    source: Buffer.from("message"),
    envelope: {
      from: [{ address: "sender@example.com" }],
      to: [{ address: "recipient@example.com" }],
      subject: "subject",
      date: new Date("2024-01-01T00:00:00.000Z"),
    },
  }) as unknown as FetchMessageObject

describe("toOutputFields", () => {
  beforeEach(() => {
    simpleParserMock.mockReset()
  })

  it("returns bodyText when under limit", async () => {
    const body = "Hello, world!"
    simpleParserMock.mockResolvedValue({ text: body } as ParsedMail)

    const result = await toOutputFields(createMessage())

    expect(result.bodyText).toEqual(body)
    expect(result.bodyTextTruncated).toBeFalse()
  })

  it("truncates bodyText when exceeding limit", async () => {
    const body = "a".repeat(EMAIL_BODY_CHARACTER_LIMIT + 10)
    simpleParserMock.mockResolvedValue({ text: body } as ParsedMail)

    const result = await toOutputFields(createMessage())

    expect(result.bodyText?.endsWith(EMAIL_BODY_TRUNCATION_SUFFIX)).toBeTrue()
    expect(result.bodyText?.length).toBe(EMAIL_BODY_CHARACTER_LIMIT)
    expect(result.bodyTextTruncated).toBeTrue()
  })

  it("returns undefined body without truncation when parser fails", async () => {
    simpleParserMock.mockResolvedValue({ text: undefined } as ParsedMail)

    const result = await toOutputFields(createMessage())

    expect(result.bodyText).toBeUndefined()
    expect(result.bodyTextTruncated).toBeFalse()
  })
})
