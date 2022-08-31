jest.mock("nodemailer")
import { TestConfiguration, mocks, API } from "../../../../tests"
const sendMailMock = mocks.email.mock()
import { events } from "@budibase/backend-core"

describe("/api/global/auth", () => {
  const config = new TestConfiguration()
  const api = new API(config)

  beforeAll(async () => {
    await config.beforeAll()
  })

  afterAll(async () => {
    await config.afterAll()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it("should logout", async () => {
    await api.auth.logout()
    expect(events.auth.logout).toBeCalledTimes(1)
  })

  it("should be able to generate password reset email", async () => {
    const { res, code } = await api.auth.requestPasswordReset(sendMailMock)
    const user = await config.getUser("test@test.com")

    expect(res.body).toEqual({
      message: "Please check your email for a reset link.",
    })
    expect(sendMailMock).toHaveBeenCalled()

    expect(code).toBeDefined()
    expect(events.user.passwordResetRequested).toBeCalledTimes(1)
    expect(events.user.passwordResetRequested).toBeCalledWith(user)
  })

  it("should allow resetting user password with code", async () => {
    const { code } = await api.auth.requestPasswordReset(sendMailMock)
    const user = await config.getUser("test@test.com")
    delete user.password

    const res = await api.auth.updatePassword(code)

    expect(res.body).toEqual({ message: "password reset successfully." })
    expect(events.user.passwordReset).toBeCalledTimes(1)
    expect(events.user.passwordReset).toBeCalledWith(user)
  })

  describe("oidc", () => {
    const auth = require("@budibase/backend-core/auth")

    const passportSpy = jest.spyOn(auth.passport, "authenticate")
    let oidcConf
    let chosenConfig: any
    let configId: string

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
      expect(strategyFactory).toBeCalledWith(chosenConfig, expect.any(Function))
    })

    describe("oidc configs", () => {
      it("should load strategy and delegate to passport", async () => {
        await api.configs.getOIDCConfig(configId)

        expect(passportSpy).toBeCalledWith(mockStrategyReturn, {
          scope: ["profile", "email", "offline_access"],
        })
        expect(passportSpy.mock.calls.length).toBe(1)
      })
    })

    describe("oidc callback", () => {
      it("should load strategy and delegate to passport", async () => {
        await api.configs.OIDCCallback(configId)

        expect(passportSpy).toBeCalledWith(
          mockStrategyReturn,
          {
            successRedirect: "/",
            failureRedirect: "/error",
          },
          expect.anything()
        )
        expect(passportSpy.mock.calls.length).toBe(1)
      })
    })
  })
})
