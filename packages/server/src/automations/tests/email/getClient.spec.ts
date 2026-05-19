import {
  EmailTriggerAuthType,
  EmailTriggerInputs,
  OAuth2CredentialsMethod,
  OAuth2GrantType,
  RestAuthType,
} from "@budibase/types"
import { getClient } from "../../email/utils/getClient"
import { ImapFlow } from "imapflow"

jest.mock("imapflow", () => ({
  ImapFlow: jest.fn(),
}))

jest.mock("@budibase/backend-core", () => ({
  ...jest.requireActual("@budibase/backend-core"),
  blacklist: {
    isBlacklisted: jest.fn().mockResolvedValue(false),
  },
}))

jest.mock("../../../sdk", () => ({
  datasources: {
    get: jest.fn().mockResolvedValue({
      config: {
        authConfigs: [
          {
            _id: "auth_1",
            name: "OAuth2",
            type: RestAuthType.OAUTH2,
            url: "https://example.com/token",
            clientId: "client",
            clientSecret: "secret",
            grantType: OAuth2GrantType.CLIENT_CREDENTIALS,
            method: OAuth2CredentialsMethod.BODY,
          },
        ],
      },
    }),
  },
}))

jest.mock("../../../sdk/workspace/oauth2/utils", () => ({
  getTokenFromConfig: jest.fn().mockResolvedValue("Bearer raw-access-token"),
  getToken: jest.fn().mockResolvedValue("Bearer legacy-access-token"),
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

  it("creates an OAuth2 ImapFlow client from a legacy OAuth2 config", async () => {
    const { getToken, getTokenFromConfig } = jest.requireMock(
      "../../../sdk/workspace/oauth2/utils"
    )
    const client = { id: "client" }
    mockImapFlow.mockReturnValue(client)

    const result = await getClient({
      host: "imap.example.com",
      port: 993,
      secure: true,
      username: "user@example.com",
      authType: EmailTriggerAuthType.OAUTH2,
      datasourceId: "oauth2_legacy123",
      authConfigId: "oauth2_legacy123",
    })

    expect(result).toBe(client)
    expect(getToken).toHaveBeenCalledWith("oauth2_legacy123")
    expect(getTokenFromConfig).not.toHaveBeenCalled()
    expect(mockImapFlow).toHaveBeenCalledWith({
      host: "imap.example.com",
      port: 993,
      secure: true,
      auth: {
        user: "user@example.com",
        accessToken: "legacy-access-token",
      },
      logger: false,
    })
  })

  it("creates an OAuth2 ImapFlow client", async () => {
    const client = { id: "client" }
    mockImapFlow.mockReturnValue(client)

    const result = await getClient({
      host: "imap.example.com",
      port: 993,
      secure: true,
      username: "user@example.com",
      authType: EmailTriggerAuthType.OAUTH2,
      datasourceId: "ds_1",
      authConfigId: "auth_1",
    })

    expect(result).toBe(client)
    expect(mockImapFlow).toHaveBeenCalledWith({
      host: "imap.example.com",
      port: 993,
      secure: true,
      auth: {
        user: "user@example.com",
        accessToken: "raw-access-token",
      },
      logger: false,
    })
  })
})
