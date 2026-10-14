import { generator } from "@budibase/backend-core/tests"
import { auth, cache, events, users } from "@budibase/backend-core"
import { db as proDb } from "@budibase/pro"
import { Feature, type UserGroup } from "@budibase/types"
import { TestConfiguration, mocks, structures } from "../../../../tests"
import * as userSdk from "../../../../sdk/users"

jest.mock("nodemailer")
const sendMailMock = mocks.email.mock()

describe("user group assignments", () => {
  const config = new TestConfiguration()

  beforeAll(async () => {
    await config.beforeAll()
  })

  afterAll(async () => {
    await config.afterAll()
  })

  beforeEach(() => {
    jest.clearAllMocks()
    mocks.licenses.useUnlimited({ features: [Feature.USER_GROUPS] })
  })

  const createGroup = async (extra: Partial<UserGroup> = {}) => {
    const group: UserGroup = {
      ...structures.groups.UserGroup(),
      _id: proDb.groups.generateUserGroupID(),
      roles: {},
      ...extra,
    }
    await config.doInTenant(() => proDb.groups.save(group))
    return group
  }

  it("persists assignments to an existing local group", async () => {
    const group = await createGroup()
    const user = await config.createUser({
      email: structures.users.newEmail(),
    })

    await config.api.users.saveUser({ ...user, userGroups: [group._id!] })

    const saved = await config.api.users.getUser(user._id!)
    expect(saved.body.userGroups).toEqual([group._id])
    expect(events.group.usersAdded).toHaveBeenCalledWith(
      1,
      expect.objectContaining({ _id: group._id }),
      [user._id]
    )
  })

  it("creates a user with groups and records the membership", async () => {
    const group = await createGroup()
    const user = await config.createUser({
      email: structures.users.newEmail(),
      userGroups: [group._id!],
    })

    expect(user.userGroups).toEqual([group._id])
    expect(events.group.usersAdded).toHaveBeenCalledWith(
      1,
      expect.objectContaining({ _id: group._id }),
      [user._id]
    )
  })

  it("replaces and clears memberships, including cached permissions", async () => {
    const first = await createGroup({
      builder: { apps: ["app_example"] },
      roles: { app_example: "CREATOR" },
    })
    const second = await createGroup()
    const user = await config.createUser({
      email: structures.users.newEmail(),
      userGroups: [first._id!],
    })
    await config.doInTenant(() => cache.user.getUser({ userId: user._id! }))

    await config.api.users.saveUser({ ...user, userGroups: [second._id!] })
    const replaced = await config.api.users.getUser(user._id!)
    await config.api.users.saveUser({ ...replaced.body, userGroups: [] })

    const refreshed = await config.doInTenant(() =>
      cache.user.getUser({ userId: user._id! })
    )
    expect(replaced.body.userGroups).toEqual([second._id])
    expect(refreshed.userGroups).toEqual([])
    expect(refreshed.builder?.apps || []).not.toContain("app_example")
    expect(events.group.usersDeleted).toHaveBeenCalledWith(
      1,
      expect.objectContaining({ _id: first._id }),
      [user._id]
    )
    expect(events.group.usersDeleted).toHaveBeenCalledWith(
      1,
      expect.objectContaining({ _id: second._id }),
      [user._id]
    )
  })

  it.each([false, true])(
    "removes missing memberships while updating user fields (replace: %s)",
    async replace => {
      const group = await createGroup()
      const user = await config.createUser()
      const seeded = await config.doInTenant(() =>
        users.UserDB.save({ ...user, userGroups: ["gr_missing"] })
      )
      jest.clearAllMocks()

      await config.api.users.saveUser({
        ...seeded,
        firstName: "Updated",
        userGroups: replace ? [group._id!] : [],
      })

      const saved = await config.api.users.getUser(user._id!)
      expect(saved.body).toMatchObject({
        firstName: "Updated",
        userGroups: replace ? [group._id] : [],
      })
      expect(events.group.usersDeleted).not.toHaveBeenCalled()
      if (replace) {
        expect(events.group.usersAdded).toHaveBeenCalledWith(
          1,
          expect.objectContaining({ _id: group._id }),
          [user._id]
        )
      } else {
        expect(events.group.usersAdded).not.toHaveBeenCalled()
      }
    }
  )

  it("preserves omitted memberships without adding membership events", async () => {
    const group = await createGroup({ roles: { app_example: "CREATOR" } })
    const user = await config.createUser({ userGroups: [group._id!] })
    const creators = await config.doInTenant(() => users.getCreatorCount())
    await mocks.licenses.setCreatorsQuota(creators)
    jest.clearAllMocks()

    await config.api.users.saveUser({
      _id: user._id,
      _rev: user._rev,
      email: user.email,
      tenantId: user.tenantId,
      roles: user.roles,
      firstName: "Updated",
    })

    const saved = await config.api.users.getUser(user._id!)
    expect(saved.body).toMatchObject({
      firstName: "Updated",
      userGroups: [group._id],
    })
    expect(events.group.usersAdded).not.toHaveBeenCalled()
    expect(events.group.usersDeleted).not.toHaveBeenCalled()
  })

  it("rejects adding a user to a SCIM-managed group through user saves", async () => {
    const group = await createGroup({
      scimInfo: { externalId: generator.guid(), isSync: true },
    })
    const user = await config.createUser({
      email: structures.users.newEmail(),
    })

    await config.api.groups.updateGroupUsers(
      group._id!,
      { add: [user._id!], remove: [] },
      { expect: 404 }
    )
    await config.api.users.saveUser({ ...user, userGroups: [group._id!] }, 404)

    const saved = await config.api.users.getUser(user._id!)
    expect(saved.body.userGroups || []).toEqual([])
  })

  it("rejects removing SCIM memberships but allows retaining them", async () => {
    const group = await createGroup({
      scimInfo: { externalId: generator.guid(), isSync: true },
    })
    const local = await createGroup()
    const user = await config.createUser()
    const seeded = await config.doInTenant(() =>
      users.UserDB.save({ ...user, userGroups: [group._id!] })
    )

    await config.api.users.saveUser({ ...seeded, userGroups: [] }, 404)
    await config.api.users.saveUser({
      ...seeded,
      firstName: "Updated",
      userGroups: [group._id!, local._id!],
    })

    const saved = await config.api.users.getUser(user._id!)
    expect(saved.body).toMatchObject({
      firstName: "Updated",
      userGroups: [group._id, local._id],
    })
  })

  it.each([null, "gr_example", [123], [""], ["us_example"], ["gr_a", "gr_a"]])(
    "rejects malformed memberships %j",
    async userGroups => {
      const user = await config.createUser()
      await config.request
        .post("/api/global/users")
        .set(config.defaultHeaders())
        .send({ ...user, userGroups })
        .expect(400)

      const saved = await config.api.users.getUser(user._id!)
      expect(saved.body.userGroups || []).toEqual([])
    }
  )

  it("rejects unknown and other-tenant groups before changing the user", async () => {
    const user = await config.createUser()
    const foreignGroup = await config.doInSpecificTenant(
      structures.tenant.id(),
      () =>
        proDb.groups.save({
          ...structures.groups.UserGroup(),
          _id: proDb.groups.generateUserGroupID(),
          roles: {},
        })
    )
    for (const groupId of ["gr_missing", foreignGroup.id]) {
      await config.api.users.saveUser(
        { ...user, firstName: "Rejected", userGroups: [groupId] },
        404
      )
    }

    const saved = await config.api.users.getUser(user._id!)
    expect(saved.body.firstName).toBe(user.firstName)
    expect(saved.body.userGroups || []).toEqual([])
  })

  it("requires the groups feature to change memberships", async () => {
    const group = await createGroup()
    const user = await config.createUser()
    mocks.licenses.useUnlimited()

    await config.api.users.saveUser({ ...user, userGroups: [group._id!] }, 400)

    const saved = await config.api.users.getUser(user._id!)
    expect(saved.body.userGroups || []).toEqual([])
  })

  it("requires admin permissions", async () => {
    const group = await createGroup()
    const user = await config.createUser(structures.users.builderUser())
    await config.createSession(user)

    await config.withUser(user, () =>
      config.api.users.saveUser({ ...user, userGroups: [group._id!] }, 403)
    )

    const saved = await config.api.users.getUser(user._id!)
    expect(saved.body.userGroups || []).toEqual([])
  })

  it("rejects creator membership when the creator quota is full", async () => {
    const group = await createGroup({ roles: { app_example: "CREATOR" } })
    const user = await config.createUser({
      email: structures.users.newEmail(),
    })
    const creators = await config.doInTenant(() => users.getCreatorCount())
    await mocks.licenses.setCreatorsQuota(creators)

    const response = await config.api.users.saveUser(
      { ...user, userGroups: [group._id!] },
      400
    )

    const saved = await config.api.users.getUser(user._id!)
    expect(response.body.message).toBe("Usage limit exceeded: 'creators'")
    expect(saved.body.userGroups || []).toEqual([])
    expect(events.group.usersAdded).not.toHaveBeenCalled()
  })

  it("allows removing creator membership when the creator quota is full", async () => {
    const group = await createGroup({ roles: { app_example: "CREATOR" } })
    const user = await config.createUser({ userGroups: [group._id!] })
    const creatorsBefore = await config.doInTenant(() =>
      users.getCreatorCount()
    )
    await mocks.licenses.setCreatorsQuota(creatorsBefore)

    await config.api.users.saveUser({ ...user, userGroups: [] })

    const saved = await config.doInTenant(() => users.getById(user._id!))
    expect(saved.userGroups).toEqual([])
    expect(await config.doInTenant(() => users.isCreatorAsync(saved))).toBe(
      false
    )
  })

  it("rejects SCIM groups in bulk creation before creating users", async () => {
    const group = await createGroup({
      scimInfo: { externalId: generator.guid(), isSync: true },
    })
    const email = structures.users.newEmail()
    await config.request
      .post("/api/global/users/bulk")
      .set(config.defaultHeaders())
      .send({
        create: {
          users: [{ ...structures.users.user(), email }],
          groups: [group._id],
        },
      })
      .expect(404)

    const saved = await config.doInTenant(() =>
      users.getGlobalUserByEmail(email)
    )
    expect(saved).toBeUndefined()
  })

  it("records memberships for successfully bulk-created users", async () => {
    const group = await createGroup()
    const result = await config.api.users.bulkCreateUsers(
      [
        {
          ...structures.users.user(),
          email: structures.users.newEmail(),
        },
      ],
      [group._id!]
    )

    expect(events.group.usersAdded).toHaveBeenCalledWith(
      1,
      expect.objectContaining({ _id: group._id }),
      result.created!.successful.map(user => user._id)
    )
  })

  it("rejects invitations assigning SCIM groups", async () => {
    const group = await createGroup({
      scimInfo: { externalId: generator.guid(), isSync: true },
    })
    const email = structures.users.newEmail()
    const response = await config.api.users.sendMultiUserInvite([
      { email, userInfo: { userGroups: [group._id!] } },
    ])

    expect(response.body.unsuccessful).toEqual([
      { email, reason: "Group not found or managed by SCIM" },
    ])
    expect(sendMailMock).not.toHaveBeenCalled()
  })

  it("reports missing invitation groups while sending valid invitations", async () => {
    const group = await createGroup()
    const invalidEmail = structures.users.newEmail()
    const validEmail = structures.users.newEmail()

    const response = await config.api.users.sendMultiUserInvite([
      { email: invalidEmail, userInfo: { userGroups: ["gr_missing"] } },
      { email: validEmail, userInfo: { userGroups: [group._id!] } },
    ])

    expect(response.body).toMatchObject({
      unsuccessful: [
        {
          email: invalidEmail,
          reason: "Group not found or managed by SCIM",
        },
      ],
      successful: [{ email: validEmail }],
    })
    expect(sendMailMock).toHaveBeenCalledTimes(1)
    expect(events.group.usersAdded).not.toHaveBeenCalled()
    expect(
      await config.doInTenant(() => users.getGlobalUserByEmail(validEmail))
    ).toBeUndefined()
  })

  describe("default memberships", () => {
    let defaultGroup: UserGroup

    afterEach(async () => {
      await config.doInTenant(async () => {
        const group = await proDb.groups.get(defaultGroup._id!)
        await proDb.groups.save({ ...group, isDefault: false })
      })
    })

    it.each([
      { isSync: false, userGroups: undefined, bulk: false },
      { isSync: false, userGroups: [], bulk: false },
      { isSync: false, userGroups: undefined, bulk: true },
      { isSync: false, userGroups: [], bulk: true },
      { isSync: true, userGroups: undefined, bulk: false },
      { isSync: true, userGroups: [], bulk: false },
      { isSync: true, userGroups: undefined, bulk: true },
      { isSync: true, userGroups: [], bulk: true },
    ])(
      "validates default assignment (SCIM: $isSync, bulk: $bulk, groups: $userGroups)",
      async ({ isSync, userGroups, bulk }) => {
        defaultGroup = await createGroup({
          isDefault: true,
          scimInfo: { externalId: generator.guid(), isSync },
        })
        const email = structures.users.newEmail()
        const user = { ...structures.users.user(), email }
        await config.request
          .post(bulk ? "/api/global/users/bulk" : "/api/global/users")
          .set(config.defaultHeaders())
          .send(
            bulk
              ? { create: { users: [user], groups: userGroups } }
              : { ...user, userGroups }
          )
          .expect(isSync ? 404 : 200)

        const saved = await config.doInTenant(() =>
          users.getGlobalUserByEmail(email)
        )
        if (isSync) {
          expect(saved).toBeUndefined()
          expect(events.group.usersAdded).not.toHaveBeenCalled()
        } else {
          expect(saved?.userGroups).toEqual([defaultGroup._id])
          expect(events.group.usersAdded).toHaveBeenCalledWith(
            1,
            expect.objectContaining({ _id: defaultGroup._id }),
            [saved!._id]
          )
        }
      }
    )
  })

  describe("SSO invitation acceptance", () => {
    const login = async ({
      email,
      providerUserId,
    }: {
      email: string
      providerUserId: string
    }) => {
      const done = jest.fn()
      await config.doInTenant(() =>
        auth.google.buildVerifyFn(userSdk.saveSSO)(
          "access-token",
          "refresh-token",
          {
            id: providerUserId,
            _json: { email, email_verified: true },
          },
          done
        )
      )
      return done
    }

    it.each(["SCIM", "unlicensed"])(
      "rejects a pending invitation with %s memberships at acceptance",
      async restriction => {
        const group = await createGroup({
          scimInfo: {
            externalId: generator.guid(),
            isSync: restriction === "SCIM",
          },
        })
        const email = structures.users.newEmail()
        const code = await config.doInTenant(() =>
          cache.invite.createCode(email, { userGroups: [group._id!] })
        )
        if (restriction === "unlicensed") {
          mocks.licenses.useUnlimited({ features: [] })
        }

        const done = await login({ email, providerUserId: generator.guid() })

        expect(done).toHaveBeenCalledWith(expect.any(Error), null, {
          message: "Error saving user",
        })
        expect(
          await config.doInTenant(() => users.getGlobalUserByEmail(email))
        ).toBeUndefined()
        expect(
          await config.doInTenant(() => cache.invite.getCode(code))
        ).toMatchObject({ email })
      }
    )

    it("accepts a local-group invitation and preserves it on repeat login", async () => {
      const group = await createGroup()
      const email = structures.users.newEmail()
      const providerUserId = generator.guid()
      await config.doInTenant(() =>
        cache.invite.createCode(email, { userGroups: [group._id!] })
      )

      await login({ email, providerUserId })
      const done = await login({ email, providerUserId })

      expect(done).toHaveBeenCalledWith(
        null,
        expect.objectContaining({ userGroups: [group._id] })
      )
      expect(
        await config.doInTenant(() => users.getGlobalUserByEmail(email))
      ).toMatchObject({ userGroups: [group._id] })
      expect(events.group.usersAdded).toHaveBeenCalledTimes(1)
      expect(
        await config.doInTenant(() => cache.invite.getExistingInvites([email]))
      ).toEqual([])
    })
  })
})
