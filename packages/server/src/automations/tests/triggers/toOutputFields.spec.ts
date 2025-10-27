import { toOutputFields } from "../../email/utils/toOutputFields"

describe("toOutputFields", () => {
  it("formats addresses and converts Date to ISO string", () => {
    const sentDate = new Date("2024-01-01T10:00:00.000Z")
    const result = toOutputFields({
      envelope: {
        from: [{ address: "alice@example.com" }],
        to: [{ address: "bob@example.com" }],
        subject: "Greetings",
        date: sentDate,
      },
    } as any)

    expect(result).toEqual({
      from: "alice@example.com",
      to: "bob@example.com",
      subject: "Greetings",
      sentAt: sentDate.toISOString(),
    })
  })

  it("parses string dates", () => {
    const result = toOutputFields({
      envelope: {
        from: [{ address: "alice@example.com" }],
        date: "Tue, 02 Jan 2024 12:00:00 +0000",
      },
    } as any)

    expect(result.sentAt).toEqual("2024-01-02T12:00:00.000Z")
  })

  it("returns undefined when date is invalid", () => {
    const result = toOutputFields({
      envelope: {
        from: [{ address: "alice@example.com" }],
        date: "not-a-date",
      },
    } as any)

    expect(result.sentAt).toBeUndefined()
  })
})
