import TestConfiguration from "../../../../tests/utilities/TestConfiguration"

import { context, events, roles } from "@budibase/backend-core"
import { generator, utils } from "@budibase/backend-core/tests"
import { sdk as proSdk } from "@budibase/pro"
import { User, UserGroup, UserMetadata } from "@budibase/types"
import {
  UserSyncProcessor,
  getUserSyncProcessor,
} from "../../../../events/docUpdates/syncUsers"
import { rawUserMetadata } from "../../../users/utils"
import * as workspaceSync from "../sync"
import { generateUserMetadataID } from "../../../../db/utils"

jest.mock("../sync", () => {
  const actual = jest.requireActual("../sync")
  return {
    ...actual,
    syncUsersAcrossWorkspaces: jest
      .fn()
      .mockImplementation(actual.syncUsersAcrossWorkspaces),
  }
})

const config = new TestConfiguration()
let group: UserGroup, groupUser: User

beforeAll(async () => {
  await utils.queue.useRealQueues()
  await config.init("syncWorkspace")
})

async function createUser(user?: Partial<User>) {
  const persistedUser = await config.createUser({
    builder: { global: false },
    ...user,
  })
  await context.doInContext(config.devWorkspaceId!, async () => {
    await events.user.created(persistedUser)
  })
  return persistedUser
}

async function updateUser(user: User) {
  const final = await config.globalUser(user)
  await context.doInContext(config.devWorkspaceId!, async () => {
    await events.user.updated(final)
  })
}

async function createGroupAndUser(email: string) {
  groupUser = await config.createUser({
    email,
    roles: {},
    builder: { global: false },
    admin: { global: false },
  })
  group = await config.createGroup()
  await config.addUserToGroup(group._id!, groupUser._id!)
}

async function removeUserFromGroup() {
  await config.removeUserFromGroup(group._id!, groupUser._id!)
  return context.doInContext(config.devWorkspaceId!, async () => {
    await events.user.updated(groupUser)
  })
}

async function getMetadata(
  email: string,
  workspaceId = config.devWorkspaceId!
) {
  await utils.queue.processMessages(events.asyncEventQueue.getBullQueue())
  await utils.queue.processMessages(UserSyncProcessor.queue.getBullQueue())

  const metadata: UserMetadata[] = await context.doInContext(workspaceId, () =>
    rawUserMetadata()
  )
  const found = metadata.find(data => data.email === email)
  return found
}

async function removeMetadataFromWorkspace(
  workspaceId: string,
  userId: string
) {
  await context.doInContext(workspaceId, async () => {
    const db = context.getWorkspaceDB()
    try {
      const doc = await db.get(generateUserMetadataID(userId))
      await db.remove(doc)
    } catch (err: any) {
      if (err.status !== 404) {
        throw err
      }
    }
  })
}

describe("app user/group sync", () => {
  it("should be able to sync a new user, add then remove", async () => {
    const email = generator.email({})
    const user = await createUser({
      email,
      roles: { [config.prodWorkspaceId!]: "BASIC" },
      builder: { global: false },
    })
    expect(await getMetadata(email)).toEqual(
      expect.objectContaining({
        roleId: "BASIC",
        builder: expect.objectContaining({ global: false }),
      })
    )
    await updateUser({ ...user, roles: {} })
    expect(await getMetadata(email)).toBeUndefined()
  })

  it("should be able to sync a group", async () => {
    const email = generator.email({})
    await createGroupAndUser(email)
    expect(await getMetadata(email)).toEqual(
      expect.objectContaining({
        roleId: "BASIC",
        builder: expect.objectContaining({ global: false }),
      })
    )
  })

  it("should be able to remove user from group", async () => {
    const email = generator.email({})
    if (!group) {
      await createGroupAndUser(email)
    }
    await removeUserFromGroup()
    expect(await getMetadata(email)).toBeUndefined()
  })

  it("should be able to handle builder users", async () => {
    const email = generator.email({})
    const user = await createUser({ email, builder: { global: true } })
    expect(await getMetadata(email)).toEqual(
      expect.objectContaining({
        roleId: roles.BUILTIN_ROLE_IDS.ADMIN,
        builder: expect.objectContaining({ global: true }),
      })
    )

    await updateUser({
      ...user,
      builder: { global: false },
    })
    expect(await getMetadata(email)).toBeUndefined()
  })

  it("should be able to remove builder users", async () => {
    const email = "test3@example.com"
    const user = await createUser({ email, builder: { global: true } })
    expect(await getMetadata(email)).toEqual(
      expect.objectContaining({
        roleId: roles.BUILTIN_ROLE_IDS.ADMIN,
        builder: expect.objectContaining({ global: true }),
      })
    )

    await updateUser({
      ...user,
      roles: { [config.getProdWorkspaceId()]: roles.BUILTIN_ROLE_IDS.BASIC },
      builder: { global: false },
      admin: { global: false },
    })
    expect(await getMetadata(email)).toEqual(
      expect.objectContaining({
        roleId: roles.BUILTIN_ROLE_IDS.BASIC,
        builder: expect.objectContaining({ global: false }),
      })
    )
  })

  it("should promote group builders to admin role", async () => {
    const email = generator.email({})
    await createGroupAndUser(email)
    const prodWorkspaceId = config.getProdWorkspaceId()
    await config.doInTenant(async () => {
      await proSdk.groups.save({
        ...group,
        builder: {
          apps: [prodWorkspaceId],
        },
      })
    })
    group = {
      ...group,
      builder: {
        apps: [prodWorkspaceId],
      },
    }
    expect(await getMetadata(email)).toEqual(
      expect.objectContaining({
        roleId: roles.BUILTIN_ROLE_IDS.ADMIN,
        builder: expect.objectContaining({ apps: [prodWorkspaceId] }),
      })
    )
  })

  it("should remove builder role when group no longer builder", async () => {
    const email = generator.email({})
    await createGroupAndUser(email)
    const prodWorkspaceId = config.getProdWorkspaceId()
    await config.doInTenant(async () => {
      const response = await proSdk.groups.save({
        ...group,
        builder: {
          apps: [prodWorkspaceId],
        },
      })

      group = await proSdk.groups.get(response.id)
    })
    expect(await getMetadata(email)).toEqual(
      expect.objectContaining({
        roleId: roles.BUILTIN_ROLE_IDS.ADMIN,
        builder: {
          apps: [prodWorkspaceId],
        },
      })
    )

    await config.doInTenant(async () => {
      await proSdk.groups.save({
        ...group,
        builder: undefined,
      })
    })
    expect(await getMetadata(email)).toEqual(
      expect.objectContaining({
        roleId: roles.BUILTIN_ROLE_IDS.BASIC,
        builder: { global: false },
      })
    )
  })

  it("should be able to handle role changes", async () => {
    const workspaceId = config.getProdWorkspaceId()
    const user = await createUser({
      email: generator.email({}),
      roles: {
        [workspaceId]: "ADMIN",
      },
    })
    expect(await getMetadata(user.email)).toEqual(
      expect.objectContaining({ roleId: "ADMIN" })
    )
    await updateUser({
      ...user,
      roles: {
        ...user.roles,
        [workspaceId]: "BASIC",
      },
    })
    expect(await getMetadata(user.email)).toEqual(
      expect.objectContaining({ roleId: "BASIC" })
    )
  })
})

describe("user sync batching", () => {
  it("should batch waiting jobs into a single sync call", async () => {
    const processor = getUserSyncProcessor()
    const mockSync =
      workspaceSync.syncUsersAcrossWorkspaces as jest.MockedFunction<
        typeof workspaceSync.syncUsersAcrossWorkspaces
      >

    mockSync.mockClear()

    await UserSyncProcessor.queue.getBullQueue().pause()
    await processor.add(["batch-user-1"])
    await processor.add(["batch-user-2"])
    await processor.add(["batch-user-1"])
    await UserSyncProcessor.queue.getBullQueue().resume()
    await utils.queue.processMessages(UserSyncProcessor.queue.getBullQueue())

    expect(mockSync).toHaveBeenCalledTimes(1)
    expect(mockSync).toHaveBeenCalledWith(["batch-user-1", "batch-user-2"])
  })

  it("syncs users from group", async () => {
    const group = await config.createGroup(roles.BUILTIN_ROLE_IDS.ADMIN)

    const user = await createUser()
    expect(await getMetadata(user.email)).toBeUndefined()

    await config.addUserToGroup(group._id, user._id!)
    expect(await getMetadata(user.email)).toEqual(
      expect.objectContaining({ roleId: "ADMIN" })
    )

    await config.updateGroup({
      ...group,
      roles: {
        ...group.roles,
        [config.getProdWorkspaceId()]: "BASIC",
      },
    })
    expect(await getMetadata(user.email)).toEqual(
      expect.objectContaining({ roleId: "BASIC" })
    )

    await config.removeUserFromGroup(group._id, user._id!)
    expect(await getMetadata(user.email)).toBeUndefined()
  })
})

describe("syncUsersAgainstWorkspaces", () => {
  it("syncs both the provided workspace and its dev counterpart", async () => {
    const workspaceId = config.getProdWorkspaceId()
    const email = generator.email({})
    const user = await createUser({
      email,
      roles: {
        [workspaceId]: "BASIC",
      },
    })

    // ensure queues processed before mutating metadata directly
    await getMetadata(email)

    await removeMetadataFromWorkspace(config.devWorkspaceId!, user._id!)
    await removeMetadataFromWorkspace(workspaceId, user._id!)

    expect(await getMetadata(email)).toBeUndefined()
    expect(await getMetadata(email, workspaceId)).toBeUndefined()

    await config.doInTenant(async () => {
      await workspaceSync.syncUsersAgainstWorkspaces([user._id!], [workspaceId])
    })

    const expected = expect.objectContaining({ roleId: "BASIC" })
    expect(await getMetadata(email, workspaceId)).toEqual(expected)
    expect(await getMetadata(email)).toEqual(expected)
  })
})
