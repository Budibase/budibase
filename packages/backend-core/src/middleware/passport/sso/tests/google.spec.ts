import { generator, structures } from "../../../../../tests"
import { SSOProviderType } from "@budibase/types"

jest.mock("passport-google-oauth")
const mockStrategy = require("passport-google-oauth").OAuth2Strategy

jest.mock("../sso")
import * as _sso from "../sso"
const sso = jest.mocked(_sso)

const mockSaveUserFn = jest.fn()
const mockDone = jest.fn()

import * as google from "../google"

describe("google", () => {
  describe("strategyFactory", () => {
    const googleConfig = structures.sso.googleConfig()
    const callbackUrl = generator.url()

    it("should create successfully create a google strategy", async () => {
      await google.strategyFactory(googleConfig, callbackUrl, mockSaveUserFn)

      const expectedOptions = {
        clientID: googleConfig.clientID,
        clientSecret: googleConfig.clientSecret,
        callbackURL: callbackUrl,
      }

      expect(mockStrategy).toHaveBeenCalledWith(
        expectedOptions,
        expect.anything()
      )
    })
  })

  describe("authenticate", () => {
    const details = structures.sso.authDetails()
    details.provider = "google"
    details.providerType = SSOProviderType.GOOGLE

    const profile = details.profile!
    profile.provider = "google"

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("delegates authentication to third party common", async () => {
      const authenticate = await google.buildVerifyFn(mockSaveUserFn)

      await authenticate(
        details.oauth2.accessToken,
        details.oauth2.refreshToken!,
        profile,
        mockDone
      )

      expect(sso.authenticate).toHaveBeenCalledWith(
        details,
        true,
        mockDone,
        mockSaveUserFn
      )
    })
  })
})
