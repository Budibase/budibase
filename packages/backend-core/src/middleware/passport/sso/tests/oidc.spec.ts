import { generator, structures } from "../../../../../tests"
import {
  OIDCInnerConfig,
  SSOAuthDetails,
  SSOProviderType,
} from "@budibase/types"
import * as _sso from "../sso"
import * as oidc from "../oidc"
import nock from "nock"
import type OpenIDConnectStrategy from "@govtechsg/passport-openidconnect"

jest.mock("@govtechsg/passport-openidconnect")
const mockStrategy = require("@govtechsg/passport-openidconnect").Strategy

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

    const idToken = generator.string()
    const params: Record<string, unknown> = {}
    const context: OpenIDConnectStrategy.AuthContext = {}

    let authenticateFn: any
    let uiProfile: OpenIDConnectStrategy.MergedProfile & {
      _json?: {
        email?: string
        picture?: string
      }
      provider?: string
    }
    let idProfile: OpenIDConnectStrategy.Profile

    beforeEach(() => {
      jest.clearAllMocks()
      authenticateFn = oidc.buildVerifyFn(mockSaveUser)
      uiProfile = {
        id: profile.id,
        name: profile.name,
        _json: { ...profile._json },
        provider: profile.provider,
      }
      idProfile = {
        id: profile.id,
        name: profile.name,
        emails: [{ value: details.email! }],
        username: details.email,
      }
    })

    async function authenticate() {
      await authenticateFn(
        issuer,
        uiProfile,
        idProfile,
        context,
        idToken,
        details.oauth2.accessToken,
        details.oauth2.refreshToken,
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

    it("uses id token email to get email", async () => {
      delete uiProfile._json?.email

      await authenticate()

      expect(sso.authenticate).toHaveBeenCalledWith(
        details,
        false,
        mockDone,
        mockSaveUser
      )
    })

    it("uses id token username to get email", async () => {
      delete uiProfile._json?.email
      delete idProfile.emails

      await authenticate()

      const expectedDetails = {
        ...details,
        profile: {
          ...details.profile,
          _json: {
            ...details.profile?._json,
            email: undefined,
          },
        },
      }

      expect(sso.authenticate).toHaveBeenCalledWith(
        expectedDetails,
        false,
        mockDone,
        mockSaveUser
      )
    })

    it("uses invalid id token username to get email", async () => {
      delete uiProfile._json?.email
      delete idProfile.emails

      idProfile.username = "invalidUsername"

      await expect(authenticate()).rejects.toThrow(
        "Could not determine user email from profile"
      )
    })

    it("populates first and last name from profile data", async () => {
      const givenName = "Ada"
      const familyName = "Lovelace"
      uiProfile.name = {
        givenName,
        familyName,
      }
      idProfile.name = {
        givenName,
        familyName,
      }

      await authenticate()

      const expectedDetails = {
        ...details,
        profile: {
          ...details.profile,
          name: {
            givenName,
            familyName,
          },
        },
      }

      expect(sso.authenticate).toHaveBeenCalledWith(
        expectedDetails,
        false,
        mockDone,
        mockSaveUser
      )
    })

    it("falls back to display name when given and family names are missing", async () => {
      const displayName = "Ada Lovelace"
      delete uiProfile.name
      delete idProfile.name
      uiProfile.displayName = displayName

      await authenticate()

      const expectedDetails = {
        ...details,
        profile: {
          ...details.profile,
          name: {
            givenName: displayName,
            familyName: "",
          },
        },
      }

      expect(sso.authenticate).toHaveBeenCalledWith(
        expectedDetails,
        false,
        mockDone,
        mockSaveUser
      )
    })
  })
})
