import { db, roles } from "@budibase/backend-core"
import { structures } from "@budibase/backend-core/tests"
import { sdk as proSdk } from "@budibase/pro"
import tk from "timekeeper"

import TestConfiguration from "../../../tests/utilities/TestConfiguration"
import { rawUserMetadata, syncGlobalUsers } from "../utils"

describe("syncGlobalUsers", () => {
  const config = new TestConfiguration()

  beforeEach(async () => {
    tk.reset()
    await config.init()
  })

  afterAll(config.end)

  it("the default user is synced", async () => {
    await config.doInContext(config.appId, async () => {
      await syncGlobalUsers()

      const metadata = await rawUserMetadata()
      expect(metadata).toHaveLength(1)
      expect(metadata).toEqual([
        expect.objectContaining({
          _id: db.generateUserMetadataID(config.getUser()._id!),
        }),
      ])
    })
  })

  it("admin and builders users are synced", async () => {
    const user1 = await config.createUser({ admin: { global: true } })
    const user2 = await config.createUser({
      admin: { global: false },
      builder: { global: true },
    })
    await config.doInContext(config.appId, async () => {
      let metadata = await rawUserMetadata()
      expect(metadata).not.toContainEqual(
        expect.objectContaining({
          _id: db.generateUserMetadataID(user1._id!),
        })
      )
      expect(metadata).not.toContainEqual(
        expect.objectContaining({
          _id: db.generateUserMetadataID(user2._id!),
        })
      )
      await syncGlobalUsers()

      metadata = await rawUserMetadata()
      expect(metadata).toContainEqual(
        expect.objectContaining({
          _id: db.generateUserMetadataID(user1._id!),
        })
      )
      expect(metadata).toContainEqual(
        expect.objectContaining({
          _id: db.generateUserMetadataID(user2._id!),
        })
      )
    })
  })

  it("workspace users are synced", async () => {
    const initalDate = new Date()
    tk.freeze(initalDate)
    const user1 = await config.createUser({
      admin: { global: false },
      builder: { global: false },
      roles: {
        [config.getProdAppId()]: roles.BUILTIN_ROLE_IDS.BASIC,
      },
    })
    const user2 = await config.createUser({
      admin: { global: false },
      builder: { global: false },
    })
    await config.doInContext(config.appId, async () => {
      let metadata = await rawUserMetadata()
      expect(metadata).not.toContainEqual(
        expect.objectContaining({
          _id: db.generateUserMetadataID(user1._id!),
        })
      )
      expect(metadata).not.toContainEqual(
        expect.objectContaining({
          _id: db.generateUserMetadataID(user2._id!),
        })
      )

      tk.freeze(new Date(Date.now() + 1000))
      await syncGlobalUsers()

      metadata = await rawUserMetadata()
      expect(metadata).toContainEqual({
        _id: db.generateUserMetadataID(user1._id!),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),

        email: user1.email,
        firstName: user1.firstName,
        lastName: user1.lastName,
        builder: { global: false },
        admin: { global: false },

        roleId: "BASIC",
        tableId: "ta_users",
        tenantId: config.getTenantId(),
        _rev: expect.stringMatching(/^1-\w+/),
      })
      expect(metadata).not.toContainEqual(
        expect.objectContaining({
          _id: db.generateUserMetadataID(user2._id!),
        })
      )
    })
  })

  it("workspace users audit data is updated", async () => {
    tk.freeze(new Date())
    const user1 = await config.createUser({
      admin: { global: false },
      builder: { global: false },
      roles: {
        [config.getProdAppId()]: roles.BUILTIN_ROLE_IDS.BASIC,
      },
    })
    await config.doInContext(config.appId, async () => {
      tk.freeze(new Date(Date.now() + 1000))
      const updatedTime = new Date()

      await syncGlobalUsers()

      tk.freeze(new Date(Date.now() + 1000))
      await config.createUser({
        ...user1,
        firstName: "updatedName",
      })
      tk.freeze(new Date(Date.now() + 1000))

      await syncGlobalUsers()

      const metadata = await rawUserMetadata()
      expect(metadata).toContainEqual(
        expect.objectContaining({
          _id: db.generateUserMetadataID(user1._id!),
          createdAt: updatedTime.toISOString(),
          updatedAt: new Date().toISOString(),
        })
      )
    })
  })

  it("workspace users are not synced if not specified", async () => {
    const user = await config.createUser({
      admin: { global: false },
      builder: { global: false },
    })
    await config.doInContext(config.appId, async () => {
      await syncGlobalUsers()

      const metadata = await rawUserMetadata()
      expect(metadata).not.toContainEqual(
        expect.objectContaining({
          _id: db.generateUserMetadataID(user._id!),
        })
      )
    })
  })

  it("workspace users are added when group is assigned to workspace", async () => {
    await config.doInTenant(async () => {
      const group = await proSdk.groups.save(structures.userGroups.userGroup())
      const user1 = await config.createUser({
        admin: { global: false },
        builder: { global: false },
      })
      const user2 = await config.createUser({
        admin: { global: false },
        builder: { global: false },
      })
      await proSdk.groups.addUsers(group.id, [user1._id!, user2._id!])

      await config.doInContext(config.appId, async () => {
        await syncGlobalUsers()
        expect(await rawUserMetadata()).toHaveLength(1)

        await proSdk.groups.updateGroupApps(group.id, {
          appsToAdd: [
            { appId: config.prodAppId!, roleId: roles.BUILTIN_ROLE_IDS.BASIC },
          ],
        })
        await syncGlobalUsers()

        const metadata = await rawUserMetadata()

        expect(metadata).toHaveLength(2 + 1) // ADMIN user created in test bootstrap still in the application
        expect(metadata).toContainEqual(
          expect.objectContaining({
            _id: db.generateUserMetadataID(user1._id!),
          })
        )
        expect(metadata).toContainEqual(
          expect.objectContaining({
            _id: db.generateUserMetadataID(user2._id!),
          })
        )
      })
    })
  })

  it("workspace users are removed when workspace is removed from user group", async () => {
    await config.doInTenant(async () => {
      const group = await proSdk.groups.save(structures.userGroups.userGroup())
      const user1 = await config.createUser({
        admin: { global: false },
        builder: { global: false },
      })
      const user2 = await config.createUser({
        admin: { global: false },
        builder: { global: false },
      })
      await proSdk.groups.updateGroupApps(group.id, {
        appsToAdd: [
          { appId: config.prodAppId!, roleId: roles.BUILTIN_ROLE_IDS.BASIC },
        ],
      })
      await proSdk.groups.addUsers(group.id, [user1._id!, user2._id!])

      await config.doInContext(config.appId, async () => {
        await syncGlobalUsers()
        expect(await rawUserMetadata()).toHaveLength(3)

        await proSdk.groups.updateGroupApps(group.id, {
          appsToRemove: [{ appId: config.prodAppId! }],
        })
        await syncGlobalUsers()

        const metadata = await rawUserMetadata()
        expect(metadata).toHaveLength(1) // ADMIN user created in test bootstrap still in the application
      })
    })
  })
})
