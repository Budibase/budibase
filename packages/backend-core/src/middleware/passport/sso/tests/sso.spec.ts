import { structures } from "../../../../../tests"
import { testEnv } from "../../../../../tests/extra"
import {
  InviteWithCode,
  SSOAuthDetails,
  SSOUser,
  User,
  UserStatus,
} from "@budibase/types"

import { HTTPError } from "../../../../errors"
import * as sso from "../sso"
import * as context from "../../../../context"
import * as events from "../../../../events"
import nock from "nock"

const mockDone = jest.fn()
const mockSaveUser = jest.fn()

jest.mock("../../../../users")
import * as _users from "../../../../users"

const users = jest.mocked(_users)

jest.mock("../../../../cache", () => ({
  ...jest.requireActual("../../../../cache"),
  invite: {
    ...jest.requireActual("../../../../cache").invite,
    getExistingInvites: jest.fn(),
    getCode: jest.fn(),
    deleteCode: jest.fn(),
  },
}))
import * as cache from "../../../../cache"

const mockInvite = cache.invite as unknown as {
  getExistingInvites: jest.Mock
  getCode: jest.Mock
  deleteCode: jest.Mock
}

jest.mock("../../../../redis/redlockImpl")
import * as _locks from "../../../../redis/redlockImpl"

const locks = jest.mocked(_locks)

const getErrorMessage = () => {
  return mockDone.mock.calls[0][2].message
}

describe("sso", () => {
  describe("authenticate", () => {
    beforeEach(() => {
      jest.clearAllMocks()
      testEnv.singleTenant()
      nock.cleanAll()
      mockInvite.getExistingInvites.mockResolvedValue([])
      locks.doWithLock.mockImplementation(async (_opts: any, fn: any) => ({
        executed: true,
        result: await fn(),
      }))
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

          // default roles for new user
          ssoUser.roles = {}

          // modified external id to match user format
          ssoUser._id = "us_" + details.userId
          delete ssoUser.userId

          // new sso user won't have a password
          delete ssoUser.password

          // new user isn't saved with rev
          delete ssoUser._rev

          // tenant id added
          ssoUser.tenantId = context.getTenantId()

          expect(mockSaveUser).toHaveBeenCalledWith(ssoUser, {
            hashPassword: false,
            requirePassword: false,
          })
          expect(mockDone).toHaveBeenCalledWith(null, ssoUser)
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

      it("does not link to an already-claimed account by email", async () => {
        // existingUser has a password set, so it is not linkable
        users.getGlobalUserByEmail.mockReturnValue(
          Promise.resolve(existingUser)
        )
        const ssoUser = structures.users.ssoUser({
          user: existingUser,
          details,
        })
        mockSaveUser.mockReturnValueOnce(ssoUser)

        await sso.authenticate(details, false, mockDone, mockSaveUser)

        // instead a brand new account keyed on the sso id is created
        expect(mockSaveUser).toHaveBeenCalledWith(
          expect.objectContaining({ _id: "us_" + details.userId }),
          expect.anything()
        )
      })

      it("rejects when a local account is required and no linkable account exists", async () => {
        users.getGlobalUserByEmail.mockReturnValueOnce(
          Promise.resolve(undefined)
        )

        await sso.authenticate(details, true, mockDone, mockSaveUser)

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
        expect(mockDone).toHaveBeenCalledWith(null, ssoUser)
      })
    })

    describe("when there is a linkable account for the email (invite already accepted)", () => {
      let existingUser: User & Partial<SSOUser>
      let details: SSOAuthDetails

      beforeEach(() => {
        existingUser = structures.users.user()
        existingUser._id = structures.uuid()
        delete existingUser.password

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

      it("links an unclaimed account (no password) on first login", async () => {
        users.getGlobalUserByEmail.mockResolvedValueOnce(existingUser)
        const ssoUser = structures.users.ssoUser({
          user: existingUser,
          details,
        })
        mockSaveUser.mockReturnValueOnce(ssoUser)

        await sso.authenticate(details, false, mockDone, mockSaveUser)

        expect(mockSaveUser).toHaveBeenCalledWith(
          expect.objectContaining({ _id: existingUser._id }),
          expect.anything()
        )
        expect(mockDone).toHaveBeenCalledWith(null, ssoUser)
      })

      it("keeps resolving the account on a later login from the same identity provider", async () => {
        // simulates the account state after a first successful login: syncUser
        // has already stamped provider/providerType onto the document
        existingUser.provider = details.provider
        existingUser.providerType = details.providerType
        users.getGlobalUserByEmail.mockResolvedValueOnce(existingUser)
        const ssoUser = structures.users.ssoUser({
          user: existingUser,
          details,
        })
        mockSaveUser.mockReturnValueOnce(ssoUser)

        await sso.authenticate(details, false, mockDone, mockSaveUser)

        expect(mockSaveUser).toHaveBeenCalledWith(
          expect.objectContaining({ _id: existingUser._id }),
          expect.anything()
        )
        expect(mockDone).toHaveBeenCalledWith(null, ssoUser)
      })

      it("does not link an account already linked via a different identity provider", async () => {
        existingUser.provider = structures.uuid()
        existingUser.providerType = details.providerType
        users.getGlobalUserByEmail.mockResolvedValueOnce(existingUser)
        const ssoUser = structures.users.ssoUser({ details })
        mockSaveUser.mockReturnValueOnce(ssoUser)

        await sso.authenticate(details, false, mockDone, mockSaveUser)

        expect(mockSaveUser).toHaveBeenCalledWith(
          expect.objectContaining({ _id: "us_" + details.userId }),
          expect.anything()
        )
      })

      it("does not link a global admin account", async () => {
        existingUser.admin = { global: true }
        users.getGlobalUserByEmail.mockResolvedValueOnce(existingUser)
        const ssoUser = structures.users.ssoUser({ details })
        mockSaveUser.mockReturnValueOnce(ssoUser)

        await sso.authenticate(details, false, mockDone, mockSaveUser)

        expect(mockSaveUser).toHaveBeenCalledWith(
          expect.objectContaining({ _id: "us_" + details.userId }),
          expect.anything()
        )
      })

      it("does not link a disabled (inactive) account", async () => {
        existingUser.status = UserStatus.INACTIVE
        users.getGlobalUserByEmail.mockResolvedValueOnce(existingUser)
        const ssoUser = structures.users.ssoUser({ details })
        mockSaveUser.mockReturnValueOnce(ssoUser)

        await sso.authenticate(details, false, mockDone, mockSaveUser)

        expect(mockSaveUser).toHaveBeenCalledWith(
          expect.objectContaining({ _id: "us_" + details.userId }),
          expect.anything()
        )
      })

      it("does not link an account with an account-portal ssoId", async () => {
        existingUser.ssoId = structures.uuid()
        users.getGlobalUserByEmail.mockResolvedValueOnce(existingUser)
        const ssoUser = structures.users.ssoUser({ details })
        mockSaveUser.mockReturnValueOnce(ssoUser)

        await sso.authenticate(details, false, mockDone, mockSaveUser)

        expect(mockSaveUser).toHaveBeenCalledWith(
          expect.objectContaining({ _id: "us_" + details.userId }),
          expect.anything()
        )
      })

      it("reconciles even when a local account would otherwise be required", async () => {
        users.getGlobalUserByEmail.mockResolvedValueOnce(existingUser)
        const ssoUser = structures.users.ssoUser({
          user: existingUser,
          details,
        })
        mockSaveUser.mockReturnValueOnce(ssoUser)

        await sso.authenticate(details, true, mockDone, mockSaveUser)

        expect(mockDone).toHaveBeenCalledWith(null, ssoUser)
      })
    })

    describe("when there is a pending invite for the email", () => {
      let details: SSOAuthDetails
      let invite: InviteWithCode
      let assignments: {
        roles: Record<string, string>
        admin: { global: boolean }
      }

      beforeEach(() => {
        details = structures.sso.authDetails()
        // no verified-email signal from the identity provider
        details.emailVerified = false

        assignments = {
          roles: { app_1: "BASIC" },
          admin: { global: false },
        }

        invite = {
          code: structures.uuid(),
          email: details.email!,
          info: { tenantId: context.getTenantId(), apps: assignments.roles },
        }

        // no match on the sso id - forces the invite fallback path
        users.getById.mockImplementationOnce(() => {
          throw new HTTPError("", 404)
        })
        users.deriveUserFieldsFromInvite.mockReturnValueOnce(assignments)

        mockInvite.getExistingInvites.mockResolvedValueOnce([invite])
        mockInvite.getCode.mockResolvedValueOnce({
          email: invite.email,
          info: invite.info,
        })
        mockInvite.deleteCode.mockResolvedValueOnce(undefined)
      })

      it("reconciles the invite without requiring a verified email, deletes it, and fires the accepted event", async () => {
        const ssoUser = structures.users.ssoUser({ details })
        mockSaveUser.mockReturnValueOnce(ssoUser)

        await sso.authenticate(details, false, mockDone, mockSaveUser)

        // the invite is matched purely on email - no account-linking lookup happens
        expect(users.getGlobalUserByEmail).not.toHaveBeenCalled()

        expect(mockSaveUser).toHaveBeenCalledWith(
          expect.objectContaining({
            _id: "us_" + details.userId,
            email: details.email,
            roles: assignments.roles,
            admin: assignments.admin,
          }),
          expect.anything()
        )

        expect(mockInvite.deleteCode).toHaveBeenCalledWith(
          invite.code,
          invite.info.tenantId
        )
        expect(events.user.inviteAccepted).toHaveBeenCalledWith(ssoUser)
        expect(mockDone).toHaveBeenCalledWith(null, ssoUser)
      })

      it("reconciles the invite even when a local account would otherwise be required", async () => {
        const ssoUser = structures.users.ssoUser({ details })
        mockSaveUser.mockReturnValueOnce(ssoUser)

        await sso.authenticate(details, true, mockDone, mockSaveUser)

        expect(mockDone).toHaveBeenCalledWith(null, ssoUser)
      })

      it("reuses the account when the same identity's own concurrent login already claimed the invite", async () => {
        // simulates a second, racing request for this exact identity
        // (e.g. a double-submitted login) losing the lock race: the
        // winner already consumed the invite and saved the account for
        // this precise third party id before we acquired the lock
        mockInvite.getCode.mockReset()
        mockInvite.getCode.mockRejectedValueOnce(new Error("invalid invite"))

        const existingUser = structures.users.user({
          _id: "us_" + details.userId,
          email: details.email,
        })
        users.getById.mockResolvedValueOnce(existingUser)

        const ssoUser = structures.users.ssoUser({
          user: existingUser,
          details,
        })
        mockSaveUser.mockReturnValueOnce(ssoUser)

        await sso.authenticate(details, false, mockDone, mockSaveUser)

        // reused via the deterministic id, never by email match
        expect(users.getGlobalUserByEmail).not.toHaveBeenCalled()
        // the winner's account is reused - no second document is created
        expect(mockSaveUser).toHaveBeenCalledWith(
          expect.objectContaining({ _id: existingUser._id }),
          expect.anything()
        )
        expect(mockInvite.deleteCode).not.toHaveBeenCalled()
        expect(events.user.inviteAccepted).not.toHaveBeenCalled()
        expect(mockDone).toHaveBeenCalledWith(null, ssoUser)
      })

      it("fails closed when the invite can no longer be validated and no concurrent claim for this identity can be confirmed", async () => {
        // covers expired/revoked invites and failed reads alike - none of
        // these are a positively identified concurrent claim, so this must
        // not fall back to linking by email or creating a fresh account
        mockInvite.getCode.mockReset()
        mockInvite.getCode.mockRejectedValueOnce(new Error("invite expired"))
        users.getById.mockImplementationOnce(() => {
          throw new HTTPError("", 404)
        })

        await sso.authenticate(details, false, mockDone, mockSaveUser)

        expect(users.getGlobalUserByEmail).not.toHaveBeenCalled()
        expect(mockSaveUser).not.toHaveBeenCalled()
        expect(mockInvite.deleteCode).not.toHaveBeenCalled()
        expect(events.user.inviteAccepted).not.toHaveBeenCalled()
        expect(mockDone.mock.calls.length).toBe(1)
        expect(getErrorMessage()).toBeDefined()
      })
    })

    describe("when there is no user and no pending invite", () => {
      it("still rejects unverified email logins when a local account is required", async () => {
        const details = structures.sso.authDetails()
        details.emailVerified = false

        users.getById.mockImplementationOnce(() => {
          throw new HTTPError("", 404)
        })

        await sso.authenticate(details, true, mockDone, mockSaveUser)

        expect(mockInvite.deleteCode).not.toHaveBeenCalled()
        expect(mockDone.mock.calls.length).toBe(1)
        expect(getErrorMessage()).toContain(
          "Email does not yet exist. You must set up your local budibase account first."
        )
      })

      it("still creates a plain new user from the login when a local account is not required", async () => {
        const details = structures.sso.authDetails()
        details.emailVerified = false

        users.getById.mockImplementationOnce(() => {
          throw new HTTPError("", 404)
        })
        const ssoUser = structures.users.ssoUser({ details })
        mockSaveUser.mockReturnValueOnce(ssoUser)

        await sso.authenticate(details, false, mockDone, mockSaveUser)

        // no invite involved - just the default, empty-access new user
        expect(mockInvite.deleteCode).not.toHaveBeenCalled()
        expect(mockSaveUser).toHaveBeenCalledWith(
          expect.objectContaining({
            _id: "us_" + details.userId,
            roles: {},
          }),
          expect.anything()
        )
        expect(mockDone).toHaveBeenCalledWith(null, ssoUser)
      })
    })
  })
})
