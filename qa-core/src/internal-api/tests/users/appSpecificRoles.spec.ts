import TestConfiguration from "../../config/TestConfiguration"
import { User } from "@budibase/types"
import { db } from "@budibase/backend-core"
import * as fixtures from "../../fixtures"

describe("Internal API - App Specific Roles & Permissions", () => {
  const config = new TestConfiguration()

  // Before each test, login as admin. Some tests will require login as a different user
  beforeAll(async () => {
    await config.beforeAll()
  })

  afterAll(async () => {
    await config.afterAll()
  })

  it("Add BASIC user to app", async () => {
    const appUser = fixtures.users.generateUser()
    expect(appUser[0].builder?.global).toEqual(false)
    expect(appUser[0].admin?.global).toEqual(false)
    const [createUserResponse, createUserJson] =
      await config.api.users.addMultiple(appUser)

    const app = await config.createApp(fixtures.apps.appFromTemplate())

    const [userInfoResponse, userInfoJson] = await config.api.users.getInfo(
      createUserJson.created.successful[0]._id
    )
    const body: User = {
      ...userInfoJson,
      roles: {
        [app.appId!]: "BASIC",
      },
    }
    await config.api.users.updateInfo(body)

    const [changedUserInfoResponse, changedUserInfoJson] =
      await config.api.users.getInfo(createUserJson.created.successful[0]._id)
    expect(changedUserInfoJson.roles[app.appId!]).toBeDefined()
    expect(changedUserInfoJson.roles[app.appId!]).toEqual("BASIC")
  })

  it("Add ADMIN user to app", async () => {
    // Create a user with ADMIN role and check if it was created successfully
    const adminUser = fixtures.users.generateUser(1, "admin")
    expect(adminUser[0].builder?.global).toEqual(true)
    expect(adminUser[0].admin?.global).toEqual(true)
    const [createUserResponse, createUserJson] =
      await config.api.users.addMultiple(adminUser)

    // const app = await config.createApp(fixtures.apps.appFromTemplate())
    const app = await config.createApp(fixtures.apps.appFromTemplate())

    const [userInfoResponse, userInfoJson] = await config.api.users.getInfo(
      createUserJson.created.successful[0]._id
    )
    const body: User = {
      ...userInfoJson,
      roles: {
        [app.appId!]: "ADMIN",
      },
    }
    await config.api.users.updateInfo(body)

    const [changedUserInfoResponse, changedUserInfoJson] =
      await config.api.users.getInfo(createUserJson.created.successful[0]._id)
    expect(changedUserInfoJson.roles[app.appId!]).toBeDefined()
    expect(changedUserInfoJson.roles[app.appId!]).toEqual("ADMIN")

    // publish app
    await config.api.apps.publish(app.appId)
    // check published app renders
    config.state.appId = db.getProdAppID(app.appId!)
    await config.api.apps.canRender()
  })

  it("Add POWER user to app", async () => {
    const powerUser = fixtures.users.generateUser(1, "developer")
    expect(powerUser[0].builder?.global).toEqual(true)

    const [createUserResponse, createUserJson] =
      await config.api.users.addMultiple(powerUser)

    const app = await config.createApp()

    const [userInfoResponse, userInfoJson] = await config.api.users.getInfo(
      createUserJson.created.successful[0]._id
    )
    const body: User = {
      ...userInfoJson,
      roles: {
        [app.appId!]: "POWER",
      },
    }
    await config.api.users.updateInfo(body)

    // Get the user information again and check if the role was added
    const [changedUserInfoResponse, changedUserInfoJson] =
      await config.api.users.getInfo(createUserJson.created.successful[0]._id)
    expect(changedUserInfoJson.roles[app.appId!]).toBeDefined()
    expect(changedUserInfoJson.roles[app.appId!]).toEqual("POWER")
  })
})
