// Mock data

const { data } = require("./utilities/mock-data")

const issuer = "mockIssuer"
const sub = "mockSub"
const profile = {
  id: "mockId",
  _json: {
    email : data.email
  }
}
let jwtClaims = {}  
const idToken = "mockIdToken"
const params = {}

const callbackUrl = "http://somecallbackurl"

// response from .well-known/openid-configuration
const oidcConfigUrlResponse = {
  issuer: issuer,
  authorization_endpoint: "mockAuthorizationEndpoint",
  token_endpoint: "mockTokenEndpoint",
  userinfo_endpoint: "mockUserInfoEndpoint"
}

const oidcConfig = {
  configUrl: "http://someconfigurl",
  clientID: data.clientID,
  clientSecret: data.clientSecret,
}

const user = data.buildThirdPartyUser(issuer, "oidc", profile)

describe("oidc", () => {
  describe("strategyFactory", () => {  
    // mock passport strategy factory
    jest.mock("@techpass/passport-openidconnect")
    const mockStrategy = require("@techpass/passport-openidconnect").Strategy
    
    // mock the request to retrieve the oidc configuration
    jest.mock("node-fetch")
    const mockFetch = require("node-fetch")
    mockFetch.mockReturnValue({
      ok: true,
      json: () => oidcConfigUrlResponse
    })
  
    it("should create successfully create an oidc strategy", async () => {
      const oidc = require("../oidc")
  
      await oidc.strategyFactory(oidcConfig, callbackUrl)
  
      expect(mockFetch).toHaveBeenCalledWith(oidcConfig.configUrl)

      const expectedOptions = {
        issuer: oidcConfigUrlResponse.issuer,
        authorizationURL: oidcConfigUrlResponse.authorization_endpoint,
        tokenURL: oidcConfigUrlResponse.token_endpoint,
        userInfoURL: oidcConfigUrlResponse.userinfo_endpoint,
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
    afterEach(() => {
      jest.clearAllMocks();
    });

    // mock third party common authentication
    jest.mock("../third-party-common")
    const authenticateThirdParty = require("../third-party-common").authenticateThirdParty
    
    // mock the passport callback
    const mockDone = jest.fn()

    async function doAuthenticate() {
      const oidc = require("../oidc")

      await oidc.authenticate(
        issuer,
        sub,
        profile,
        jwtClaims,
        data.accessToken,
        data.refreshToken,
        idToken,
        params,
        mockDone
      )
    }

    async function doTest() {
      await doAuthenticate()

      expect(authenticateThirdParty).toHaveBeenCalledWith(
        user,
        false, 
        mockDone)
    }

    it("delegates authentication to third party common", async () => {
      doTest()
    })

    it("uses JWT email to get email", async () => {
      delete profile._json.email
      jwtClaims = {
        email : "mock@budibase.com"
      }

      doTest()
    })
  
    it("uses JWT username to get email", async () => {
      delete profile._json.email
      jwtClaims = {
        preferred_username : "mock@budibase.com"
      }

      doTest()
    })

    it("uses JWT invalid username to get email", async () => {
      delete profile._json.email

      jwtClaims = {
        preferred_username : "invalidUsername"
      }

      await expect(doAuthenticate()).rejects.toThrow("Could not determine user email from profile");
    })
  
  })
})

