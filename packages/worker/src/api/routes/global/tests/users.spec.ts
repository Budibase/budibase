import { InviteUsersResponse, User } from "@budibase/types"

import { TestConfiguration, mocks, structures } from "../../../../tests"
import { events, tenancy, accounts as _accounts } from "@budibase/backend-core"
import * as userSdk from "../../../../sdk/users"

jest.mock("nodemailer")
const sendMailMock = mocks.email.mock()

const accounts = jest.mocked(_accounts)

describe("/api/global/users", () => {
  const config = new TestConfiguration()

  beforeAll(async () => {
    await config.beforeAll()
  })

  afterAll(async () => {
    await config.afterAll()
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("POST /api/global/users/invite", () => {
    it("should be able to generate an invitation", async () => {
      const email = structures.users.newEmail()
      const { code, res } = await config.api.users.sendUserInvite(
        sendMailMock,
        email
      )

      expect(res.body?.message).toBe("Invitation has been sent.")
      expect(res.body?.unsuccessful.length).toBe(0)
      expect(res.body?.successful.length).toBe(1)
      expect(res.body?.successful[0].email).toBe(email)

      expect(sendMailMock).toHaveBeenCalled()
      expect(code).toBeDefined()
      expect(events.user.invited).toHaveBeenCalledTimes(1)
    })

    it("should not be able to generate an invitation for existing user", async () => {
      const { code, res } = await config.api.users.sendUserInvite(
        sendMailMock,
        config.user!.email,
        400
      )

      expect(res.body.message).toBe(`Unavailable`)
      expect(sendMailMock).toHaveBeenCalledTimes(0)
      expect(code).toBeUndefined()
      expect(events.user.invited).toHaveBeenCalledTimes(0)
    })

    it("should not invite the same user twice", async () => {
      const email = structures.users.newEmail()
      await config.api.users.sendUserInvite(sendMailMock, email)

      jest.clearAllMocks()

      const { code, res } = await config.api.users.sendUserInvite(
        sendMailMock,
        email,
        400
      )

      expect(res.body.message).toBe(`Unavailable`)
      expect(sendMailMock).toHaveBeenCalledTimes(0)
      expect(code).toBeUndefined()
      expect(events.user.invited).toHaveBeenCalledTimes(0)
    })

    it("should be able to create new user from invite", async () => {
      const email = structures.users.newEmail()
      const { code } = await config.api.users.sendUserInvite(
        sendMailMock,
        email
      )

      const res = await config.api.users.acceptInvite(code)

      expect(res.body._id).toBeDefined()
      const user = await config.getUser(email)
      expect(user).toBeDefined()
      expect(user!._id).toEqual(res.body._id)
      expect(events.user.inviteAccepted).toHaveBeenCalledTimes(1)
      expect(events.user.inviteAccepted).toHaveBeenCalledWith(user)
    })
  })

  describe("POST /api/global/users/multi/invite", () => {
    it("should be able to generate an invitation", async () => {
      const newUserInvite = () => ({
        email: structures.users.newEmail(),
        userInfo: {},
      })
      const request = [newUserInvite(), newUserInvite()]

      const res = await config.api.users.sendMultiUserInvite(request)

      const body = res.body as InviteUsersResponse
      expect(body.successful.length).toBe(2)
      expect(body.unsuccessful.length).toBe(0)
      expect(sendMailMock).toHaveBeenCalledTimes(2)
      expect(events.user.invited).toHaveBeenCalledTimes(2)
    })

    it("should not be able to generate an invitation for existing user", async () => {
      const request = [{ email: config.user!.email, userInfo: {} }]

      const res = await config.api.users.sendMultiUserInvite(request)

      const body = res.body as InviteUsersResponse
      expect(body.successful.length).toBe(0)
      expect(body.unsuccessful.length).toBe(1)
      expect(body.unsuccessful[0].reason).toBe("Unavailable")
      expect(sendMailMock).toHaveBeenCalledTimes(0)
      expect(events.user.invited).toHaveBeenCalledTimes(0)
    })

    it("should not be able to generate an invitation for user that has already been invited", async () => {
      const email = structures.users.newEmail()
      await config.api.users.sendUserInvite(sendMailMock, email)

      jest.clearAllMocks()

      const request = [{ email: email, userInfo: {} }]
      const res = await config.api.users.sendMultiUserInvite(request)

      const body = res.body as InviteUsersResponse
      expect(body.successful.length).toBe(0)
      expect(body.unsuccessful.length).toBe(1)
      expect(body.unsuccessful[0].reason).toBe("Unavailable")
      expect(sendMailMock).toHaveBeenCalledTimes(0)
      expect(events.user.invited).toHaveBeenCalledTimes(0)
    })
  })

  describe("POST /api/global/users/bulk", () => {
    it("should ignore users existing in the same tenant", async () => {
      const user = await config.createUser()
      jest.clearAllMocks()

      const response = await config.api.users.bulkCreateUsers([user])

      expect(response.created?.successful.length).toBe(0)
      expect(response.created?.unsuccessful.length).toBe(1)
      expect(response.created?.unsuccessful[0].email).toBe(user.email)
      expect(events.user.created).toHaveBeenCalledTimes(0)
    })

    it("should ignore users existing in other tenants", async () => {
      const user = await config.createUser()
      jest.clearAllMocks()

      await tenancy.doInTenant(config.getTenantId(), async () => {
        const response = await config.api.users.bulkCreateUsers([user])

        expect(response.created?.successful.length).toBe(0)
        expect(response.created?.unsuccessful.length).toBe(1)
        expect(response.created?.unsuccessful[0].email).toBe(user.email)
        expect(events.user.created).toHaveBeenCalledTimes(0)
      })
    })

    it("should ignore accounts using the same email", async () => {
      const account = structures.accounts.account()
      const resp = await config.api.accounts.saveMetadata(account)
      const user = structures.users.user({ email: resp.email })
      jest.clearAllMocks()

      const response = await config.api.users.bulkCreateUsers([user])

      expect(response.created?.successful.length).toBe(0)
      expect(response.created?.unsuccessful.length).toBe(1)
      expect(response.created?.unsuccessful[0].email).toBe(user.email)
      expect(events.user.created).toHaveBeenCalledTimes(0)
    })

    it("should be able to bulk create users", async () => {
      const builder = structures.users.builderUser()
      const admin = structures.users.adminUser()
      const user = structures.users.user()

      const response = await config.api.users.bulkCreateUsers([
        builder,
        admin,
        user,
      ])

      expect(response.created?.successful.length).toBe(3)
      expect(response.created?.successful[0].email).toBe(builder.email)
      expect(response.created?.successful[1].email).toBe(admin.email)
      expect(response.created?.successful[2].email).toBe(user.email)
      expect(response.created?.unsuccessful.length).toBe(0)
      expect(events.user.created).toHaveBeenCalledTimes(3)
      expect(events.user.permissionAdminAssigned).toHaveBeenCalledTimes(1)
      expect(events.user.permissionBuilderAssigned).toHaveBeenCalledTimes(2)
    })
  })

  describe("POST /api/global/users", () => {
    it("should be able to create a basic user", async () => {
      const user = structures.users.user()

      await config.api.users.saveUser(user)

      expect(events.user.created).toHaveBeenCalledTimes(1)
      expect(events.user.updated).not.toHaveBeenCalled()
      expect(events.user.permissionBuilderAssigned).not.toHaveBeenCalled()
      expect(events.user.permissionAdminAssigned).not.toHaveBeenCalled()
    })

    it("should be able to create an admin user", async () => {
      const user = structures.users.adminUser()

      await config.api.users.saveUser(user)

      expect(events.user.created).toHaveBeenCalledTimes(1)
      expect(events.user.updated).not.toHaveBeenCalled()
      expect(events.user.permissionBuilderAssigned).toHaveBeenCalledTimes(1)
      expect(events.user.permissionAdminAssigned).toHaveBeenCalledTimes(1)
    })

    it("should be able to create a builder user", async () => {
      const user = structures.users.builderUser()

      await config.api.users.saveUser(user)

      expect(events.user.created).toHaveBeenCalledTimes(1)
      expect(events.user.updated).not.toHaveBeenCalled()
      expect(events.user.permissionBuilderAssigned).toHaveBeenCalledTimes(1)
      expect(events.user.permissionAdminAssigned).not.toHaveBeenCalled()
    })

    it("should be able to assign app roles", async () => {
      const user = structures.users.user()
      user.roles = {
        app_123: "role1",
        app_456: "role2",
      }

      await config.api.users.saveUser(user)

      const savedUser = await config.getUser(user.email)
      expect(events.user.created).toHaveBeenCalledTimes(1)
      expect(events.user.updated).not.toHaveBeenCalled()
      expect(events.role.assigned).toHaveBeenCalledTimes(2)
      expect(events.role.assigned).toHaveBeenCalledWith(savedUser, "role1")
      expect(events.role.assigned).toHaveBeenCalledWith(savedUser, "role2")
    })

    it("should not be able to create user that exists in same tenant", async () => {
      const user = await config.createUser()
      jest.clearAllMocks()
      delete user._id
      delete user._rev

      const response = await config.api.users.saveUser(user, 400)

      expect(response.body.message).toBe(
        `Email already in use: '${user.email}'`
      )
      expect(events.user.created).toHaveBeenCalledTimes(0)
    })

    it("should not be able to create user that exists in other tenant", async () => {
      const user = await config.createUser()
      jest.clearAllMocks()

      await tenancy.doInTenant(config.getTenantId(), async () => {
        delete user._id
        const response = await config.api.users.saveUser(user, 400)

        expect(response.body.message).toBe(
          `Email already in use: '${user.email}'`
        )
        expect(events.user.created).toHaveBeenCalledTimes(0)
      })
    })

    it("should not be able to create user with the same email as an account", async () => {
      const user = structures.users.user()
      const account = structures.accounts.cloudAccount()
      accounts.getAccount.mockReturnValueOnce(Promise.resolve(account))

      const response = await config.api.users.saveUser(user, 400)

      expect(response.body.message).toBe(
        `Email already in use: '${user.email}'`
      )
      expect(events.user.created).toHaveBeenCalledTimes(0)
    })

    it("should not be able to create a user with the same email and different casing", async () => {
      const user = structures.users.user()
      await config.api.users.saveUser(user)

      user.email = user.email.toUpperCase()
      await config.api.users.saveUser(user, 400)

      expect(events.user.created).toHaveBeenCalledTimes(1)
    })

    it("should not be able to bulk create a user with the same email and different casing", async () => {
      const user = structures.users.user()
      await config.api.users.saveUser(user)

      user.email = user.email.toUpperCase()
      await config.api.users.bulkCreateUsers([user])

      expect(events.user.created).toHaveBeenCalledTimes(1)
    })

    it("should not allow a non-admin user to create a new user", async () => {
      const nonAdmin = await config.createUser(structures.users.builderUser())
      await config.createSession(nonAdmin)

      const newUser = structures.users.user()
      await config.api.users.saveUser(
        newUser,
        403,
        config.authHeaders(nonAdmin)
      )
    })
  })

  describe("POST /api/global/users (update)", () => {
    it("should be able to update a basic user", async () => {
      const user = await config.createUser()
      jest.clearAllMocks()

      await config.api.users.saveUser(user)

      expect(events.user.created).not.toHaveBeenCalled()
      expect(events.user.updated).toHaveBeenCalledTimes(1)
      expect(events.user.permissionBuilderAssigned).not.toHaveBeenCalled()
      expect(events.user.permissionAdminAssigned).not.toHaveBeenCalled()
      expect(events.user.passwordForceReset).not.toHaveBeenCalled()
    })

    it("should not allow a user to update their own admin/builder status", async () => {
      const user = (await config.api.users.getUser(config.user!._id!))
        .body as User
      await config.api.users.saveUser({
        ...user,
        admin: {
          global: false,
        },
        builder: {
          global: false,
        },
      })
      const userOut = (await config.api.users.getUser(user._id!)).body
      expect(userOut.admin.global).toBe(true)
      expect(userOut.builder.global).toBe(true)
    })

    it("should be able to force reset password", async () => {
      const user = await config.createUser()
      jest.clearAllMocks()

      user.forceResetPassword = true
      user.password = "tempPassword"
      await config.api.users.saveUser(user)

      expect(events.user.created).not.toHaveBeenCalled()
      expect(events.user.updated).toHaveBeenCalledTimes(1)
      expect(events.user.permissionBuilderAssigned).not.toHaveBeenCalled()
      expect(events.user.permissionAdminAssigned).not.toHaveBeenCalled()
      expect(events.user.passwordForceReset).toHaveBeenCalledTimes(1)
    })

    it("should be able to update a basic user to an admin user", async () => {
      const user = await config.createUser()
      jest.clearAllMocks()

      await config.api.users.saveUser(structures.users.adminUser(user))

      expect(events.user.created).not.toHaveBeenCalled()
      expect(events.user.updated).toHaveBeenCalledTimes(1)
      expect(events.user.permissionBuilderAssigned).toHaveBeenCalledTimes(1)
      expect(events.user.permissionAdminAssigned).toHaveBeenCalledTimes(1)
    })

    it("should be able to update a basic user to a builder user", async () => {
      const user = await config.createUser()
      jest.clearAllMocks()

      await config.api.users.saveUser(structures.users.builderUser(user))

      expect(events.user.created).not.toHaveBeenCalled()
      expect(events.user.updated).toHaveBeenCalledTimes(1)
      expect(events.user.permissionBuilderAssigned).toHaveBeenCalledTimes(1)
      expect(events.user.permissionAdminAssigned).not.toHaveBeenCalled()
    })

    it("should be able to update an admin user to a basic user", async () => {
      const user = await config.createUser(structures.users.adminUser())
      jest.clearAllMocks()
      user.admin!.global = false
      user.builder!.global = false

      await config.api.users.saveUser(user)

      expect(events.user.created).not.toHaveBeenCalled()
      expect(events.user.updated).toHaveBeenCalledTimes(1)
      expect(events.user.permissionAdminRemoved).toHaveBeenCalledTimes(1)
      expect(events.user.permissionBuilderRemoved).toHaveBeenCalledTimes(1)
    })

    it("should be able to update an builder user to a basic user", async () => {
      const user = await config.createUser(structures.users.builderUser())
      jest.clearAllMocks()
      user.builder!.global = false

      await config.api.users.saveUser(user)

      expect(events.user.created).not.toHaveBeenCalled()
      expect(events.user.updated).toHaveBeenCalledTimes(1)
      expect(events.user.permissionBuilderRemoved).toHaveBeenCalledTimes(1)
      expect(events.user.permissionAdminRemoved).not.toHaveBeenCalled()
    })

    it("should be able to assign app roles", async () => {
      const user = await config.createUser()
      jest.clearAllMocks()
      user.roles = {
        app_123: "role1",
        app_456: "role2",
      }

      await config.api.users.saveUser(user)

      const savedUser = await config.getUser(user.email)
      expect(events.user.created).not.toHaveBeenCalled()
      expect(events.user.updated).toHaveBeenCalledTimes(1)
      expect(events.role.assigned).toHaveBeenCalledTimes(2)
      expect(events.role.assigned).toHaveBeenCalledWith(savedUser, "role1")
      expect(events.role.assigned).toHaveBeenCalledWith(savedUser, "role2")
    })

    it("should be able to unassign app roles", async () => {
      let user = structures.users.user()
      user.roles = {
        app_123: "role1",
        app_456: "role2",
      }
      user = await config.createUser(user)
      jest.clearAllMocks()
      user.roles = {}

      await config.api.users.saveUser(user)

      const savedUser = await config.getUser(user.email)
      expect(events.user.created).not.toHaveBeenCalled()
      expect(events.user.updated).toHaveBeenCalledTimes(1)
      expect(events.role.unassigned).toHaveBeenCalledTimes(2)
      expect(events.role.unassigned).toHaveBeenCalledWith(savedUser, "role1")
      expect(events.role.unassigned).toHaveBeenCalledWith(savedUser, "role2")
    })

    it("should be able to update existing app roles", async () => {
      let user = structures.users.user()
      user.roles = {
        app_123: "role1",
        app_456: "role2",
      }
      user = await config.createUser(user)
      jest.clearAllMocks()
      user.roles = {
        app_123: "role1",
        app_456: "role2-edit",
      }

      await config.api.users.saveUser(user)

      const savedUser = await config.getUser(user.email)
      expect(events.user.created).not.toHaveBeenCalled()
      expect(events.user.updated).toHaveBeenCalledTimes(1)
      expect(events.role.unassigned).toHaveBeenCalledTimes(1)
      expect(events.role.unassigned).toHaveBeenCalledWith(savedUser, "role2")
      expect(events.role.assigned).toHaveBeenCalledTimes(1)
      expect(events.role.assigned).toHaveBeenCalledWith(savedUser, "role2-edit")
    })

    it("should not be able to update email address", async () => {
      const email = structures.email()
      const user = await config.createUser(structures.users.user({ email }))
      user.email = "new@example.com"

      const response = await config.api.users.saveUser(user, 400)

      const dbUser = await config.getUser(email)
      user.email = email
      expect(user).toStrictEqual(dbUser)
      expect(response.body.message).toBe("Email address cannot be changed")
    })

    it("should allow a non-admin user to update an existing user", async () => {
      const existingUser = await config.createUser(structures.users.user())
      const nonAdmin = await config.createUser(structures.users.builderUser())
      await config.createSession(nonAdmin)

      await config.api.users.saveUser(
        existingUser,
        200,
        config.authHeaders(nonAdmin)
      )
    })

    describe("sso users", () => {
      function createSSOUser() {
        return config.doInTenant(() => {
          const user = structures.users.ssoUser()
          return userSdk.db.save(user, { requirePassword: false })
        })
      }

      function createPasswordUser() {
        return config.doInTenant(() => {
          const user = structures.users.user()
          return userSdk.db.save(user)
        })
      }

      it("should be able to update an sso user that has no password", async () => {
        const user = await createSSOUser()
        await config.api.users.saveUser(user)
      })

      it("sso support couldn't be used by admin. It is cloud restricted and needs internal key", async () => {
        const user = await config.createUser()
        const ssoId = "fake-ssoId"
        await config.api.users
          .addSsoSupportDefaultAuth(ssoId, user.email)
          .expect("Content-Type", /json/)
          .expect(403)
      })

      it("if user email doesn't exist, SSO support couldn't be added. Not found error returned", async () => {
        const ssoId = "fake-ssoId"
        const email = "fake-email@budibase.com"
        await config.api.users
          .addSsoSupportInternalAPIAuth(ssoId, email)
          .expect("Content-Type", /json/)
          .expect(404)
      })

      it("if user email exist, SSO support is added", async () => {
        const user = await createPasswordUser()
        const ssoId = "fakessoId"
        await config.api.users
          .addSsoSupportInternalAPIAuth(ssoId, user.email)
          .expect(200)
      })

      it("if user ssoId is already assigned, no change will be applied", async () => {
        const user = await createSSOUser()
        user.ssoId = "testssoId"
        await config.api.users
          .addSsoSupportInternalAPIAuth(user.ssoId, user.email)
          .expect(200)
      })
    })
  })

  describe("POST /api/global/users/bulk (delete)", () => {
    it("should not be able to bulk delete current user", async () => {
      const user = config.user!

      const response = await config.api.users.bulkDeleteUsers(
        [
          {
            userId: user._id!,
            email: "test@example.com",
          },
        ],
        400
      )

      expect(response.message).toBe("Unable to delete self.")
      expect(events.user.deleted).not.toHaveBeenCalled()
    })
  })

  describe("POST /api/global/users/search", () => {
    it("should be able to search by email", async () => {
      const user = await config.createUser()
      const response = await config.api.users.searchUsers({
        query: { string: { email: user.email } },
      })
      expect(response.body.data.length).toBe(1)
      expect(response.body.data[0].email).toBe(user.email)
    })

    it("should be able to search by email with numeric prefixing", async () => {
      const user = await config.createUser()
      const response = await config.api.users.searchUsers({
        query: { string: { ["999:email"]: user.email } },
      })
      expect(response.body.data.length).toBe(1)
      expect(response.body.data[0].email).toBe(user.email)
    })

    it("should be able to search by _id", async () => {
      const user = await config.createUser()
      const response = await config.api.users.searchUsers({
        query: { equal: { _id: user._id } },
      })
      expect(response.body.data.length).toBe(1)
      expect(response.body.data[0]._id).toBe(user._id)
    })

    it("should be able to search by oneOf _id", async () => {
      const [user, user2, user3] = await Promise.all([
        config.createUser(),
        config.createUser(),
        config.createUser(),
      ])
      const response = await config.api.users.searchUsers({
        query: { oneOf: { _id: [user._id, user2._id] } },
      })
      expect(response.body.data.length).toBe(2)
      const foundUserIds = response.body.data.map((user: User) => user._id)
      expect(foundUserIds).toContain(user._id)
      expect(foundUserIds).toContain(user2._id)
      expect(
        response.body.data.find((user: User) => user._id === user3._id)
      ).toBeUndefined()
    })

    it("should be able to search by _id with numeric prefixing", async () => {
      const user = await config.createUser()
      const response = await config.api.users.searchUsers({
        query: { equal: { ["1:_id"]: user._id } },
      })
      expect(response.body.data.length).toBe(1)
      expect(response.body.data[0]._id).toBe(user._id)
    })

    it("should throw an error when using multiple filters on the same field", async () => {
      const user = await config.createUser()
      await config.api.users.searchUsers(
        {
          query: {
            string: {
              ["1:email"]: user.email,
              ["2:email"]: "something else",
            },
          },
        },
        { status: 400 }
      )
    })

    it("should throw an error when using multiple filters on the same field without prefixes", async () => {
      const user = await config.createUser()
      await config.api.users.searchUsers(
        {
          query: {
            string: {
              ["_id"]: user.email,
              ["999:_id"]: "something else",
            },
          },
        },
        { status: 400 }
      )
    })

    it("should throw an error when unimplemented options used", async () => {
      const user = await config.createUser()
      await config.api.users.searchUsers(
        {
          query: { equal: { firstName: user.firstName } },
        },
        { status: 400 }
      )
    })

    it("should throw an error if public query performed", async () => {
      await config.api.users.searchUsers({}, { status: 403, noHeaders: true })
    })

    it("should be able to search using logical conditions", async () => {
      const user = await config.createUser()
      const response = await config.api.users.searchUsers({
        query: {
          $and: {
            conditions: [
              {
                $and: {
                  conditions: [{ string: { email: user.email } }],
                },
              },
            ],
          },
        },
      })
      expect(response.body.data.length).toBe(1)
      expect(response.body.data[0].email).toBe(user.email)
    })
  })

  describe("DELETE /api/global/users/:userId", () => {
    it("should be able to destroy a basic user", async () => {
      const user = await config.createUser()
      jest.clearAllMocks()

      await config.api.users.deleteUser(user._id!)

      expect(events.user.deleted).toHaveBeenCalledTimes(1)
      expect(events.user.permissionBuilderRemoved).not.toHaveBeenCalled()
      expect(events.user.permissionAdminRemoved).not.toHaveBeenCalled()
    })

    it("should be able to destroy an admin user", async () => {
      const user = await config.createUser(structures.users.adminUser())
      jest.clearAllMocks()

      await config.api.users.deleteUser(user._id!)

      expect(events.user.deleted).toHaveBeenCalledTimes(1)
      expect(events.user.permissionBuilderRemoved).toHaveBeenCalledTimes(1)
      expect(events.user.permissionAdminRemoved).toHaveBeenCalledTimes(1)
    })

    it("should be able to destroy a builder user", async () => {
      const user = await config.createUser(structures.users.builderUser())
      jest.clearAllMocks()

      await config.api.users.deleteUser(user._id!)

      expect(events.user.deleted).toHaveBeenCalledTimes(1)
      expect(events.user.permissionBuilderRemoved).toHaveBeenCalledTimes(1)
      expect(events.user.permissionAdminRemoved).not.toHaveBeenCalled()
    })

    it("should not be able to destroy account owner", async () => {
      const user = await config.createUser()
      const account = structures.accounts.cloudAccount()
      accounts.getAccount.mockReturnValueOnce(Promise.resolve(account))

      const response = await config.api.users.deleteUser(user._id!, 400)

      expect(response.body.message).toBe("Account holder cannot be deleted")
    })

    it("should not be able to destroy account owner as account owner", async () => {
      const user = await config.user!
      const account = structures.accounts.cloudAccount()
      account.email = user.email
      accounts.getAccount.mockReturnValueOnce(Promise.resolve(account))

      const response = await config.api.users.deleteUser(user._id!, 400)

      expect(response.body.message).toBe("Unable to delete self.")
    })
  })

  describe("POST /api/global/users/onboard", () => {
    it("should successfully onboard a user", async () => {
      const response = await config.api.users.onboardUser([
        { email: structures.users.newEmail(), userInfo: {} },
      ])
      expect(response.successful.length).toBe(1)
      expect(response.unsuccessful.length).toBe(0)
    })

    it("should not onboard a user who has been invited", async () => {
      const email = structures.users.newEmail()
      await config.api.users.sendUserInvite(sendMailMock, email)

      const response = await config.api.users.onboardUser([
        { email, userInfo: {} },
      ])
      expect(response.successful.length).toBe(0)
      expect(response.unsuccessful.length).toBe(1)
    })
  })
})
