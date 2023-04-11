import TestConfiguration from "../../config/TestConfiguration"
import { User } from "@budibase/types"
import { db } from "@budibase/backend-core"
import * as fixtures from "./../../fixtures"

describe.skip("Internal API - Role screen access", () => {
  const config = new TestConfiguration()

  // Before each test, login as admin. Some tests will require login as a different user
  beforeEach(async () => {
    await config.beforeAll()
  })

  afterAll(async () => {
    await config.afterAll()
  })

  it("Check Screen access for BASIC Role", async () => {
    // Set up user
    const appUser = fixtures.users.generateUser()
    expect(appUser[0].builder?.global).toEqual(false)
    expect(appUser[0].admin?.global).toEqual(false)
    const [createUserResponse, createUserJson] =
      await config.api.users.addMultiple(appUser)

    // Create App
    const app = await config.createApp()

    // Update user roles
    const [userInfoResponse, userInfoJson] = await config.api.users.getInfo(
      createUserJson.created.successful[0]._id
    )
    const prodAppId = db.getProdAppID(app.appId!)

    // Roles must always be set with prod appID
    const body: User = {
      ...userInfoJson,
      roles: {
        [prodAppId]: "BASIC",
      },
    }
    await config.api.users.updateInfo(body)

    const [changedUserInfoResponse, changedUserInfoJson] =
      await config.api.users.getInfo(createUserJson.created.successful[0]._id)
    expect(changedUserInfoJson.roles[prodAppId]).toBeDefined()
    expect(changedUserInfoJson.roles[prodAppId]).toEqual("BASIC")

    await config.api.screens.create(fixtures.screens.generateScreen("BASIC"))
    await config.api.screens.create(fixtures.screens.generateScreen("POWER"))
    await config.api.screens.create(fixtures.screens.generateScreen("ADMIN"))

    await config.api.apps.publish(app.appId)
    const [firstappPackageResponse, firstappPackageJson] =
      await config.api.apps.getAppPackage(app.appId!)
    expect(firstappPackageJson.screens).toBeDefined()
    expect(firstappPackageJson.screens.length).toEqual(3)

    // login with BASIC user
    await config.login(appUser[0].email!, appUser[0].password!)
    const [selfInfoResponse, selfInfoJson] = await config.api.users.getSelf()

    // fetch app package

    const [appPackageResponse, appPackageJson] =
      await config.api.apps.getAppPackage(app.appId!)
    expect(appPackageJson.screens).toBeDefined()
    expect(appPackageJson.screens.length).toEqual(1)
    expect(appPackageJson.screens[0].routing.roleId).toEqual("BASIC")
  })

  it("Check Screen access for POWER role", async () => {
    // Set up user
    const appUser = fixtures.users.generateUser()
    expect(appUser[0].builder?.global).toEqual(false)
    expect(appUser[0].admin?.global).toEqual(false)
    const [createUserResponse, createUserJson] =
      await config.api.users.addMultiple(appUser)

    // Create App
    const app = await config.createApp()

    // Update user roles
    const [userInfoResponse, userInfoJson] = await config.api.users.getInfo(
      createUserJson.created.successful[0]._id
    )
    const prodAppId = db.getProdAppID(app.appId!)

    // Roles must always be set with prod appID
    const body: User = {
      ...userInfoJson,
      roles: {
        [prodAppId]: "POWER",
      },
    }
    await config.api.users.updateInfo(body)

    const [changedUserInfoResponse, changedUserInfoJson] =
      await config.api.users.getInfo(createUserJson.created.successful[0]._id)
    expect(changedUserInfoJson.roles[prodAppId]).toBeDefined()
    expect(changedUserInfoJson.roles[prodAppId]).toEqual("POWER")

    await config.api.screens.create(fixtures.screens.generateScreen("BASIC"))
    await config.api.screens.create(fixtures.screens.generateScreen("POWER"))
    await config.api.screens.create(fixtures.screens.generateScreen("ADMIN"))

    await config.api.apps.publish(app.appId)
    const [firstappPackageResponse, firstappPackageJson] =
      await config.api.apps.getAppPackage(app.appId!)
    expect(firstappPackageJson.screens).toBeDefined()
    expect(firstappPackageJson.screens.length).toEqual(3)

    // login with POWER user
    await config.login(appUser[0].email!, appUser[0].password!)
    const [selfInfoResponse, selfInfoJson] = await config.api.users.getSelf()

    // fetch app package
    const [appPackageResponse, appPackageJson] =
      await config.api.apps.getAppPackage(app.appId!)
    expect(appPackageJson.screens).toBeDefined()
    expect(appPackageJson.screens.length).toEqual(2)
  })

  it("Check Screen access for ADMIN role", async () => {
    // Set up user
    const appUser = fixtures.users.generateUser()
    expect(appUser[0].builder?.global).toEqual(false)
    expect(appUser[0].admin?.global).toEqual(false)
    const [createUserResponse, createUserJson] =
      await config.api.users.addMultiple(appUser)

    // Create App
    const app = await config.createApp()

    // Update user roles
    const [userInfoResponse, userInfoJson] = await config.api.users.getInfo(
      createUserJson.created.successful[0]._id
    )
    const prodAppId = db.getProdAppID(app.appId!)

    // Roles must always be set with prod appID
    const body: User = {
      ...userInfoJson,
      roles: {
        [prodAppId]: "ADMIN",
      },
    }
    await config.api.users.updateInfo(body)

    const [changedUserInfoResponse, changedUserInfoJson] =
      await config.api.users.getInfo(createUserJson.created.successful[0]._id)
    expect(changedUserInfoJson.roles[prodAppId]).toBeDefined()
    expect(changedUserInfoJson.roles[prodAppId]).toEqual("ADMIN")

    await config.api.screens.create(fixtures.screens.generateScreen("BASIC"))
    await config.api.screens.create(fixtures.screens.generateScreen("POWER"))
    await config.api.screens.create(fixtures.screens.generateScreen("ADMIN"))

    await config.api.apps.publish(app.appId)
    const [firstappPackageResponse, firstappPackageJson] =
      await config.api.apps.getAppPackage(app.appId!)
    expect(firstappPackageJson.screens).toBeDefined()
    expect(firstappPackageJson.screens.length).toEqual(3)

    // login with ADMIN user
    await config.login(appUser[0].email!, appUser[0].password!)
    const [selfInfoResponse, selfInfoJson] = await config.api.users.getSelf()

    // fetch app package
    const [appPackageResponse, appPackageJson] =
      await config.api.apps.getAppPackage(app.appId!)
    expect(appPackageJson.screens).toBeDefined()
    expect(appPackageJson.screens.length).toEqual(3)
  })
})
