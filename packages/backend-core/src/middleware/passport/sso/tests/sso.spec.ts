import { structures } from "../../../../../tests"
import { testEnv } from "../../../../../tests/extra"
import { SSOAuthDetails, User } from "@budibase/types"

import { HTTPError } from "../../../../errors"
import * as sso from "../sso"
import * as context from "../../../../context"
import nock from "nock"

const mockDone = jest.fn()
const mockSaveUser = jest.fn()

jest.mock("../../../../users")
import * as _users from "../../../../users"

const users = jest.mocked(_users)

const getErrorMessage = () => {
  return mockDone.mock.calls[0][2].message
}

const getIdentity = (details: SSOAuthDetails) => ({
  provider: details.provider,
  providerType: details.providerType,
  userId: details.userId,
})

describe("sso", () => {
  describe("authenticate", () => {
    beforeEach(() => {
      jest.clearAllMocks()
      testEnv.singleTenant()
      nock.cleanAll()
    })

    describe("validation", () => {
      const testValidation = async (
        details: SSOAuthDetails,
        message: string
      ) => {
        await sso.authenticate(details, false, mockDone, mockSaveUser)

        expect(mockDone.mock.calls.length).toBe(1)
        expect(getErrorMessage()).toContain(message)
      }

      it("user id fails", async () => {
        const details = structures.sso.authDetails()
        details.userId = undefined!

        await testValidation(details, "sso user id required")
      })

      it("email fails", async () => {
        const details = structures.sso.authDetails()
        details.email = undefined!

        await testValidation(details, "sso user email required")
      })
    })

    describe("when the user doesn't exist", () => {
      let user: User
      let details: SSOAuthDetails

      beforeEach(() => {
        users.getById.mockImplementationOnce(() => {
          throw new HTTPError("", 404)
        })

        nock("http://example.com").get("/").reply(200, undefined, {
          "Content-Type": "image/png",
        })

        user = structures.users.user()
        delete user._rev
        delete user._id

        details = structures.sso.authDetails(user)
        details.userId = structures.uuid()
      })

      describe("when a local account is required", () => {
        it("returns an error message", async () => {
          const details = structures.sso.authDetails()

          await sso.authenticate(details, true, mockDone, mockSaveUser)

          expect(mockDone.mock.calls.length).toBe(1)
          expect(getErrorMessage()).toContain(
            "Email does not yet exist. You must set up your local budibase account first."
          )
        })
      })

      describe("when a local account isn't required", () => {
        it("creates and authenticates the user", async () => {
          const ssoUser = structures.users.ssoUser({ user, details })
          mockSaveUser.mockReturnValueOnce(ssoUser)

          await sso.authenticate(details, false, mockDone, mockSaveUser)

          expect(mockSaveUser).toHaveBeenCalledWith(
            expect.objectContaining({
              _id: expect.stringMatching(/^us_[a-f0-9]{64}$/),
              email: details.email,
              roles: {},
              tenantId: context.getTenantId(),
              ssoIdentities: [getIdentity(details)],
            }),
            {
              hashPassword: false,
              requirePassword: false,
            }
          )
          expect(mockDone).toHaveBeenCalledWith(null, ssoUser)
        })

        it("uses different user ids for equal subjects from different issuers", async () => {
          const firstDetails = {
            ...details,
            provider: "https://one.example.com",
          }
          const secondDetails = {
            ...details,
            provider: "https://two.example.com",
          }
          mockSaveUser
            .mockImplementationOnce(user => Promise.resolve(user))
            .mockImplementationOnce(user => Promise.resolve(user))

          await sso.authenticate(firstDetails, false, mockDone, mockSaveUser)
          await sso.authenticate(secondDetails, false, mockDone, mockSaveUser)

          expect(mockSaveUser.mock.calls[0][0]._id).not.toEqual(
            mockSaveUser.mock.calls[1][0]._id
          )
        })
      })
    })

    describe("when the user exists", () => {
      let existingUser: User
      let details: SSOAuthDetails

      beforeEach(() => {
        existingUser = structures.users.user()
        existingUser._id = structures.uuid()
        details = structures.sso.authDetails(existingUser)
        existingUser.ssoIdentities = [getIdentity(details)]
        nock("http://example.com").get("/").reply(200, undefined, {
          "Content-Type": "image/png",
        })
      })

      describe("exists by email", () => {
        beforeEach(() => {
          users.getById.mockImplementationOnce(() => {
            throw new HTTPError("", 404)
          })
          users.getGlobalUserByEmail.mockReturnValueOnce(
            Promise.resolve(existingUser)
          )
        })

        it("syncs and authenticates the user", async () => {
          const ssoUser = structures.users.ssoUser({
            user: existingUser,
            details,
          })
          mockSaveUser.mockReturnValueOnce(ssoUser)

          await sso.authenticate(details, true, mockDone, mockSaveUser)

          // roles preserved
          ssoUser.roles = existingUser.roles

          // existing id preserved
          ssoUser._id = existingUser._id

          expect(mockSaveUser).toHaveBeenCalledWith(ssoUser, {
            hashPassword: false,
            requirePassword: false,
          })
          expect(mockDone).toHaveBeenCalledWith(null, ssoUser)
        })
      })

      describe("exists by id", () => {
        beforeEach(() => {
          users.getById.mockReturnValueOnce(Promise.resolve(existingUser))
        })

        it("syncs and authenticates the user", async () => {
          const ssoUser = structures.users.ssoUser({
            user: existingUser,
            details,
          })
          mockSaveUser.mockReturnValueOnce(ssoUser)

          await sso.authenticate(details, true, mockDone, mockSaveUser)

          // roles preserved
          ssoUser.roles = existingUser.roles

          // existing id preserved
          ssoUser._id = existingUser._id

          expect(mockSaveUser).toHaveBeenCalledWith(ssoUser, {
            hashPassword: false,
            requirePassword: false,
          })
          expect(mockDone).toHaveBeenCalledWith(null, ssoUser)
        })
      })

      describe("exists by stored SSO identity", () => {
        beforeEach(() => {
          users.getGlobalUserBySSOIdentity.mockReturnValueOnce(
            Promise.resolve(existingUser)
          )
        })

        it("syncs and authenticates the bound user", async () => {
          const ssoUser = structures.users.ssoUser({
            user: existingUser,
            details,
          })
          mockSaveUser.mockReturnValueOnce(ssoUser)

          await sso.authenticate(details, true, mockDone, mockSaveUser)

          expect(users.getGlobalUserBySSOIdentity).toHaveBeenCalledWith(
            getIdentity(details)
          )
          expect(mockSaveUser).toHaveBeenCalledWith(
            expect.objectContaining({ _id: existingUser._id }),
            expect.anything()
          )
          expect(mockDone).toHaveBeenCalledWith(null, ssoUser)
        })
      })
    })

    describe("when the email is not verified", () => {
      let existingUser: User
      let details: SSOAuthDetails

      beforeEach(() => {
        existingUser = structures.users.user()
        existingUser._id = structures.uuid()

        details = structures.sso.authDetails(existingUser)
        details.emailVerified = false

        // no match on the sso id - forces the email fallback path
        users.getById.mockImplementationOnce(() => {
          throw new HTTPError("", 404)
        })
        nock("http://example.com").get("/").reply(200, undefined, {
          "Content-Type": "image/png",
        })
      })

      it("does not link to an existing account by email", async () => {
        users.getGlobalUserByEmail.mockReturnValueOnce(
          Promise.resolve(existingUser)
        )
        await sso.authenticate(details, false, mockDone, mockSaveUser)

        expect(users.getGlobalUserByEmail).toHaveBeenCalled()
        expect(mockSaveUser).not.toHaveBeenCalled()
        expect(getErrorMessage()).toContain(
          "SSO identity cannot be linked to existing user"
        )
      })

      it("rejects when a local account is required", async () => {
        await sso.authenticate(details, true, mockDone, mockSaveUser)

        expect(users.getGlobalUserByEmail).toHaveBeenCalled()
        expect(mockDone.mock.calls.length).toBe(1)
        expect(getErrorMessage()).toContain(
          "Email does not yet exist. You must set up your local budibase account first."
        )
      })

      it("links by email when unverified linking is explicitly allowed", async () => {
        users.getGlobalUserByEmail.mockReturnValueOnce(
          Promise.resolve(existingUser)
        )
        const ssoUser = structures.users.ssoUser({
          user: existingUser,
          details,
        })
        mockSaveUser.mockReturnValueOnce(ssoUser)

        await sso.authenticate(details, false, mockDone, mockSaveUser, true)

        expect(users.getGlobalUserByEmail).toHaveBeenCalled()
        expect(mockSaveUser).toHaveBeenCalledWith(
          expect.objectContaining({
            ssoIdentities: [getIdentity(details)],
          }),
          expect.anything()
        )
        expect(mockDone).toHaveBeenCalledWith(null, ssoUser)
      })

      it("migrates a user previously linked to the same issuer", async () => {
        Object.assign(existingUser, {
          provider: details.provider,
          providerType: details.providerType,
        })
        users.getGlobalUserByEmail.mockReturnValueOnce(
          Promise.resolve(existingUser)
        )
        const ssoUser = structures.users.ssoUser({
          user: existingUser,
          details,
        })
        mockSaveUser.mockReturnValueOnce(ssoUser)

        await sso.authenticate(details, false, mockDone, mockSaveUser)

        expect(mockSaveUser).toHaveBeenCalledWith(
          expect.objectContaining({
            _id: existingUser._id,
            ssoIdentities: [getIdentity(details)],
          }),
          expect.anything()
        )
        expect(mockDone).toHaveBeenCalledWith(null, ssoUser)
      })

      it("does not migrate a user linked to a different issuer", async () => {
        Object.assign(existingUser, {
          provider: "https://different-issuer.example.com",
          providerType: details.providerType,
        })
        users.getGlobalUserByEmail.mockReturnValueOnce(
          Promise.resolve(existingUser)
        )

        await sso.authenticate(details, false, mockDone, mockSaveUser)

        expect(mockSaveUser).not.toHaveBeenCalled()
        expect(getErrorMessage()).toContain(
          "SSO identity cannot be linked to existing user"
        )
      })
    })
  })
})
