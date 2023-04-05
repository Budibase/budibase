import TestConfiguration from "../../config/TestConfiguration"
import { App, User } from "@budibase/types"
import { db } from "@budibase/backend-core"
import * as fixtures from "./../../fixtures"

describe.skip("Internal API - App Specific Roles & Permissions", () => {
  const config = new TestConfiguration()
  let app: Partial<App>

  // Before each test, login as admin. Some tests will require login as a different user
  beforeEach(async () => {
    await config.beforeAll()
    app = await config.createApp()
  })

  afterAll(async () => {
    await config.afterAll()
  })

  it("Custom role access for level 1 permissions", async () => {
    // Set up user
    const appUser = fixtures.users.generateUser()
    expect(appUser[0].builder?.global).toEqual(false)
    expect(appUser[0].admin?.global).toEqual(false)
    const [createUserResponse, createUserJson] =
      await config.api.users.addMultiple(appUser)

    //Create level 1 role
    const role = {
      inherits: "BASIC",
      permissionId: "public",
      name: "level 1",
    }
    const [createRoleResponse, createRoleJson] =
      await config.api.users.createRole(role)

    // Update user roles
    const [userInfoResponse, userInfoJson] = await config.api.users.getInfo(
      createUserJson.created.successful[0]._id
    )
    const prodAppId = db.getProdAppID(app.appId!)

    // Roles must always be set with prod appID
    const body: User = {
      ...userInfoJson,
      roles: {
        [prodAppId]: createRoleJson._id,
      },
    }
    await config.api.users.updateInfo(body)

    const [changedUserInfoResponse, changedUserInfoJson] =
      await config.api.users.getInfo(createUserJson.created.successful[0]._id)
    expect(changedUserInfoJson.roles[prodAppId]).toBeDefined()
    expect(changedUserInfoJson.roles[prodAppId]).toEqual(createRoleJson._id)

    await config.api.screens.create(fixtures.screens.generateScreen("BASIC"))
    await config.api.screens.create(fixtures.screens.generateScreen("POWER"))
    await config.api.screens.create(fixtures.screens.generateScreen("ADMIN"))

    await config.api.apps.publish(app.appId)
    const [firstappPackageResponse, firstappPackageJson] =
      await config.api.apps.getAppPackage(app.appId!)
    expect(firstappPackageJson.screens).toBeDefined()
    expect(firstappPackageJson.screens.length).toEqual(3)

    // login with level 1 user
    await config.login(
      config.state.tenantId!,
      appUser[0].email!,
      appUser[0].password!
    )
    const [selfInfoResponse, selfInfoJson] = await config.api.users.getSelf()

    // fetch app package

    const [appPackageResponse, appPackageJson] =
      await config.api.apps.getAppPackage(app.appId!)
    expect(appPackageJson.screens).toBeDefined()
    expect(appPackageJson.screens.length).toEqual(1)
  })
  it("Custom role access for level 2 permissions", async () => {
    // Set up user
    const appUser = fixtures.users.generateUser()
    expect(appUser[0].builder?.global).toEqual(false)
    expect(appUser[0].admin?.global).toEqual(false)
    const [createUserResponse, createUserJson] =
      await config.api.users.addMultiple(appUser)

    // Create App

    //Create level 1 role
    const role = {
      inherits: "BASIC",
      permissionId: "read_only",
      name: "level 2",
    }
    const [createRoleResponse, createRoleJson] =
      await config.api.users.createRole(role)

    // Update user roles
    const [userInfoResponse, userInfoJson] = await config.api.users.getInfo(
      createUserJson.created.successful[0]._id
    )
    const prodAppId = db.getProdAppID(app.appId!)

    // Roles must always be set with prod appID
    const body: User = {
      ...userInfoJson,
      roles: {
        [prodAppId]: createRoleJson._id,
      },
    }
    await config.api.users.updateInfo(body)

    const [changedUserInfoResponse, changedUserInfoJson] =
      await config.api.users.getInfo(createUserJson.created.successful[0]._id)
    expect(changedUserInfoJson.roles[prodAppId]).toBeDefined()
    expect(changedUserInfoJson.roles[prodAppId]).toEqual(createRoleJson._id)

    await config.api.screens.create(fixtures.screens.generateScreen("BASIC"))
    await config.api.screens.create(fixtures.screens.generateScreen("POWER"))
    await config.api.screens.create(fixtures.screens.generateScreen("ADMIN"))

    await config.api.apps.publish(app.appId)
    const [firstappPackageResponse, firstappPackageJson] =
      await config.api.apps.getAppPackage(app.appId!)
    expect(firstappPackageJson.screens).toBeDefined()
    expect(firstappPackageJson.screens.length).toEqual(3)

    // login with level 1 user
    await config.login(appUser[0].email!, appUser[0].password!)
    const [selfInfoResponse, selfInfoJson] = await config.api.users.getSelf()

    // fetch app package
    const [appPackageResponse, appPackageJson] =
      await config.api.apps.getAppPackage(app.appId!)
    expect(appPackageJson.screens).toBeDefined()
    expect(appPackageJson.screens.length).toEqual(1)
  })
  it("Custom role access for level 3 permissions", async () => {
    const appUser = fixtures.users.generateUser()
    expect(appUser[0].builder?.global).toEqual(false)
    expect(appUser[0].admin?.global).toEqual(false)
    const [createUserResponse, createUserJson] =
      await config.api.users.addMultiple(appUser)

    // Create App

    //Create level 1 role
    const role = {
      inherits: "BASIC",
      permissionId: "write",
      name: "level 3",
    }
    const [createRoleResponse, createRoleJson] =
      await config.api.users.createRole(role)

    // Update user roles
    const [userInfoResponse, userInfoJson] = await config.api.users.getInfo(
      createUserJson.created.successful[0]._id
    )
    const prodAppId = db.getProdAppID(app.appId!)

    // Roles must always be set with prod appID
    const body: User = {
      ...userInfoJson,
      roles: {
        [prodAppId]: createRoleJson._id,
      },
    }
    await config.api.users.updateInfo(body)

    const [changedUserInfoResponse, changedUserInfoJson] =
      await config.api.users.getInfo(createUserJson.created.successful[0]._id)
    expect(changedUserInfoJson.roles[prodAppId]).toBeDefined()
    expect(changedUserInfoJson.roles[prodAppId]).toEqual(createRoleJson._id)

    await config.api.screens.create(fixtures.screens.generateScreen("BASIC"))
    await config.api.screens.create(fixtures.screens.generateScreen("POWER"))
    await config.api.screens.create(fixtures.screens.generateScreen("ADMIN"))

    await config.api.apps.publish(app.appId)
    const [firstappPackageResponse, firstappPackageJson] =
      await config.api.apps.getAppPackage(app.appId!)
    expect(firstappPackageJson.screens).toBeDefined()
    expect(firstappPackageJson.screens.length).toEqual(3)

    // login with level 1 user
    await config.login(appUser[0].email!, appUser[0].password!)
    const [selfInfoResponse, selfInfoJson] = await config.api.users.getSelf()

    // fetch app package
    const [appPackageResponse, appPackageJson] =
      await config.api.apps.getAppPackage(app.appId!)
    expect(appPackageJson.screens).toBeDefined()
    expect(appPackageJson.screens.length).toEqual(1)
  })
  it("Custom role access for level 4 permissions", async () => {
    const appUser = fixtures.users.generateUser()
    expect(appUser[0].builder?.global).toEqual(false)
    expect(appUser[0].admin?.global).toEqual(false)
    const [createUserResponse, createUserJson] =
      await config.api.users.addMultiple(appUser)

    // Create App

    //Create level 1 role
    const role = {
      inherits: "BASIC",
      permissionId: "power",
      name: "level 4",
    }
    const [createRoleResponse, createRoleJson] =
      await config.api.users.createRole(role)

    // Update user roles
    const [userInfoResponse, userInfoJson] = await config.api.users.getInfo(
      createUserJson.created.successful[0]._id
    )
    const prodAppId = db.getProdAppID(app.appId!)

    // Roles must always be set with prod appID
    const body: User = {
      ...userInfoJson,
      roles: {
        [prodAppId]: createRoleJson._id,
      },
    }
    await config.api.users.updateInfo(body)

    const [changedUserInfoResponse, changedUserInfoJson] =
      await config.api.users.getInfo(createUserJson.created.successful[0]._id)
    expect(changedUserInfoJson.roles[prodAppId]).toBeDefined()
    expect(changedUserInfoJson.roles[prodAppId]).toEqual(createRoleJson._id)

    await config.api.screens.create(fixtures.screens.generateScreen("BASIC"))
    await config.api.screens.create(fixtures.screens.generateScreen("POWER"))
    await config.api.screens.create(fixtures.screens.generateScreen("ADMIN"))

    await config.api.apps.publish(app.appId)
    const [firstappPackageResponse, firstappPackageJson] =
      await config.api.apps.getAppPackage(app.appId!)
    expect(firstappPackageJson.screens).toBeDefined()
    expect(firstappPackageJson.screens.length).toEqual(3)

    // login with level 1 user
    await config.login(appUser[0].email!, appUser[0].password!)
    const [selfInfoResponse, selfInfoJson] = await config.api.users.getSelf()

    // fetch app package
    const [appPackageResponse, appPackageJson] =
      await config.api.apps.getAppPackage(app.appId!)
    expect(appPackageJson.screens).toBeDefined()
    expect(appPackageJson.screens.length).toEqual(1)
  })
  it("Custom role access for level 5 permissions", async () => {
    const appUser = fixtures.users.generateUser()
    expect(appUser[0].builder?.global).toEqual(false)
    expect(appUser[0].admin?.global).toEqual(false)
    const [createUserResponse, createUserJson] =
      await config.api.users.addMultiple(appUser)

    // Create App

    //Create level 1 role
    const role = {
      inherits: "BASIC",
      permissionId: "admin",
      name: "level 5",
    }
    const [createRoleResponse, createRoleJson] =
      await config.api.users.createRole(role)

    // Update user roles
    const [userInfoResponse, userInfoJson] = await config.api.users.getInfo(
      createUserJson.created.successful[0]._id
    )
    const prodAppId = db.getProdAppID(app.appId!)

    // Roles must always be set with prod appID
    const body: User = {
      ...userInfoJson,
      roles: {
        [prodAppId]: createRoleJson._id,
      },
    }
    await config.api.users.updateInfo(body)

    const [changedUserInfoResponse, changedUserInfoJson] =
      await config.api.users.getInfo(createUserJson.created.successful[0]._id)
    expect(changedUserInfoJson.roles[prodAppId]).toBeDefined()
    expect(changedUserInfoJson.roles[prodAppId]).toEqual(createRoleJson._id)

    await config.api.screens.create(fixtures.screens.generateScreen("BASIC"))
    await config.api.screens.create(fixtures.screens.generateScreen("POWER"))
    await config.api.screens.create(fixtures.screens.generateScreen("ADMIN"))

    await config.api.apps.publish(app.appId)
    const [firstappPackageResponse, firstappPackageJson] =
      await config.api.apps.getAppPackage(app.appId!)
    expect(firstappPackageJson.screens).toBeDefined()
    expect(firstappPackageJson.screens.length).toEqual(3)

    // login with level 1 user
    await config.login(appUser[0].email!, appUser[0].password!)
    const [selfInfoResponse, selfInfoJson] = await config.api.users.getSelf()

    // fetch app package
    const [appPackageResponse, appPackageJson] =
      await config.api.apps.getAppPackage(app.appId!)
    expect(appPackageJson.screens).toBeDefined()
    expect(appPackageJson.screens.length).toEqual(1)
  })
})
