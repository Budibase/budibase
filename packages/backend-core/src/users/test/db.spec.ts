import { BulkUserCreated, User, UserGroup, UserStatus } from "@budibase/types"
import { DBTestConfiguration, generator, structures } from "../../../tests"
import * as accounts from "../../accounts"
import { getGlobalDB } from "../../context"
import { withEnv } from "../../environment"
import { UserDB } from "../db"
import { searchExistingEmails } from "../lookup"

const db = UserDB

const config = new DBTestConfiguration()

const quotas = {
  addUsers: jest
    .fn()
    .mockImplementation(
      (_change: number, _creatorsChange: number, cb?: () => Promise<any>) =>
        cb && cb()
    ),
  removeUsers: jest
    .fn()
    .mockImplementation(
      (_change: number, _creatorsChange: number, cb?: () => Promise<any>) =>
        cb && cb()
    ),
}
const groups = {
  addUsers: jest.fn(),
  getBulk: jest.fn(),
  getGroupBuilderAppIds: jest.fn(),
  getDefaultGroup: jest.fn(),
}
const features = { isSSOEnforced: jest.fn() }

describe("UserDB", () => {
  beforeAll(() => {
    db.init(quotas, groups, features)
  })

  beforeEach(() => {
    jest.clearAllMocks()
    groups.getDefaultGroup.mockResolvedValue(undefined)
  })

  describe("save", () => {
    describe("create", () => {
      it("creating a new user will persist it", async () => {
        const email = generator.email({})
        const user: User = structures.users.user({
          email,
          tenantId: config.getTenantId(),
        })

        await config.doInTenant(async () => {
          const saveUserResponse = await db.save(user)

          const persistedUser = await db.getUserByEmail(email)
          expect(persistedUser).toEqual({
            ...user,
            _id: saveUserResponse._id,
            _rev: expect.stringMatching(/^1-\w+/),
            password: expect.not.stringMatching(user.password!),
            status: UserStatus.ACTIVE,
            createdAt: Date.now(),
            updatedAt: new Date().toISOString(),
          })
        })
      })

      it("the same email cannot be used twice in the same tenant", async () => {
        const email = generator.email({})
        const user: User = structures.users.user({
          email,
          tenantId: config.getTenantId(),
        })

        await config.doInTenant(() => db.save(user))

        await config.doInTenant(() =>
          expect(db.save(user)).rejects.toThrow(
            `Email already in use: '${email}'`
          )
        )
      })

      it("the same email cannot be used twice in different tenants", async () => {
        const email = generator.email({})
        const user: User = structures.users.user({
          email,
          tenantId: config.getTenantId(),
        })

        await config.doInTenant(() => db.save(user))

        config.newTenant()
        await config.doInTenant(() =>
          expect(db.save(user)).rejects.toThrow(
            `Email already in use: '${email}'`
          )
        )
      })

      it("auto-assigns the default group when none is provided", async () => {
        const defaultGroupId = `group_${generator.guid()}`
        groups.getDefaultGroup.mockResolvedValue({ _id: defaultGroupId })

        const user: User = structures.users.user({
          email: generator.email({}),
          tenantId: config.getTenantId(),
        })
        delete user.userGroups

        await config.doInTenant(async () => {
          const saved = await db.save(user)

          expect(groups.addUsers).toHaveBeenCalledWith(defaultGroupId, [
            saved._id!,
          ])
          const persistedUser = await db.getUser(saved._id!)
          expect(persistedUser?.userGroups).toEqual([defaultGroupId])
        })
      })

      it("counts new users as creators when creator status comes from default group", async () => {
        const defaultGroupId = `group_${generator.guid()}`
        const defaultGroup: UserGroup = {
          ...structures.userGroups.userGroup(),
          _id: defaultGroupId,
          roles: { app: "CREATOR" },
        }
        groups.getDefaultGroup.mockResolvedValue(defaultGroup)

        const user: User = structures.users.user({
          email: generator.email({}),
          tenantId: config.getTenantId(),
        })
        delete user.userGroups

        await config.doInTenant(async () => {
          await getGlobalDB().put(defaultGroup)

          await db.save(user)

          expect(quotas.addUsers).toHaveBeenCalledTimes(1)
          expect(quotas.addUsers).toHaveBeenCalledWith(
            1,
            1,
            expect.any(Function)
          )
        })
      })

      it("uses explicit groups over default assignment", async () => {
        const defaultGroupId = `group_${generator.guid()}`
        const explicitGroupId = `group_${generator.guid()}`
        groups.getDefaultGroup.mockResolvedValue({ _id: defaultGroupId })

        const user: User = structures.users.user({
          email: generator.email({}),
          tenantId: config.getTenantId(),
          userGroups: [explicitGroupId],
        })

        await config.doInTenant(async () => {
          const saved = await db.save(user)

          expect(groups.getDefaultGroup).not.toHaveBeenCalled()
          expect(groups.addUsers).toHaveBeenCalledWith(explicitGroupId, [
            saved._id!,
          ])
          expect(groups.addUsers).not.toHaveBeenCalledWith(defaultGroupId, [
            saved._id!,
          ])
        })
      })
    })

    describe("update", () => {
      let user: User

      beforeEach(async () => {
        user = await config.doInTenant(() =>
          db.save(
            structures.users.user({
              email: generator.email({}),
              tenantId: config.getTenantId(),
            })
          )
        )
      })

      it("can update user properties", async () => {
        await config.doInTenant(async () => {
          const updatedName = generator.first()
          user.firstName = updatedName

          await db.save(user)

          const persistedUser = await db.getUserByEmail(user.email)
          expect(persistedUser).toEqual(
            expect.objectContaining({
              _id: user._id,
              email: user.email,
              firstName: updatedName,
              lastName: user.lastName,
            })
          )
        })
      })

      it("email cannot be updated by default", async () => {
        await config.doInTenant(async () => {
          await expect(
            db.save({ ...user, email: generator.email({}) })
          ).rejects.toThrow("Email address cannot be changed")
        })
      })

      it("email can be updated if specified", async () => {
        await config.doInTenant(async () => {
          const newEmail = generator.email({})

          await db.save(
            { ...user, email: newEmail },
            { allowChangingEmail: true }
          )

          const persistedUser = await db.getUserByEmail(newEmail)
          expect(persistedUser).toEqual(
            expect.objectContaining({
              _id: user._id,
              email: newEmail,
              lastName: user.lastName,
              _rev: expect.stringMatching(/^2-\w+/),
            })
          )
        })
      })

      it("updating emails frees previous emails", async () => {
        await config.doInTenant(async () => {
          const previousEmail = user.email
          const newEmail = generator.email({})
          expect(await searchExistingEmails([previousEmail, newEmail])).toEqual(
            [previousEmail]
          )

          await db.save(
            { ...user, email: newEmail },
            { allowChangingEmail: true }
          )

          expect(await searchExistingEmails([previousEmail, newEmail])).toEqual(
            [newEmail]
          )

          await db.save(
            structures.users.user({
              email: previousEmail,
              tenantId: config.getTenantId(),
            })
          )

          expect(await searchExistingEmails([previousEmail, newEmail])).toEqual(
            [previousEmail, newEmail]
          )
        })
      })

      it("does not check account portal when email is unchanged", async () => {
        const getAccountSpy = jest
          .spyOn(accounts, "getAccount")
          .mockResolvedValue(undefined)

        await withEnv(
          {
            SELF_HOSTED: false,
            DISABLE_ACCOUNT_PORTAL: "",
            MULTI_TENANCY: "",
          },
          async () => {
            await config.doInTenant(async () => {
              const updatedName = generator.first()
              await db.save({ ...user, firstName: updatedName })
              expect(getAccountSpy).not.toHaveBeenCalled()
            })
          }
        )

        getAccountSpy.mockRestore()
      })
    })
  })

  describe("bulkCreate", () => {
    it("auto-assigns the default group during bulk create when no groups are provided", async () => {
      features.isSSOEnforced.mockResolvedValue(false)
      const defaultGroupId = `group_${generator.guid()}`
      const defaultGroup: UserGroup = {
        ...structures.userGroups.userGroup(),
        _id: defaultGroupId,
      }
      groups.getDefaultGroup.mockResolvedValue(defaultGroup)

      await config.doInTenant(async () => {
        await getGlobalDB().put(defaultGroup)

        const users: User[] = [
          structures.users.user({
            email: generator.email({}),
            password: "validPassword123!",
            tenantId: config.getTenantId(),
          }),
          structures.users.user({
            email: generator.email({}),
            password: "validPassword456!",
            tenantId: config.getTenantId(),
          }),
        ]

        const result = await db.bulkCreate(users)
        const createdUserIds = result.successful.map(user => user._id!)
        const createdUsers = await db.bulkGet(createdUserIds)

        expect(groups.addUsers).toHaveBeenCalledWith(
          defaultGroupId,
          expect.arrayContaining(createdUserIds)
        )
        expect(
          createdUsers.every(user => user.userGroups?.includes(defaultGroupId))
        ).toBe(true)
      })
    })

    it("uses explicit groups and skips default-group fallback during bulk create", async () => {
      features.isSSOEnforced.mockResolvedValue(false)
      const defaultGroupId = `group_${generator.guid()}`
      const explicitGroupId = `group_${generator.guid()}`
      groups.getDefaultGroup.mockResolvedValue({ _id: defaultGroupId })

      await config.doInTenant(async () => {
        const explicitGroup: UserGroup = {
          ...structures.userGroups.userGroup(),
          _id: explicitGroupId,
        }
        await getGlobalDB().put(explicitGroup)

        const users: User[] = [
          structures.users.user({
            email: generator.email({}),
            password: "validPassword123!",
            tenantId: config.getTenantId(),
          }),
          structures.users.user({
            email: generator.email({}),
            password: "validPassword456!",
            tenantId: config.getTenantId(),
          }),
        ]

        const result = await db.bulkCreate(users, [explicitGroupId])
        const createdUserIds = result.successful.map(user => user._id!)
        const createdUsers = await db.bulkGet(createdUserIds)

        expect(groups.getDefaultGroup).not.toHaveBeenCalled()
        expect(groups.addUsers).toHaveBeenCalledWith(
          explicitGroupId,
          expect.arrayContaining(createdUserIds)
        )
        expect(
          createdUsers.every(user => user.userGroups?.includes(explicitGroupId))
        ).toBe(true)
        expect(
          createdUsers.every(user => !user.userGroups?.includes(defaultGroupId))
        ).toBe(true)
      })
    })

    describe("when SSO is NOT enforced", () => {
      beforeEach(() => {
        features.isSSOEnforced.mockResolvedValue(false)
      })

      it("should require passwords for bulk created users", async () => {
        await config.doInTenant(async () => {
          const usersWithoutPasswords: User[] = [
            {
              ...structures.users.user({
                email: generator.email({}),
                tenantId: config.getTenantId(),
              }),
            },
            {
              ...structures.users.user({
                email: generator.email({}),
                tenantId: config.getTenantId(),
              }),
            },
          ].map(user => {
            delete user.password
            return user
          })

          await expect(db.bulkCreate(usersWithoutPasswords)).rejects.toBe(
            "Password must be specified."
          )
        })
      })

      it("should successfully create users with passwords", async () => {
        await config.doInTenant(async () => {
          const usersWithPasswords: User[] = [
            structures.users.user({
              email: generator.email({}),
              password: "validPassword123!",
              tenantId: config.getTenantId(),
            }),
            structures.users.user({
              email: generator.email({}),
              password: "validPassword456!",
              tenantId: config.getTenantId(),
            }),
          ]

          const result: BulkUserCreated =
            await db.bulkCreate(usersWithPasswords)

          expect(result.successful).toHaveLength(2)
          expect(result.unsuccessful).toHaveLength(0)
          expect(result.successful[0].email).toBe(usersWithPasswords[0].email)
          expect(result.successful[1].email).toBe(usersWithPasswords[1].email)
        })
      })
    })

    describe("when SSO IS enforced", () => {
      beforeEach(() => {
        features.isSSOEnforced.mockResolvedValue(true)
      })

      it("should allow bulk creation of users without passwords", async () => {
        await config.doInTenant(async () => {
          const usersWithoutPasswords: User[] = [
            {
              ...structures.users.user({
                email: generator.email({}),
                tenantId: config.getTenantId(),
              }),
            },
            {
              ...structures.users.user({
                email: generator.email({}),
                tenantId: config.getTenantId(),
              }),
            },
          ].map(user => {
            delete user.password
            return user
          })

          const result: BulkUserCreated = await db.bulkCreate(
            usersWithoutPasswords
          )

          expect(result.successful).toHaveLength(2)
          expect(result.unsuccessful).toHaveLength(0)
          expect(result.successful[0].email).toBe(
            usersWithoutPasswords[0].email
          )
          expect(result.successful[1].email).toBe(
            usersWithoutPasswords[1].email
          )
        })
      })

      it("should allow bulk creation of users with passwords when SSO is enforced", async () => {
        await config.doInTenant(async () => {
          const usersWithPasswords: User[] = [
            structures.users.user({
              email: generator.email({}),
              password: "validPassword123!",
              tenantId: config.getTenantId(),
            }),
            structures.users.user({
              email: generator.email({}),
              password: "validPassword456!",
              tenantId: config.getTenantId(),
            }),
          ]

          const result: BulkUserCreated =
            await db.bulkCreate(usersWithPasswords)

          expect(result.successful).toHaveLength(2)
          expect(result.unsuccessful).toHaveLength(0)
        })
      })

      it("should handle mixed scenarios with some users having passwords and others not", async () => {
        await config.doInTenant(async () => {
          const mixedUsers: User[] = [
            structures.users.user({
              email: generator.email({}),
              password: "validPassword123!",
              tenantId: config.getTenantId(),
            }),
            {
              ...structures.users.user({
                email: generator.email({}),
                tenantId: config.getTenantId(),
              }),
              password: undefined,
            },
            {
              ...structures.users.user({
                email: generator.email({}),
                tenantId: config.getTenantId(),
              }),
              password: "",
            },
          ]

          const result: BulkUserCreated = await db.bulkCreate(mixedUsers)

          expect(result.successful).toHaveLength(3)
          expect(result.unsuccessful).toHaveLength(0)
        })
      })
    })
  })

  describe("buildUser", () => {
    const tenantId = config.getTenantId()

    beforeEach(() => {
      jest.resetAllMocks()
      features.isSSOEnforced.mockResolvedValue(false)
    })

    it("reuses the existing password when unchanged", async () => {
      const existingPassword = "existing-hash"
      const dbUser = structures.users.user({
        _id: "user_existing",
        password: existingPassword,
        tenantId,
      })
      const updatedUser = {
        ...dbUser,
        firstName: generator.first(),
        password: existingPassword,
      }

      const preventSpy = jest.spyOn(UserDB, "isPreventPasswordActions")

      const builtUser = await UserDB.buildUser(
        updatedUser,
        undefined,
        tenantId,
        dbUser
      )

      expect(builtUser.password).toEqual(existingPassword)
      expect(preventSpy).not.toHaveBeenCalled()
    })

    it("checks password permissions when the password changes", async () => {
      const dbUser = structures.users.user({
        _id: "user_existing",
        password: "existing-hash",
        tenantId,
      })
      const updatedUser = {
        ...dbUser,
        password: "ValidPassword123!",
      }

      const preventSpy = jest
        .spyOn(UserDB, "isPreventPasswordActions")
        .mockResolvedValue(true)

      await expect(
        UserDB.buildUser(updatedUser, undefined, tenantId, dbUser)
      ).rejects.toThrow("Password change is disabled for this user")

      expect(preventSpy).toHaveBeenCalled()
    })
  })

  describe("countUsersByWorkspace", () => {
    const errorMessage = "Must provide a string based workspace ID"
    const assertInvalidWorkspaceId = async (workspaceId: unknown) => {
      await config.doInTenant(() =>
        expect(db.countUsersByWorkspace(workspaceId as string)).rejects.toThrow(
          errorMessage
        )
      )
    }

    it("returns zero when the workspace has no users", async () => {
      const workspaceId = `app_${generator.guid()}`

      await config.doInTenant(() =>
        expect(db.countUsersByWorkspace(workspaceId)).resolves.toEqual({
          userCount: 0,
        })
      )
    })

    it.each<[string, unknown]>([
      ["undefined", undefined],
      ["null", null],
      ["number", 123],
      ["empty string", ""],
    ])("throws when workspaceId is %s", async (_label, workspaceId) => {
      await assertInvalidWorkspaceId(workspaceId)
    })
  })
})
