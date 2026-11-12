import { groups } from "@budibase/pro"
import { TestConfiguration, mocks, structures } from "../../../../tests"

describe("user group assignment after a license downgrade", () => {
  const config = new TestConfiguration()
  let defaultGroupId: string

  beforeEach(async () => {
    jest.clearAllMocks()
    mocks.licenses.useUnlimited()
    mocks.licenses.useGroups()
    await config.useNewTenant()
    const defaultGroup = await config.doInTenant(() =>
      groups.save({
        ...structures.groups.UserGroup(),
        roles: {},
        isDefault: true,
      })
    )
    defaultGroupId = defaultGroup.id
    mocks.licenses.useCloudFree()
  })

  afterAll(async () => {
    await config.afterAll()
  })

  it.each([undefined, []])(
    "assigns the default group when creating a user with userGroups %j",
    async userGroups => {
      const user = structures.users.user({ userGroups })

      await config.api.users.saveUser(user)

      const saved = await config.getUser(user.email)
      expect(saved.userGroups).toEqual([defaultGroupId])
    }
  )

  it("assigns the default group when bulk creating users without explicit groups", async () => {
    const user = structures.users.user()

    await config.api.users.bulkCreateUsers([user])

    const saved = await config.getUser(user.email)
    expect(saved.userGroups).toEqual([defaultGroupId])
  })

  it("rejects explicitly assigning the default group when creating a user", async () => {
    const response = await config.api.users.saveUser(
      structures.users.user({ userGroups: [defaultGroupId] }),
      400
    )

    expect(response.body.message).toBe("Feature disabled: 'userGroups'")
  })

  it("rejects explicitly assigning the default group when bulk creating users", async () => {
    const response = await config
      .getRequest()
      .post("/api/global/users/bulk")
      .send({
        create: {
          users: [structures.users.user()],
          groups: [defaultGroupId],
        },
      })
      .set(config.defaultHeaders())
      .expect(400)

    expect(response.body.message).toBe("Feature disabled: 'userGroups'")
  })

  it("rejects explicitly removing existing group memberships", async () => {
    mocks.licenses.useGroups()
    const user = await config.createUser({ userGroups: [defaultGroupId] })
    mocks.licenses.useCloudFree()

    const response = await config.api.users.saveUser(
      { ...user, userGroups: [] },
      400
    )

    expect(response.body.message).toBe("Feature disabled: 'userGroups'")
  })
})
