import { fetchMessages } from "../../email/utils/fetchMessages"
import { ImapFlow } from "imapflow"

const createClient = (mailboxExists: number) => {
  const client: jest.Mocked<
    Pick<ImapFlow, "connect" | "mailboxOpen" | "fetchOne" | "fetchAll">
  > = {
    connect: jest.fn().mockResolvedValue(undefined),
    mailboxOpen: jest
      .fn()
      .mockResolvedValue({ exists: mailboxExists, uidNext: mailboxExists + 1 }),
    fetchOne: jest.fn(),
    fetchAll: jest.fn(),
  }
  return client
}

describe("fetchMessages", () => {
  it("throws when the mailbox does not exist", async () => {
    const client = createClient(0)
    await expect(
      fetchMessages(client as unknown as ImapFlow, "INBOX")
    ).rejects.toThrow("Mailbox does not exist")

    expect(client.connect).toHaveBeenCalledTimes(1)
    expect(client.mailboxOpen).toHaveBeenCalledWith("INBOX")
    expect(client.fetchOne).not.toHaveBeenCalled()
    expect(client.fetchAll).not.toHaveBeenCalled()
  })
})
