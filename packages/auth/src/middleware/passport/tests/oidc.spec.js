describe("oidc", () => {
  describe("strategyFactory", () => {  
    // mock passport strategy factory
    jest.mock("@techpass/passport-openidconnect")
    const mockStrategy = require("@techpass/passport-openidconnect").Strategy
    
    // mock the response from .well-known/openid-configuration
    const configUrlResponse = {
      issuer: "mockIssuer",
      authorization_endpoint: "mockAuthorizationEndpoint",
      token_endpoint: "mockTokenEndpoint",
      userinfo_endpoint: "mockUserInfoEndpoint"
    }
  
    // mock the request to retrieve the oidc configuration
    jest.mock("node-fetch", () => jest.fn(() => (
      {
        ok: true,
        json: async () => configUrlResponse
      }
    )))
    const mockFetch = require("node-fetch")
  
    it("should create successfully create an oidc strategy", async () => {
      const oidc = require("../oidc")
      
      // mock the config supplied to the strategy factory
      config = {
        configUrl: "http://someconfigurl",
        clientID: "clientId",
        clientSecret: "clientSecret",
      }
      callbackUrl = "http://somecallbackurl"
  
      await oidc.strategyFactory(config, callbackUrl)
  
      expect(mockFetch).toHaveBeenCalledWith("http://someconfigurl")
      expect(mockStrategy).toHaveBeenCalledWith(
        {
          issuer: configUrlResponse.issuer,
          authorizationURL: configUrlResponse.authorization_endpoint,
          tokenURL: configUrlResponse.token_endpoint,
          userInfoURL: configUrlResponse.userinfo_endpoint,
          clientID: config.clientID,
          clientSecret: config.clientSecret,
          callbackURL: callbackUrl,
        },
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

    // parameters
    const issuer = "mockIssuer"
    const sub = "mockSub"
    const profile = {
      id: "mockId",
      _json: {
        email : "mock@budibase.com"
      }
    }
    let jwtClaims = {}  
    const accessToken = "mockAccessToken"
    const refreshToken = "mockRefreshToken"
    const idToken = "mockIdToken"
    const params = {}
    // mock the passport callback
    const mockDone = jest.fn()

    const thirdPartyUser = {
      provider: issuer,
      providerType: "oidc",
      userId: profile.id,
      profile: profile,
      email: "mock@budibase.com",
      oauth2: {
        accessToken: accessToken,
        refreshToken: refreshToken,
      },
    }

    async function doAuthenticate() {
      const oidc = require("../oidc")

      await oidc.authenticate(
        issuer,
        sub,
        profile,
        jwtClaims,
        accessToken,
        refreshToken,
        idToken,
        params,
        mockDone
      )
    }

    async function doTest() {
      await doAuthenticate()

      expect(authenticateThirdParty).toHaveBeenCalledWith(
        thirdPartyUser,
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

