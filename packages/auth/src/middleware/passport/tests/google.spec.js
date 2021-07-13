describe("google", () => {
  describe("strategyFactory", () => {  
    // mock passport strategy factory
    jest.mock("passport-google-oauth")
    const mockStrategy = require("passport-google-oauth").OAuth2Strategy
  
    it("should create successfully create a google strategy", async () => {
      const google = require("../google")
      
      // mock the config supplied to the strategy factory
      config = {
        callbackURL: "http://somecallbackurl",
        clientID: "clientId",
        clientSecret: "clientSecret",
      }
  
      await google.strategyFactory(config)
  
      expect(mockStrategy).toHaveBeenCalledWith(
        {
          clientID: config.clientID,
          clientSecret: config.clientSecret,
          callbackURL: config.callbackURL,
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
    const profile = {
      id: "mockId",
      _json: {
        email : "mock@budibase.com"
      },
      provider: "google"
    }
    const accessToken = "mockAccessToken"
    const refreshToken = "mockRefreshToken"
    // mock the passport callback
    const mockDone = jest.fn()

    const thirdPartyUser = {
      provider: "google",
      providerType: "google",
      userId: profile.id,
      profile: profile,
      email: "mock@budibase.com",
      oauth2: {
        accessToken: accessToken,
        refreshToken: refreshToken,
      },
    }

    it("delegates authentication to third party common", async () => {
      const google = require("../google")

      await google.authenticate(
        accessToken,
        refreshToken,
        profile,
        mockDone
      )

      expect(authenticateThirdParty).toHaveBeenCalledWith(
        thirdPartyUser,
        true, 
        mockDone)
    })
  })
})

