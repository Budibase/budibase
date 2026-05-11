jest.mock("@budibase/backend-core", () => {
  const actual = jest.requireActual("@budibase/backend-core")
  return {
    ...actual,
    utils: {
      ...actual.utils,
      fetchWithBlacklist: jest.fn(),
    },
  }
})

import { utils as coreUtils } from "@budibase/backend-core"
import { OAuth2CredentialsMethod, OAuth2GrantType } from "@budibase/types"
import { Response } from "node-fetch"
import { validateConfig } from "../utils"

const fetchWithBlacklistMock =
  coreUtils.fetchWithBlacklist as jest.MockedFunction<
    typeof coreUtils.fetchWithBlacklist
  >

describe("oauth2 security", () => {
  const config = {
    url: "https://auth.example.com/oauth/token",
    clientId: "client-id",
    clientSecret: "client-secret",
    method: OAuth2CredentialsMethod.BODY,
    grantType: OAuth2GrantType.CLIENT_CREDENTIALS,
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("fetches tokens through fetchWithBlacklist", async () => {
    fetchWithBlacklistMock.mockResolvedValue(
      new Response(
        JSON.stringify({
          token_type: "Bearer",
          access_token: "token",
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
    )

    const result = await validateConfig(config)

    expect(result).toEqual({ valid: true })
    expect(fetchWithBlacklistMock).toHaveBeenCalledTimes(1)
    expect(fetchWithBlacklistMock).toHaveBeenCalledWith(
      config.url,
      expect.objectContaining({
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: expect.any(URLSearchParams),
      })
    )
  })

  it("rejects token URLs blocked by fetchWithBlacklist", async () => {
    fetchWithBlacklistMock.mockRejectedValue(
      new Error("URL is blocked or could not be resolved safely.")
    )

    const result = await validateConfig({
      ...config,
      url: "http://169.254.169.254/latest/meta-data/",
    })

    expect(result).toEqual({
      valid: false,
      message: "URL is blocked or could not be resolved safely.",
    })
  })
})
