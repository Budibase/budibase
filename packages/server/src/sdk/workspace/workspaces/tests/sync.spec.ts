import TestConfiguration from "../../../../tests/utilities/TestConfiguration"

import { context, events, roles } from "@budibase/backend-core"
import { utils } from "@budibase/backend-core/tests"
import { User, UserGroup, UserMetadata, UserRoles } from "@budibase/types"
import {
  UserSyncProcessor,
  getUserSyncProcessor,
} from "../../../../events/docUpdates/syncUsers"
import { rawUserMetadata } from "../../../users/utils"
import * as workspaceSync from "../sync"

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
const ROLE_ID = roles.BUILTIN_ROLE_IDS.BASIC

async function waitForUpdate() {
  await utils.queue.processMessages(events.asyncEventQueue.getBullQueue())
  await utils.queue.processMessages(UserSyncProcessor.queue.getBullQueue())
}

beforeAll(async () => {
  await utils.queue.useRealQueues()
  await config.init("syncWorkspace")
})

async function createUser(email: string, roles: UserRoles, builder?: boolean) {
  const user = await config.createUser({
    email,
    roles,
    builder: { global: builder || false },
    admin: { global: false },
  })
  await context.doInContext(config.devWorkspaceId!, async () => {
    await events.user.created(user)
  })
  return user
}

async function removeUserRole(user: User) {
  const final = await config.globalUser({
    ...user,
    _id: user._id,
    roles: {},
    builder: { global: false },
    admin: { global: false },
  })
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

async function getUserMetadata(): Promise<UserMetadata[]> {
  return context.doInContext(config.devWorkspaceId!, async () => {
    return await rawUserMetadata()
  })
}

function buildRoles() {
  return { [config.prodWorkspaceId!]: ROLE_ID }
}

describe("app user/group sync", () => {
  const groupEmail = "test2@example.com",
    normalEmail = "test@example.com"
  async function checkEmail(
    email: string,
    opts?: { group?: boolean; notFound?: boolean }
  ) {
    await waitForUpdate()
    const metadata = await getUserMetadata()
    const found = metadata.find(data => data.email === email)
    if (opts?.notFound) {
      expect(found).toBeUndefined()
    } else {
      expect(found).toBeDefined()
    }
  }

  it("should be able to sync a new user, add then remove", async () => {
    const user = await createUser(normalEmail, buildRoles())
    await checkEmail(normalEmail)
    await removeUserRole(user)
    await checkEmail(normalEmail, { notFound: true })
  })

  it("should be able to sync a group", async () => {
    await createGroupAndUser(groupEmail)
    await checkEmail(groupEmail, { group: true })
  })

  it("should be able to remove user from group", async () => {
    if (!group) {
      await createGroupAndUser(groupEmail)
    }
    await removeUserFromGroup()
    await checkEmail(groupEmail, { notFound: true })
  })

  it("should be able to handle builder users", async () => {
    await createUser("test3@example.com", {}, true)
    await checkEmail("test3@example.com")
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
})
