jest.mock("nodemailer")
const { config, request, mocks, structures } = require("../../../tests")
const sendMailMock = mocks.email.mock()
const { events } = require("@budibase/backend-core")

const TENANT_ID = structures.TENANT_ID

describe("/api/global/auth", () => {

  beforeAll(async () => {
    await config.beforeAll()
  })

  afterAll(async () => {
    await config.afterAll()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  const requestPasswordReset = async () => {
    await config.saveSmtpConfig()
    await config.saveSettingsConfig()
    await config.createUser()
    const res = await request
      .post(`/api/global/auth/${TENANT_ID}/reset`)
      .send({
        email: "test@test.com",
      })
      .expect("Content-Type", /json/)
      .expect(200)
    const emailCall = sendMailMock.mock.calls[0][0]
    const parts = emailCall.html.split(`http://localhost:10000/builder/auth/reset?code=`)
    const code = parts[1].split("\"")[0].split("&")[0]
    return { code, res }
  }

  it("should logout", async () => {
    await request
      .post("/api/global/auth/logout")
      .set(config.defaultHeaders())
      .expect(200)
    expect(events.auth.logout).toBeCalledTimes(1)
  })

  it("should be able to generate password reset email", async () => {
    const { res, code } = await requestPasswordReset()
    const user = await config.getUser("test@test.com")

    expect(res.body).toEqual({ message: "Please check your email for a reset link." })
    expect(sendMailMock).toHaveBeenCalled()
    
    expect(code).toBeDefined()
    expect(events.user.passwordResetRequested).toBeCalledTimes(1)
    expect(events.user.passwordResetRequested).toBeCalledWith(user)
  })

  it("should allow resetting user password with code", async () => {
    const { code } = await requestPasswordReset()
    const user = await config.getUser("test@test.com")
    delete user.password 

    const res = await request
      .post(`/api/global/auth/${TENANT_ID}/reset/update`)
      .send({
        password: "newpassword",
        resetCode: code,
      })
      .expect("Content-Type", /json/)
      .expect(200)
    expect(res.body).toEqual({ message: "password reset successfully." })
    expect(events.user.passwordReset).toBeCalledTimes(1)
    expect(events.user.passwordReset).toBeCalledWith(user)
  })

  describe("oidc", () => {
    const auth = require("@budibase/backend-core/auth")

    const passportSpy = jest.spyOn(auth.passport, "authenticate")
    let oidcConf
    let chosenConfig
    let configId

    // mock the oidc strategy implementation and return value
    let strategyFactory = jest.fn()
    let mockStrategyReturn = jest.fn()
    let mockStrategyConfig = jest.fn()
    auth.oidc.fetchStrategyConfig = mockStrategyConfig
    
    strategyFactory.mockReturnValue(mockStrategyReturn)
    auth.oidc.strategyFactory = strategyFactory

    beforeEach(async () => {
      oidcConf = await config.saveOIDCConfig()
      chosenConfig = oidcConf.config.configs[0]
      configId = chosenConfig.uuid
      mockStrategyConfig.mockReturnValue(chosenConfig)
    })

    afterEach(() => {
      expect(strategyFactory).toBeCalledWith(
        chosenConfig, 
        expect.any(Function)
      )
    })

    describe("oidc configs", () => {
      it("should load strategy and delegate to passport", async () => {
        await request.get(`/api/global/auth/${TENANT_ID}/oidc/configs/${configId}`)

        expect(passportSpy).toBeCalledWith(mockStrategyReturn, {
          scope: ["profile", "email", "offline_access"]
        })
        expect(passportSpy.mock.calls.length).toBe(1);
      })
    })

    describe("oidc callback", () => {
      it("should load strategy and delegate to passport", async () => {
        await request.get(`/api/global/auth/${TENANT_ID}/oidc/callback`)
                     .set(config.getOIDConfigCookie(configId))
      
        expect(passportSpy).toBeCalledWith(mockStrategyReturn, {
          successRedirect: "/", failureRedirect: "/error" 
        }, expect.anything())
        expect(passportSpy.mock.calls.length).toBe(1);
      })
    })

  })
})
