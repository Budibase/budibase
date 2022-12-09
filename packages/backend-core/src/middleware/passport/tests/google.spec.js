// Mock data

const { data } = require("./utilities/mock-data")

const TENANT_ID = "default"

const googleConfig = {
  clientID: data.clientID,
  clientSecret: data.clientSecret,
}

const profile = {
  id: "mockId",
  _json: {
    email : data.email
  },
  provider: "google"
}

const user = data.buildThirdPartyUser("google", "google", profile)

describe("google", () => {
  describe("strategyFactory", () => {  
    // mock passport strategy factory
    jest.mock("passport-google-oauth")
    const mockStrategy = require("passport-google-oauth").OAuth2Strategy
  
    it("should create successfully create a google strategy", async () => {
      const google = require("../google")

      const callbackUrl = `/api/global/auth/${TENANT_ID}/google/callback`
      await google.strategyFactory(googleConfig, callbackUrl)
  
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
    afterEach(() => {
      jest.clearAllMocks();
    });

    // mock third party common authentication
    jest.mock("../third-party-common")
    const authenticateThirdParty = require("../third-party-common").authenticateThirdParty

    // mock the passport callback
    const mockDone = jest.fn()

    it("delegates authentication to third party common", async () => {
      const google = require("../google")
      const mockSaveUserFn = jest.fn()
      const authenticate = await google.buildVerifyFn(mockSaveUserFn)

      await authenticate(
        data.accessToken,
        data.refreshToken,
        profile,
        mockDone
      )

      expect(authenticateThirdParty).toHaveBeenCalledWith(
        user,
        true, 
        mockDone,
        mockSaveUserFn)
    })
  })
})

