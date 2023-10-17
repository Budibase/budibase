import { structures, mocks } from "../../../../../tests"
import { testEnv } from "../../../../../tests/extra"
import { SSOAuthDetails, User } from "@budibase/types"

import { HTTPError } from "../../../../errors"
import * as sso from "../sso"
import * as context from "../../../../context"

const mockDone = jest.fn()
const mockSaveUser = jest.fn()

jest.mock("../../../../users")
import * as _users from "../../../../users"
const users = jest.mocked(_users)

const getErrorMessage = () => {
  return mockDone.mock.calls[0][2].message
}

describe("sso", () => {
  describe("authenticate", () => {
    beforeEach(() => {
      jest.clearAllMocks()
      testEnv.singleTenant()
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

    function mockGetProfilePicture() {
      mocks.fetch.mockReturnValueOnce(
        Promise.resolve({
          status: 200,
          headers: { get: () => "image/" },
        })
      )
    }

    describe("when the user doesn't exist", () => {
      let user: User
      let details: SSOAuthDetails

      beforeEach(() => {
        users.getById.mockImplementationOnce(() => {
          throw new HTTPError("", 404)
        })
        mockGetProfilePicture()

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

          expect(mockSaveUser).toBeCalledWith(ssoUser, {
            hashPassword: false,
            requirePassword: false,
          })
          expect(mockDone).toBeCalledWith(null, ssoUser)
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
        mockGetProfilePicture()
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

          expect(mockSaveUser).toBeCalledWith(ssoUser, {
            hashPassword: false,
            requirePassword: false,
          })
          expect(mockDone).toBeCalledWith(null, ssoUser)
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

          expect(mockSaveUser).toBeCalledWith(ssoUser, {
            hashPassword: false,
            requirePassword: false,
          })
          expect(mockDone).toBeCalledWith(null, ssoUser)
        })
      })
    })
  })
})
