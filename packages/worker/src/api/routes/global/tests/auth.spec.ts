import { CloudAccount, SSOUser, User } from "@budibase/types"

jest.mock("nodemailer")
import {
  TestConfiguration,
  mocks,
  structures,
  generator,
} from "../../../../tests"
const sendMailMock = mocks.email.mock()
import { events, constants } from "@budibase/backend-core"
import { Response } from "superagent"

import * as userSdk from "../../../../sdk/users"

function getAuthCookie(response: Response) {
  return response.headers["set-cookie"]
    .find((s: string) => s.startsWith(`${constants.Cookie.Auth}=`))
    .split("=")[1]
    .split(";")[0]
}

const expectSetAuthCookie = (response: Response) => {
  expect(getAuthCookie(response).length > 1).toBe(true)
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

  async function createSSOUser() {
    return config.doInTenant(async () => {
      return userSdk.db.save(structures.users.ssoUser(), {
        requirePassword: false,
      })
    })
  }

  describe("password", () => {
    describe("POST /api/global/auth/:tenantId/login", () => {
      it("logs in with correct credentials", async () => {
        const tenantId = config.tenantId!
        const email = config.user?.email!
        const password = config.userPassword

        const response = await config.api.auth.login(tenantId, email, password)

        expectSetAuthCookie(response)
        expect(events.auth.login).toBeCalledTimes(1)
      })

      it("should return 403 with incorrect credentials", async () => {
        const tenantId = config.tenantId!
        const email = config.user?.email!
        const password = "incorrect"

        const response = await config.api.auth.login(
          tenantId,
          email,
          password,
          { status: 403 }
        )
        expect(response.body).toEqual({
          message: "Invalid credentials",
          status: 403,
        })
      })

      it("should return 403 when user doesn't exist", async () => {
        const tenantId = config.tenantId!
        const email = "invaliduser@test.com"
        const password = "password"

        const response = await config.api.auth.login(
          tenantId,
          email,
          password,
          { status: 403 }
        )
        expect(response.body).toEqual({
          message: "Invalid credentials",
          status: 403,
        })
      })

      describe("sso user", () => {
        let user: User

        async function testSSOUser() {
          const tenantId = user.tenantId!
          const email = user.email
          const password = "test"

          const response = await config.api.auth.login(
            tenantId,
            email,
            password,
            { status: 403 }
          )

          expect(response.body).toEqual({
            message: "Invalid credentials",
            status: 403,
          })
        }

        describe("budibase sso user", () => {
          it("should prevent user from logging in", async () => {
            user = await createSSOUser()
            await testSSOUser()
          })
        })

        describe("root account sso user", () => {
          it("should prevent user from logging in", async () => {
            user = await config.createUser()
            const account = structures.accounts.ssoAccount() as CloudAccount
            account.email = user.email
            mocks.accounts.getAccountByTenantId.mockResolvedValueOnce(account)

            await testSSOUser()
          })
        })
      })
    })

    describe("POST /api/global/auth/logout", () => {
      it("should logout", async () => {
        const response = await config.api.auth.logout()
        expect(events.auth.logout).toBeCalledTimes(1)

        const authCookie = getAuthCookie(response)
        expect(authCookie).toBe("")
      })
    })

    describe("POST /api/global/auth/:tenantId/reset", () => {
      it("should generate password reset email", async () => {
        const user = await config.createUser()

        const { res, code } = await config.api.auth.requestPasswordReset(
          sendMailMock,
          user.email
        )

        expect(res.body).toEqual({
          message: "Please check your email for a reset link.",
        })
        expect(sendMailMock).toHaveBeenCalled()
        expect(code).toBeDefined()
        expect(events.user.passwordResetRequested).toBeCalledTimes(1)
        expect(events.user.passwordResetRequested).toBeCalledWith(user)
      })

      describe("sso user", () => {
        let user: User

        async function testSSOUser() {
          const { res } = await config.api.auth.requestPasswordReset(
            sendMailMock,
            user.email
          )
          expect(sendMailMock).not.toHaveBeenCalled()
        }

        describe("budibase sso user", () => {
          it("should prevent user from generating password reset email", async () => {
            user = await createSSOUser()
            await testSSOUser()
          })
        })

        describe("root account sso user", () => {
          it("should prevent user from generating password reset email", async () => {
            user = await config.createUser(structures.users.user())
            const account = structures.accounts.ssoAccount() as CloudAccount
            account.email = user.email
            mocks.accounts.getAccountByTenantId.mockResolvedValueOnce(account)

            await testSSOUser()
          })
        })
      })
    })

    describe("POST /api/global/auth/:tenantId/reset/update", () => {
      it("should reset password", async () => {
        let user = await config.createUser()
        const { code } = await config.api.auth.requestPasswordReset(
          sendMailMock,
          user.email
        )
        delete user.password

        const newPassword = "newpassword"
        const res = await config.api.auth.updatePassword(code!, newPassword)

        user = (await config.getUser(user.email))!
        delete user.password

        expect(res.body).toEqual({ message: "password reset successfully." })
        expect(events.user.passwordReset).toBeCalledTimes(1)
        expect(events.user.passwordReset).toBeCalledWith(user)

        // login using new password
        await config.api.auth.login(user.tenantId, user.email, newPassword)
      })

      describe("sso user", () => {
        let user: User | SSOUser

        async function testSSOUser(code: string) {
          const res = await config.api.auth.updatePassword(
            code!,
            generator.string(),
            { status: 400 }
          )

          expect(res.body).toEqual({
            message: "Cannot reset password.",
            status: 400,
          })
        }

        describe("budibase sso user", () => {
          it("should prevent user from generating password reset email", async () => {
            user = await config.createUser()
            const { code } = await config.api.auth.requestPasswordReset(
              sendMailMock,
              user.email
            )

            // convert to sso now that password reset has been requested
            const ssoUser = user as SSOUser
            ssoUser.providerType = structures.sso.providerType()
            delete ssoUser.password
            await config.doInTenant(() => userSdk.db.save(ssoUser))

            await testSSOUser(code!)
          })
        })

        describe("root account sso user", () => {
          it("should prevent user from generating password reset email", async () => {
            user = await config.createUser()
            const { code } = await config.api.auth.requestPasswordReset(
              sendMailMock,
              user.email
            )

            // convert to account owner now that password has been requested
            const account = structures.accounts.ssoAccount() as CloudAccount
            mocks.accounts.getAccount.mockReturnValueOnce(
              Promise.resolve(account)
            )

            await testSSOUser(code!)
          })
        })
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
            `http://localhost/auth?response_type=code&client_id=clientId&redirect_uri=http%3A%2F%2Flocalhost%3A10000%2Fapi%2Fglobal%2Fauth%2F${config.tenantId}%2Foidc%2Fcallback&scope=openid%20profile%20email%20offline_access`
          )
        ).toBe(true)
      })
    })

    describe("GET /api/global/auth/:tenantId/oidc/callback", () => {
      it("logs in", async () => {
        const configId = await generateOidcConfig()
        const preAuthRes = await config.api.configs.getOIDCConfig(configId)

        const res = await config.api.configs.OIDCCallback(configId, preAuthRes)

        expect(events.auth.login).toBeCalledWith("oidc", "oauth@example.com")
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
