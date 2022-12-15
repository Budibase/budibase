jest.mock("nodemailer")
import { TestConfiguration, mocks } from "../../../../tests"
const sendMailMock = mocks.email.mock()
import { events } from "@budibase/backend-core"

const expectSetAuthCookie = (res: any) => {
  expect(
    res.get("Set-Cookie").find((c: string) => c.startsWith("budibase:auth"))
  ).toBeDefined()
}

describe("/api/global/auth", () => {
  const config = new TestConfiguration()

  beforeAll(async () => {
    await config.beforeAll()
  })

  afterAll(async () => {
    await config.afterAll()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe("password", () => {
    describe("POST /api/global/auth/:tenantId/login", () => {
      it("should login", () => {})
    })

    describe("POST /api/global/auth/logout", () => {
      it("should logout", async () => {
        await config.api.auth.logout()
        expect(events.auth.logout).toBeCalledTimes(1)

        // TODO: Verify sessions deleted
      })
    })

    describe("POST /api/global/auth/:tenantId/reset", () => {
      it("should generate password reset email", async () => {
        const { res, code } = await config.api.auth.requestPasswordReset(
          sendMailMock
        )
        const user = await config.getUser("test@test.com")

        expect(res.body).toEqual({
          message: "Please check your email for a reset link.",
        })
        expect(sendMailMock).toHaveBeenCalled()

        expect(code).toBeDefined()
        expect(events.user.passwordResetRequested).toBeCalledTimes(1)
        expect(events.user.passwordResetRequested).toBeCalledWith(user)
      })
    })

    describe("POST /api/global/auth/:tenantId/reset/update", () => {
      it("should reset password", async () => {
        const { code } = await config.api.auth.requestPasswordReset(
          sendMailMock
        )
        const user = await config.getUser("test@test.com")
        delete user.password

        const res = await config.api.auth.updatePassword(code)

        expect(res.body).toEqual({ message: "password reset successfully." })
        expect(events.user.passwordReset).toBeCalledTimes(1)
        expect(events.user.passwordReset).toBeCalledWith(user)

        // TODO: Login using new password
      })
    })
  })

  describe("init", () => {
    describe("POST /api/global/auth/init", () => {})

    describe("GET /api/global/auth/init", () => {})
  })

  describe("datasource", () => {
    // MULTI TENANT

    describe("GET /api/global/auth/:tenantId/datasource/:provider", () => {})

    describe("GET /api/global/auth/:tenantId/datasource/:provider/callback", () => {})

    // SINGLE TENANT

    describe("GET /api/global/auth/datasource/:provider/callback", () => {})
  })

  describe("google", () => {
    // MULTI TENANT

    describe("GET /api/global/auth/:tenantId/google", () => {})

    describe("GET /api/global/auth/:tenantId/google/callback", () => {})

    // SINGLE TENANT

    describe("GET /api/global/auth/google/callback", () => {})

    describe("GET /api/admin/auth/google/callback", () => {})
  })

  describe("oidc", () => {
    beforeEach(async () => {
      jest.clearAllMocks()
      mockGetWellKnownConfig()

      // see: __mocks__/oauth
      // for associated mocking inside passport
    })

    const generateOidcConfig = async () => {
      const oidcConf = await config.saveOIDCConfig()
      const chosenConfig = oidcConf.config.configs[0]
      return chosenConfig.uuid
    }

    const mockGetWellKnownConfig = () => {
      mocks.fetch.mockReturnValue({
        ok: true,
        json: () => ({
          issuer: "test",
          authorization_endpoint: "http://localhost/auth",
          token_endpoint: "http://localhost/token",
          userinfo_endpoint: "http://localhost/userinfo",
        }),
      })
    }

    // MULTI TENANT
    describe("GET /api/global/auth/:tenantId/oidc/configs/:configId", () => {
      it("redirects to auth provider", async () => {
        const configId = await generateOidcConfig()

        const res = await config.api.configs.getOIDCConfig(configId)

        expect(res.status).toBe(302)
        const location: string = res.get("location")
        expect(
          location.startsWith(
            "http://localhost/auth?response_type=code&client_id=clientId&redirect_uri=http%3A%2F%2Flocalhost%3A10000%2Fapi%2Fglobal%2Fauth%2Fdefault%2Foidc%2Fcallback&scope=openid%20profile%20email%20offline_access"
          )
        ).toBe(true)
      })
    })

    describe("GET /api/global/auth/:tenantId/oidc/callback", () => {
      it("logs in", async () => {
        const configId = await generateOidcConfig()
        const preAuthRes = await config.api.configs.getOIDCConfig(configId)

        const res = await config.api.configs.OIDCCallback(configId, preAuthRes)

        expect(events.auth.login).toBeCalledWith("oidc")
        expect(events.auth.login).toBeCalledTimes(1)
        expect(res.status).toBe(302)
        const location: string = res.get("location")
        expect(location).toBe("/")
        expectSetAuthCookie(res)
      })
    })

    // SINGLE TENANT

    describe("GET /api/global/auth/oidc/callback", () => {})

    describe("GET /api/global/auth/oidc/callback", () => {})

    describe("GET /api/admin/auth/oidc/callback", () => {})
  })
})
