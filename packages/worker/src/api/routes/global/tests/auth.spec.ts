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
import nock from "nock"
import * as jwt from "jsonwebtoken"

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
        const email = config.user!.email!
        const password = config.userPassword

        const response = await config.api.auth.login(tenantId, email, password)

        expectSetAuthCookie(response)
        expect(events.auth.login).toHaveBeenCalledTimes(1)
      })

      it("should return 403 with incorrect credentials", async () => {
        const tenantId = config.tenantId!
        const email = config.user!.email!
        const password = "incorrect123"

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
        const email = "invaliduser@example.com"
        const password = "password123!"

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
        expect(events.auth.logout).toHaveBeenCalledTimes(1)

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
        expect(events.user.passwordResetRequested).toHaveBeenCalledTimes(1)
        expect(events.user.passwordResetRequested).toHaveBeenCalledWith(user)
      })

      describe("sso user", () => {
        let user: User

        async function testSSOUser() {
          await config.api.auth.requestPasswordReset(sendMailMock, user.email)
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

        const newPassword = "newpassword1"
        const res = await config.api.auth.updatePassword(code!, newPassword)

        user = (await config.getUser(user.email))!
        delete user.password

        expect(res.body).toEqual({ message: "password reset successfully." })
        expect(events.user.passwordReset).toHaveBeenCalledTimes(1)
        expect(events.user.passwordReset).toHaveBeenCalledWith(user)

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
            message: "Password change is disabled for this user",
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
            const account: CloudAccount = {
              ...structures.accounts.ssoAccount(),
              budibaseUserId: "budibaseUserId",
              email: user.email,
            }
            mocks.accounts.getAccountByTenantId.mockReturnValueOnce(
              Promise.resolve(account)
            )

            await testSSOUser(code!)
          })
        })
      })
    })
  })

  describe("oidc", () => {
    afterEach(() => {
      nock.cleanAll()
    })

    const generateOidcConfig = async () => {
      const oidcConf = await config.saveOIDCConfig()
      const chosenConfig = oidcConf.config.configs[0]
      return chosenConfig.uuid
    }

    // MULTI TENANT
    describe("GET /api/global/auth/:tenantId/oidc/configs/:configId", () => {
      it("redirects to auth provider", async () => {
        nock("http://someconfigurl").get("/").times(1).reply(200, {
          issuer: "test",
          authorization_endpoint: "http://example.com/auth",
          token_endpoint: "http://example.com/token",
          userinfo_endpoint: "http://example.com/userinfo",
        })

        const configId = await generateOidcConfig()

        const res = await config.api.configs.getOIDCConfig(configId)

        expect(res.status).toBe(302)
        const location: string = res.get("location")
        expect(
          location.startsWith(
            `http://example.com/auth?response_type=code&client_id=clientId&redirect_uri=http%3A%2F%2Flocalhost%3A10000%2Fapi%2Fglobal%2Fauth%2F${config.tenantId}%2Foidc%2Fcallback&scope=openid%20profile%20email%20offline_access`
          )
        ).toBe(true)
      })
    })

    describe("GET /api/global/auth/:tenantId/oidc/callback", () => {
      it("logs in", async () => {
        const email = `${generator.guid()}@example.com`

        nock("http://someconfigurl").get("/").times(2).reply(200, {
          issuer: "test",
          authorization_endpoint: "http://example.com/auth",
          token_endpoint: "http://example.com/token",
          userinfo_endpoint: "http://example.com/userinfo",
        })

        const token = jwt.sign(
          {
            iss: "test",
            sub: "sub",
            aud: "clientId",
            exp: Math.floor(Date.now() / 1000) + 60 * 60,
            email,
          },
          "secret"
        )

        nock("http://example.com").post("/token").reply(200, {
          access_token: "access",
          refresh_token: "refresh",
          id_token: token,
        })

        nock("http://example.com").get("/userinfo?schema=openid").reply(200, {
          sub: "sub",
          email,
        })

        const configId = await generateOidcConfig()
        const preAuthRes = await config.api.configs.getOIDCConfig(configId)
        const res = await config.api.configs.OIDCCallback(configId, preAuthRes)
        if (res.status > 399) {
          throw new Error(
            `OIDC callback failed with status ${res.status}: ${res.text}`
          )
        }

        expect(events.auth.login).toHaveBeenCalledWith("oidc", email)
        expect(events.auth.login).toHaveBeenCalledTimes(1)
        expect(res.status).toBe(302)
        const location: string = res.get("location")
        expect(location).toBe("/")
        expectSetAuthCookie(res)
      })
    })
  })
})
