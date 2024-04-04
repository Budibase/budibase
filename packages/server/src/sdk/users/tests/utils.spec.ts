import { db, roles } from "@budibase/backend-core"
import { structures } from "@budibase/backend-core/tests"
import { sdk as proSdk } from "@budibase/pro"

import TestConfiguration from "../../../tests/utilities/TestConfiguration"
import { rawUserMetadata, syncGlobalUsers } from "../utils"

describe("syncGlobalUsers", () => {
  const config = new TestConfiguration()

  beforeEach(async () => {
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

  it("app users are not synced if not specified", async () => {
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

  it("app users are added when group is assigned to app", async () => {
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

  it("app users are removed when app is removed from user group", async () => {
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
