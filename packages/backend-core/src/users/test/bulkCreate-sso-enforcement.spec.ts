import { User, BulkUserCreated } from "@budibase/types"
import { DBTestConfiguration, generator, structures } from "../../../tests"
import { UserDB } from "../db"

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
}

const features = { 
  isSSOEnforced: jest.fn(), 
  isAppBuildersEnabled: jest.fn() 
}

describe("UserDB bulkCreate with SSO enforcement", () => {
  beforeAll(() => {
    UserDB.init(quotas, groups, features)
  })

  beforeEach(() => {
    jest.clearAllMocks()
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

        // This should fail because passwords are required when SSO is not enforced
        await expect(UserDB.bulkCreate(usersWithoutPasswords)).rejects.toBe(
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

        const result: BulkUserCreated = await UserDB.bulkCreate(usersWithPasswords)

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

        // This should succeed because when SSO is enforced, passwords are not required
        const result: BulkUserCreated = await UserDB.bulkCreate(usersWithoutPasswords)

        expect(result.successful).toHaveLength(2)
        expect(result.unsuccessful).toHaveLength(0)
        expect(result.successful[0].email).toBe(usersWithoutPasswords[0].email)
        expect(result.successful[1].email).toBe(usersWithoutPasswords[1].email)
      })
    })

    it("should also allow bulk creation of users with passwords when SSO is enforced", async () => {
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

        const result: BulkUserCreated = await UserDB.bulkCreate(usersWithPasswords)

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

        // All should succeed when SSO is enforced, regardless of password presence
        const result: BulkUserCreated = await UserDB.bulkCreate(mixedUsers)

        expect(result.successful).toHaveLength(3)
        expect(result.unsuccessful).toHaveLength(0)
      })
    })
  })

  describe("individual user creation comparison", () => {
    it("single user creation works correctly with SSO enforcement", async () => {
      features.isSSOEnforced.mockResolvedValue(true)

      await config.doInTenant(async () => {
        const userWithoutPassword = {
          ...structures.users.user({
            email: generator.email({}),
            tenantId: config.getTenantId(),
          }),
        }
        delete userWithoutPassword.password

        // Individual save should work with SSO enforcement
        const savedUser = await UserDB.save(userWithoutPassword)
        expect(savedUser).toBeDefined()
        expect(savedUser.email).toBe(userWithoutPassword.email)
      })
    })

    it("single user creation fails without SSO enforcement when no password", async () => {
      features.isSSOEnforced.mockResolvedValue(false)

      await config.doInTenant(async () => {
        const userWithoutPassword = {
          ...structures.users.user({
            email: generator.email({}),
            tenantId: config.getTenantId(),
          }),
        }
        delete userWithoutPassword.password

        // Individual save should fail when SSO is not enforced and no password
        await expect(UserDB.save(userWithoutPassword)).rejects.toBe(
          "Password must be specified."
        )
      })
    })
  })
})