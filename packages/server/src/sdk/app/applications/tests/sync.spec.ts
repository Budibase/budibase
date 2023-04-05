import TestConfiguration from "../../../../tests/utilities/TestConfiguration"
import { events, context, roles, db as dbCore } from "@budibase/backend-core"
import { initUserGroupSync } from "../sync"
import { rawUserMetadata } from "../../../users/utils"
import EventEmitter from "events"
import { UserMetadata, UserRoles } from "@budibase/types"

const config = new TestConfiguration()
let app
const ROLE_ID = roles.BUILTIN_ROLE_IDS.BASIC

const emitter = new EventEmitter()

function updateCb() {
  emitter.emit("update")
}

function waitForUpdate() {
  return new Promise<void>((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject()
    }, 5000)
    emitter.on("update", () => {
      clearTimeout(timeout)
      resolve()
    })
  })
}

beforeAll(async () => {
  app = await config.init("syncApp")
  initUserGroupSync(updateCb)
})

async function createUser(email: string, roles: UserRoles, appId?: string) {
  const user = await config.createUser({ email, roles })
  await context.doInContext(appId || config.appId!, async () => {
    await events.user.created(user)
  })
}

async function getUserMetadata(appId?: string): Promise<UserMetadata[]> {
  return context.doInContext(appId || config.appId!, async () => {
    return await rawUserMetadata()
  })
}

function buildRoles(appId?: string) {
  const prodAppId = dbCore.getProdAppID(appId || config.appId!)
  return { [prodAppId]: ROLE_ID }
}

describe("app user/group sync", () => {
  it("should be able to sync a new user", async () => {
    const email = "test@test.com"
    await createUser(email, buildRoles())
    await waitForUpdate()
    const metadata = await getUserMetadata()
    expect(metadata.find(data => data.email === email)).toBeDefined()
  })
})
