import { SSOAuthDetails, SSOProviderType, User } from "@budibase/types"
import { DBTestConfiguration, structures } from "../../../../../tests"
import { UserDB } from "../../../../users/db"
import { EmailUnavailableError } from "../../../../errors"
import { authenticate } from "../sso"

const config = new DBTestConfiguration()

describe("SSO linking with persisted users", () => {
  beforeAll(() => {
    UserDB.init(
      {
        addUsers: async (_change, _creatorsChange, callback) => callback?.(),
        removeUsers: jest.fn(),
      },
      {
        addUsers: jest.fn(),
        getBulk: async () => [],
        getGroupBuilderAppIds: async () => [],
      },
      { isSSOEnforced: async () => true }
    )
  })

  const createAcceptedInviteAccount = async () => {
    // An auto-accepted invite leaves a local account without an SSO subject.
    const user: User = {
      email: `${structures.uuid()}@example.com`,
      tenantId: config.getTenantId(),
      roles: { app_test: "BASIC" },
      builder: { apps: ["app_test"] },
    }
    return UserDB.save(user, { requirePassword: false })
  }

  it.each([
    { emailVerified: false, allowUnverifiedEmailLinking: true },
    { emailVerified: true, allowUnverifiedEmailLinking: false },
  ])(
    "preserves the invited account on first and repeat logins (verified: $emailVerified, opt-in: $allowUnverifiedEmailLinking)",
    async ({ emailVerified, allowUnverifiedEmailLinking }) => {
      await config.doInTenant(async () => {
        const invitedUser = await createAcceptedInviteAccount()
        const details: SSOAuthDetails = {
          email: invitedUser.email,
          userId: structures.uuid(),
          provider: structures.uuid(),
          providerType: SSOProviderType.OIDC,
          emailVerified,
          oauth2: structures.sso.OAuth(),
        }
        const done = jest.fn()

        for (let login = 0; login < 2; login++) {
          await authenticate(
            details,
            false,
            done,
            UserDB.save,
            allowUnverifiedEmailLinking
          )
        }

        expect(done).toHaveBeenCalledTimes(2)
        for (let login = 1; login <= 2; login++) {
          expect(done).toHaveBeenNthCalledWith(
            login,
            null,
            expect.objectContaining({
              _id: invitedUser._id,
              roles: invitedUser.roles,
              builder: invitedUser.builder,
              provider: details.provider,
            })
          )
        }
        expect(await UserDB.getUserByEmail(invitedUser.email)).toEqual(
          expect.objectContaining({
            _id: invitedUser._id,
            roles: invitedUser.roles,
            builder: invitedUser.builder,
            provider: details.provider,
          })
        )
      })
    }
  )

  it("rejects an unverified login by default and leaves the existing account unchanged", async () => {
    await config.doInTenant(async () => {
      const invitedUser = await createAcceptedInviteAccount()
      const done = jest.fn()

      await authenticate(
        {
          email: invitedUser.email,
          userId: structures.uuid(),
          provider: structures.uuid(),
          providerType: SSOProviderType.OIDC,
          emailVerified: false,
          oauth2: structures.sso.OAuth(),
        },
        false,
        done,
        UserDB.save
      )

      expect(done).toHaveBeenCalledWith(
        expect.any(EmailUnavailableError),
        null,
        { message: "Error saving user" }
      )
      expect(await UserDB.getUserByEmail(invitedUser.email)).toEqual(
        invitedUser
      )
    })
  })
})
