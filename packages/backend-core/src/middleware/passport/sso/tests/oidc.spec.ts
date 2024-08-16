import { generator, structures } from "../../../../../tests"
import {
  JwtClaims,
  OIDCInnerConfig,
  SSOAuthDetails,
  SSOProviderType,
} from "@budibase/types"
import * as _sso from "../sso"
import * as oidc from "../oidc"
import nock from "nock"

jest.mock("@techpass/passport-openidconnect")
const mockStrategy = require("@techpass/passport-openidconnect").Strategy

jest.mock("../sso")
const sso = jest.mocked(_sso)

const mockSaveUser = jest.fn()
const mockDone = jest.fn()

describe("oidc", () => {
  const callbackUrl = generator.url()
  const oidcConfig: OIDCInnerConfig = structures.sso.oidcConfig()
  const wellKnownConfig = structures.sso.oidcWellKnownConfig()

  beforeEach(() => {
    nock.cleanAll()
    nock(oidcConfig.configUrl).get("/").reply(200, wellKnownConfig)
  })

  describe("strategyFactory", () => {
    it("should create successfully create an oidc strategy", async () => {
      const strategyConfiguration = await oidc.fetchStrategyConfig(
        oidcConfig,
        callbackUrl
      )
      await oidc.strategyFactory(strategyConfiguration, mockSaveUser)

      const expectedOptions = {
        issuer: wellKnownConfig.issuer,
        authorizationURL: wellKnownConfig.authorization_endpoint,
        tokenURL: wellKnownConfig.token_endpoint,
        userInfoURL: wellKnownConfig.userinfo_endpoint,
        clientID: oidcConfig.clientID,
        clientSecret: oidcConfig.clientSecret,
        callbackURL: callbackUrl,
      }
      expect(mockStrategy).toHaveBeenCalledWith(
        expectedOptions,
        expect.anything()
      )
    })
  })

  describe("authenticate", () => {
    const details: SSOAuthDetails = structures.sso.authDetails()
    details.providerType = SSOProviderType.OIDC
    const profile = details.profile!
    const issuer = profile.provider

    const sub = generator.string()
    const idToken = generator.string()
    const params = {}

    let authenticateFn: any
    let jwtClaims: JwtClaims

    beforeEach(async () => {
      jest.clearAllMocks()
      authenticateFn = await oidc.buildVerifyFn(mockSaveUser)
    })

    async function authenticate() {
      await authenticateFn(
        issuer,
        sub,
        profile,
        jwtClaims,
        details.oauth2.accessToken,
        details.oauth2.refreshToken,
        idToken,
        params,
        mockDone
      )
    }

    it("passes auth details to sso module", async () => {
      await authenticate()

      expect(sso.authenticate).toHaveBeenCalledWith(
        details,
        false,
        mockDone,
        mockSaveUser
      )
    })

    it("uses JWT email to get email", async () => {
      delete profile._json.email

      jwtClaims = {
        email: details.email,
      }

      await authenticate()

      expect(sso.authenticate).toHaveBeenCalledWith(
        details,
        false,
        mockDone,
        mockSaveUser
      )
    })

    it("uses JWT username to get email", async () => {
      delete profile._json.email

      jwtClaims = {
        email: details.email,
      }

      await authenticate()

      expect(sso.authenticate).toHaveBeenCalledWith(
        details,
        false,
        mockDone,
        mockSaveUser
      )
    })

    it("uses JWT invalid username to get email", async () => {
      delete profile._json.email

      jwtClaims = {
        preferred_username: "invalidUsername",
      }

      await expect(authenticate()).rejects.toThrow(
        "Could not determine user email from profile"
      )
    })
  })
})
