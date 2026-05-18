import { EmailTriggerInputs } from "@budibase/types"
import { getClient } from "../../email/utils/getClient"
import { ImapFlow } from "imapflow"

jest.mock("imapflow", () => ({
  ImapFlow: jest.fn(),
}))

const mockImapFlow = ImapFlow as unknown as jest.Mock

describe("getClient", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("requires email trigger inputs", async () => {
    await expect(
      getClient(undefined as unknown as EmailTriggerInputs)
    ).rejects.toThrow("Email trigger inputs are required")
    expect(mockImapFlow).not.toHaveBeenCalled()
  })

  it("creates an ImapFlow client from trigger inputs", async () => {
    const client = { id: "client" }
    mockImapFlow.mockReturnValue(client)

    const result = await getClient({
      host: "imap.example.com",
      port: 993,
      secure: true,
      username: "user@example.com",
      password: "password",
      mailbox: "INBOX",
    })

    expect(result).toBe(client)
    expect(mockImapFlow).toHaveBeenCalledWith({
      host: "imap.example.com",
      port: 993,
      secure: true,
      auth: {
        user: "user@example.com",
        pass: "password",
      },
      logger: false,
    })
  })
})
