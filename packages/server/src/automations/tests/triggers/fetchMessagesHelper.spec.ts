import type { FetchMessageObject, ImapFlow } from "imapflow"
import { fetchMessages } from "../../email/utils/fetchMessages"

const buildClient = ({
  exists,
  uidNext = 10,
  fetchOneResult,
}: {
  exists: number
  uidNext?: number
  fetchOneResult?: FetchMessageObject | false
}) => {
  return {
    connect: jest.fn(),
    mailboxOpen: jest.fn().mockResolvedValue({ exists, uidNext }),
    fetchOne: jest.fn().mockResolvedValue(fetchOneResult),
    fetchAll: jest.fn().mockResolvedValue([{ uid: 2 }]),
  } as unknown as ImapFlow
}

describe("fetchMessages helper", () => {
  it("connects and returns no messages when the mailbox is empty", async () => {
    const client = buildClient({ exists: 0 })

    const result = await fetchMessages(client, "INBOX")

    expect(result).toEqual([])
    expect(client.connect).toHaveBeenCalled()
    expect(client.mailboxOpen).toHaveBeenCalledWith("INBOX")
    expect(client.fetchOne).not.toHaveBeenCalled()
    expect(client.fetchAll).not.toHaveBeenCalled()
  })

  it("fetches the newest message when no uid has been seen", async () => {
    const message = { uid: 9 } as FetchMessageObject
    const client = buildClient({ exists: 9, fetchOneResult: message })

    const result = await fetchMessages(client, "INBOX")

    expect(result).toEqual([message])
    expect(client.fetchOne).toHaveBeenCalledWith(9, expect.any(Object))
    expect(client.fetchAll).not.toHaveBeenCalled()
  })

  it("returns no messages when fetchOne does not find a message", async () => {
    const client = buildClient({ exists: 9, fetchOneResult: false })

    const result = await fetchMessages(client, "INBOX")

    expect(result).toEqual([])
  })

  it("returns no messages when the next uid has not arrived yet", async () => {
    const client = buildClient({ exists: 9, uidNext: 10 })

    const result = await fetchMessages(client, "INBOX", 9)

    expect(result).toEqual([])
    expect(client.fetchAll).not.toHaveBeenCalled()
  })

  it("fetches all messages since the last seen uid", async () => {
    const client = buildClient({ exists: 9, uidNext: 10 })

    const result = await fetchMessages(client, "INBOX", 7)

    expect(result).toEqual([{ uid: 2 }])
    expect(client.fetchAll).toHaveBeenCalledWith(
      { uid: "8:*" },
      expect.any(Object)
    )
  })
})
