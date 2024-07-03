import { User, UserStatus } from "@budibase/types"
import { DBTestConfiguration, generator, structures } from "../../../tests"
import { UserDB } from "../db"

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
}
const features = { isSSOEnforced: jest.fn(), isAppBuildersEnabled: jest.fn() }

describe("UserDB", () => {
  beforeAll(() => {
    db.init(quotas, groups, features)
  })

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
})
