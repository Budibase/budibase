jest.mock("../../configs", () => {
  const actual = jest.requireActual("../../configs")
  return {
    ...actual,
    getOIDCConfigById: jest.fn(),
  }
})
jest.mock("../../middleware", () => {
  const actual = jest.requireActual("../../middleware")
  return {
    ...actual,
    oidc: {
      ...actual.oidc,
      getCallbackUrl: jest.fn(),
      fetchStrategyConfig: jest.fn(),
      strategyFactory: jest.fn(),
    },
  }
})

import { structures } from "../../../tests"
import { testEnv } from "../../../tests/extra"
import { ConfigType, SSOProviderType } from "@budibase/types"
import type OpenIDConnectStrategy from "@govtechsg/passport-openidconnect"
import * as auth from "../auth"
import * as configs from "../../configs"
import * as events from "../../events"
import * as middleware from "../../middleware"

const refresh = require("passport-oauth2-refresh") as {
  _strategies: Record<string, unknown>
  has: (name: string) => boolean
}
const getOIDCConfigById = jest.mocked(configs.getOIDCConfigById)
const getCallbackUrl = jest.mocked(middleware.oidc.getCallbackUrl)
const fetchStrategyConfig = jest.mocked(middleware.oidc.fetchStrategyConfig)
const strategyFactory = jest.mocked(middleware.oidc.strategyFactory)

describe("platformLogout", () => {
  it("should call platform logout", async () => {
    await testEnv.withTenant(async () => {
      const ctx = structures.koa.newContext()
      await auth.platformLogout({ ctx, userId: "test" })
      expect(events.auth.logout).toHaveBeenCalledTimes(1)
    })
  })
})

describe("refreshOAuthToken", () => {
  afterEach(() => {
    refresh._strategies = {}
    jest.restoreAllMocks()
    jest.clearAllMocks()
  })

  it("should register oidc refresh using the strategy oauth2 adapter", async () => {
    const oidcConfig = structures.sso.oidcConfig()
    const configId = "config-id"
    const callbackUrl = "http://localhost/auth/oidc/callback"
    const strategyConfig = {
      issuer: "https://issuer.example.com",
      authorizationURL: "https://issuer.example.com/authorize",
      tokenURL: "https://issuer.example.com/token",
      userInfoURL: "https://issuer.example.com/userinfo",
      clientID: oidcConfig.clientID,
      clientSecret: oidcConfig.clientSecret,
      callbackURL: callbackUrl,
    }
    const strategy = {
      _oauth2: {
        _clientId: oidcConfig.clientID,
        _clientSecret: oidcConfig.clientSecret,
        _baseSite: "",
        _authorizeUrl: strategyConfig.authorizationURL,
        _accessTokenUrl: strategyConfig.tokenURL,
        _customHeaders: {},
        getOAuthAccessToken: (
          _refreshToken: string,
          _params: Record<string, string>,
          done: (
            err: null,
            accessToken: string,
            refreshToken: string,
            params: Record<string, string>
          ) => void
        ) => {
          done(null, "access-token", "refresh-token", { scope: "openid" })
        },
      },
      name: ConfigType.OIDC,
    } as unknown as OpenIDConnectStrategy

    getOIDCConfigById.mockResolvedValue(oidcConfig)
    getCallbackUrl.mockResolvedValue(callbackUrl)
    fetchStrategyConfig.mockResolvedValue(strategyConfig)
    strategyFactory.mockResolvedValue(strategy)

    const result = await auth.refreshOAuthToken(
      "existing-refresh-token",
      SSOProviderType.OIDC,
      configId
    )

    expect(result).toEqual({
      err: null,
      accessToken: "access-token",
      refreshToken: "refresh-token",
      params: { scope: "openid" },
    })
    expect(refresh.has(ConfigType.OIDC)).toBe(true)
  })
})
