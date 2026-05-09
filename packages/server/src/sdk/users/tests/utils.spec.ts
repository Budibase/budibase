import { context, db, roles } from "@budibase/backend-core"
import { structures } from "@budibase/backend-core/tests"
import { sdk as proSdk } from "@budibase/pro"
import tk from "timekeeper"

import TestConfiguration from "../../../tests/utilities/TestConfiguration"
import { fetchMetadata, rawUserMetadata, syncGlobalUsers } from "../utils"

describe("syncGlobalUsers", () => {
  const config = new TestConfiguration()

  beforeAll(async () => {
    await config.init()
  })

  beforeEach(async () => {
    await config.newTenant()
    tk.reset()
  })

  afterAll(config.end)

  it("the default user is synced", async () => {
    await config.doInContext(config.devWorkspaceId, async () => {
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
    await config.doInContext(config.devWorkspaceId, async () => {
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
        [config.getProdWorkspaceId()]: roles.BUILTIN_ROLE_IDS.BASIC,
      },
    })
    const user2 = await config.createUser({
      admin: { global: false },
      builder: { global: false },
    })
    await config.doInContext(config.devWorkspaceId, async () => {
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

  it("does not compute fullName when first and last names are empty", async () => {
    const user = await config.createUser({
      firstName: "",
      lastName: "",
      admin: { global: false },
      builder: { global: false },
      roles: {
        [config.getProdWorkspaceId()]: roles.BUILTIN_ROLE_IDS.BASIC,
      },
    })

    await config.doInContext(config.devWorkspaceId, async () => {
      await syncGlobalUsers()

      const metadata = await fetchMetadata()
      expect(metadata).toContainEqual(
        expect.objectContaining({
          _id: db.generateUserMetadataID(user._id!),
          fullName: undefined,
        })
      )
    })
  })

  it("uses single-name computed fullName fallback when only one name part exists", async () => {
    const user = await config.createUser({
      firstName: "Only",
      lastName: "",
      admin: { global: false },
      builder: { global: false },
      roles: {
        [config.getProdWorkspaceId()]: roles.BUILTIN_ROLE_IDS.BASIC,
      },
    })

    await config.doInContext(config.devWorkspaceId, async () => {
      await syncGlobalUsers()

      const metadata = await fetchMetadata()
      expect(metadata).toContainEqual(
        expect.objectContaining({
          _id: db.generateUserMetadataID(user._id!),
          fullName: "Only",
        })
      )
    })
  })

  it("uses single-name computed fullName fallback when only last name exists", async () => {
    const user = await config.createUser({
      firstName: "",
      lastName: "SurnameOnly",
      admin: { global: false },
      builder: { global: false },
      roles: {
        [config.getProdWorkspaceId()]: roles.BUILTIN_ROLE_IDS.BASIC,
      },
    })

    await config.doInContext(config.devWorkspaceId, async () => {
      await syncGlobalUsers()

      const metadata = await fetchMetadata()
      expect(metadata).toContainEqual(
        expect.objectContaining({
          _id: db.generateUserMetadataID(user._id!),
          fullName: "SurnameOnly",
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
        [config.getProdWorkspaceId()]: roles.BUILTIN_ROLE_IDS.BASIC,
      },
    })
    await config.doInContext(config.devWorkspaceId, async () => {
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

  it("computes fullName in fetchMetadata when missing from persisted metadata", async () => {
    const user = await config.createUser({
      firstName: "Jane",
      lastName: "Doe",
      admin: { global: false },
      builder: { global: false },
      roles: {
        [config.getProdWorkspaceId()]: roles.BUILTIN_ROLE_IDS.BASIC,
      },
    })

    await config.doInContext(config.devWorkspaceId, async () => {
      const workspaceDb = context.getWorkspaceDB()
      const userMetadataId = db.generateUserMetadataID(user._id!)
      await workspaceDb.put({
        _id: userMetadataId,
        tableId: "ta_users",
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        roleId: roles.BUILTIN_ROLE_IDS.BASIC,
      })

      const metadata = await fetchMetadata()
      const found = metadata.find(doc => doc._id === userMetadataId)
      expect(found?.fullName).toEqual("Jane Doe")
    })
  })

  it("workspace users are not synced if not specified", async () => {
    const user = await config.createUser({
      admin: { global: false },
      builder: { global: false },
    })
    await config.doInContext(config.devWorkspaceId, async () => {
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

      await config.doInContext(config.devWorkspaceId, async () => {
        await syncGlobalUsers()
        expect(await rawUserMetadata()).toHaveLength(1)

        await proSdk.groups.updateGroupApps(group.id, {
          appsToAdd: [
            {
              appId: config.prodWorkspaceId!,
              roleId: roles.BUILTIN_ROLE_IDS.BASIC,
            },
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
          {
            appId: config.prodWorkspaceId!,
            roleId: roles.BUILTIN_ROLE_IDS.BASIC,
          },
        ],
      })
      await proSdk.groups.addUsers(group.id, [user1._id!, user2._id!])

      await config.doInContext(config.devWorkspaceId, async () => {
        await syncGlobalUsers()
        expect(await rawUserMetadata()).toHaveLength(3)

        await proSdk.groups.updateGroupApps(group.id, {
          appsToRemove: [{ appId: config.prodWorkspaceId! }],
        })
        await syncGlobalUsers()

        const metadata = await rawUserMetadata()
        expect(metadata).toHaveLength(1) // ADMIN user created in test bootstrap still in the application
      })
    })
  })
})
