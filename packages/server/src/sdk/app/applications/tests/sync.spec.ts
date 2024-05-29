import TestConfiguration from "../../../../tests/utilities/TestConfiguration"
import { events, context, roles, constants } from "@budibase/backend-core"
import { init } from "../../../../events"
import { rawUserMetadata } from "../../../users/utils"
import EventEmitter from "events"
import { UserGroup, UserMetadata, UserRoles, User } from "@budibase/types"

const config = new TestConfiguration()
let group: UserGroup, groupUser: User
const ROLE_ID = roles.BUILTIN_ROLE_IDS.BASIC

const emitter = new EventEmitter()

function updateCb(docId: string) {
  const isGroup = docId.startsWith(constants.DocumentType.GROUP)
  if (isGroup) {
    emitter.emit("update-group")
  } else {
    emitter.emit("update-user")
  }
}

init(updateCb)

function waitForUpdate(opts: { group?: boolean }) {
  return new Promise<void>((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject()
    }, 5000)
    const event = opts?.group ? "update-group" : "update-user"
    emitter.on(event, () => {
      clearTimeout(timeout)
      resolve()
    })
  })
}

beforeAll(async () => {
  await config.init("syncApp")
})

async function createUser(email: string, roles: UserRoles, builder?: boolean) {
  const user = await config.createUser({
    email,
    roles,
    builder: { global: builder || false },
    admin: { global: false },
  })
  await context.doInContext(config.appId!, async () => {
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
  await context.doInContext(config.appId!, async () => {
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
  return context.doInContext(config.appId!, async () => {
    await events.user.updated(groupUser)
  })
}

async function getUserMetadata(): Promise<UserMetadata[]> {
  return context.doInContext(config.appId!, async () => {
    return await rawUserMetadata()
  })
}

function buildRoles() {
  return { [config.prodAppId!]: ROLE_ID }
}

describe("app user/group sync", () => {
  const groupEmail = "test2@example.com",
    normalEmail = "test@example.com"
  async function checkEmail(
    email: string,
    opts?: { group?: boolean; notFound?: boolean }
  ) {
    await waitForUpdate(opts || {})
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
