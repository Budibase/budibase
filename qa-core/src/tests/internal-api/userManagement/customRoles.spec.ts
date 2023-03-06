import TestConfiguration from "../../../config/internal-api/TestConfiguration"
import { Application } from "@budibase/server/api/controllers/public/mapping/types"
import InternalAPIClient from "../../../config/internal-api/TestConfiguration/InternalAPIClient"
import AccountsAPIClient from "../../../config/internal-api/TestConfiguration/accountsAPIClient"
import { generateApp } from "../../../config/internal-api/fixtures/applications"
import { generateUser } from "../../../config/internal-api/fixtures/userManagement"
import { App, User } from "@budibase/types"
import generateScreen from "../../../config/internal-api/fixtures/screens"
import { db } from "@budibase/backend-core"

describe.skip("Internal API - App Specific Roles & Permissions", () => {
  let api: InternalAPIClient
  let accountsAPI: AccountsAPIClient
  let config: TestConfiguration<Application>
  let app: Partial<App>

  // Before each test, login as admin. Some tests will require login as a different user
  beforeEach(async () => {
    api = new InternalAPIClient()
    accountsAPI = new AccountsAPIClient()
    config = new TestConfiguration<Application>(api, accountsAPI)
    await config.setupAccountAndTenant()
    app = await config.applications.create(generateApp())
    config.applications.api.appId = app.appId
  })

  afterAll(async () => {
    await config.afterAll()
  })

  it("Custom role access for level 1 permissions", async () => {
    // Set up user
    const appUser = generateUser()
    expect(appUser[0].builder?.global).toEqual(false)
    expect(appUser[0].admin?.global).toEqual(false)
    const [createUserResponse, createUserJson] = await config.users.addMultiple(
      appUser
    )

    //Create level 1 role
    const role = {
      inherits: "BASIC",
      permissionId: "public",
      name: "level 1",
    }
    const [createRoleResponse, createRoleJson] = await config.users.createRole(
      role
    )

    // Update user roles
    const [userInfoResponse, userInfoJson] = await config.users.getInfo(
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
    await config.users.updateInfo(body)

    const [changedUserInfoResponse, changedUserInfoJson] =
      await config.users.getInfo(createUserJson.created.successful[0]._id)
    expect(changedUserInfoJson.roles[prodAppId]).toBeDefined()
    expect(changedUserInfoJson.roles[prodAppId]).toEqual(createRoleJson._id)

    await config.screen.create(generateScreen("BASIC"))
    await config.screen.create(generateScreen("POWER"))
    await config.screen.create(generateScreen("ADMIN"))

    await config.applications.publish(<string>app.appId)
    const [firstappPackageResponse, firstappPackageJson] =
      await config.applications.getAppPackage(<string>app.appId)
    expect(firstappPackageJson.screens).toBeDefined()
    expect(firstappPackageJson.screens.length).toEqual(3)

    // login with level 1 user
    await config.login(appUser[0].email!, appUser[0].password!)
    const [selfInfoResponse, selfInfoJson] = await config.users.getSelf()

    // fetch app package

    const [appPackageResponse, appPackageJson] =
      await config.applications.getAppPackage(app.appId!)
    expect(appPackageJson.screens).toBeDefined()
    expect(appPackageJson.screens.length).toEqual(1)
  })
  it("Custom role access for level 2 permissions", async () => {
    // Set up user
    const appUser = generateUser()
    expect(appUser[0].builder?.global).toEqual(false)
    expect(appUser[0].admin?.global).toEqual(false)
    const [createUserResponse, createUserJson] = await config.users.addMultiple(
      appUser
    )

    // Create App

    //Create level 1 role
    const role = {
      inherits: "BASIC",
      permissionId: "read_only",
      name: "level 2",
    }
    const [createRoleResponse, createRoleJson] = await config.users.createRole(
      role
    )

    // Update user roles
    const [userInfoResponse, userInfoJson] = await config.users.getInfo(
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
    await config.users.updateInfo(body)

    const [changedUserInfoResponse, changedUserInfoJson] =
      await config.users.getInfo(createUserJson.created.successful[0]._id)
    expect(changedUserInfoJson.roles[prodAppId]).toBeDefined()
    expect(changedUserInfoJson.roles[prodAppId]).toEqual(createRoleJson._id)

    await config.screen.create(generateScreen("BASIC"))
    await config.screen.create(generateScreen("POWER"))
    await config.screen.create(generateScreen("ADMIN"))

    await config.applications.publish(<string>app.appId)
    const [firstappPackageResponse, firstappPackageJson] =
      await config.applications.getAppPackage(<string>app.appId)
    expect(firstappPackageJson.screens).toBeDefined()
    expect(firstappPackageJson.screens.length).toEqual(3)

    // login with level 1 user
    await config.login(appUser[0].email!, appUser[0].password!)
    const [selfInfoResponse, selfInfoJson] = await config.users.getSelf()

    // fetch app package
    const [appPackageResponse, appPackageJson] =
      await config.applications.getAppPackage(app.appId!)
    expect(appPackageJson.screens).toBeDefined()
    expect(appPackageJson.screens.length).toEqual(1)
  })
  it("Custom role access for level 3 permissions", async () => {
    const appUser = generateUser()
    expect(appUser[0].builder?.global).toEqual(false)
    expect(appUser[0].admin?.global).toEqual(false)
    const [createUserResponse, createUserJson] = await config.users.addMultiple(
      appUser
    )

    // Create App

    //Create level 1 role
    const role = {
      inherits: "BASIC",
      permissionId: "write",
      name: "level 3",
    }
    const [createRoleResponse, createRoleJson] = await config.users.createRole(
      role
    )

    // Update user roles
    const [userInfoResponse, userInfoJson] = await config.users.getInfo(
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
    await config.users.updateInfo(body)

    const [changedUserInfoResponse, changedUserInfoJson] =
      await config.users.getInfo(createUserJson.created.successful[0]._id)
    expect(changedUserInfoJson.roles[prodAppId]).toBeDefined()
    expect(changedUserInfoJson.roles[prodAppId]).toEqual(createRoleJson._id)

    await config.screen.create(generateScreen("BASIC"))
    await config.screen.create(generateScreen("POWER"))
    await config.screen.create(generateScreen("ADMIN"))

    await config.applications.publish(<string>app.appId)
    const [firstappPackageResponse, firstappPackageJson] =
      await config.applications.getAppPackage(<string>app.appId)
    expect(firstappPackageJson.screens).toBeDefined()
    expect(firstappPackageJson.screens.length).toEqual(3)

    // login with level 1 user
    await config.login(appUser[0].email!, appUser[0].password!)
    const [selfInfoResponse, selfInfoJson] = await config.users.getSelf()

    // fetch app package
    const [appPackageResponse, appPackageJson] =
      await config.applications.getAppPackage(app.appId!)
    expect(appPackageJson.screens).toBeDefined()
    expect(appPackageJson.screens.length).toEqual(1)
  })
  it("Custom role access for level 4 permissions", async () => {
    const appUser = generateUser()
    expect(appUser[0].builder?.global).toEqual(false)
    expect(appUser[0].admin?.global).toEqual(false)
    const [createUserResponse, createUserJson] = await config.users.addMultiple(
      appUser
    )

    // Create App

    //Create level 1 role
    const role = {
      inherits: "BASIC",
      permissionId: "power",
      name: "level 4",
    }
    const [createRoleResponse, createRoleJson] = await config.users.createRole(
      role
    )

    // Update user roles
    const [userInfoResponse, userInfoJson] = await config.users.getInfo(
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
    await config.users.updateInfo(body)

    const [changedUserInfoResponse, changedUserInfoJson] =
      await config.users.getInfo(createUserJson.created.successful[0]._id)
    expect(changedUserInfoJson.roles[prodAppId]).toBeDefined()
    expect(changedUserInfoJson.roles[prodAppId]).toEqual(createRoleJson._id)

    await config.screen.create(generateScreen("BASIC"))
    await config.screen.create(generateScreen("POWER"))
    await config.screen.create(generateScreen("ADMIN"))

    await config.applications.publish(<string>app.appId)
    const [firstappPackageResponse, firstappPackageJson] =
      await config.applications.getAppPackage(<string>app.appId)
    expect(firstappPackageJson.screens).toBeDefined()
    expect(firstappPackageJson.screens.length).toEqual(3)

    // login with level 1 user
    await config.login(appUser[0].email!, appUser[0].password!)
    const [selfInfoResponse, selfInfoJson] = await config.users.getSelf()

    // fetch app package
    const [appPackageResponse, appPackageJson] =
      await config.applications.getAppPackage(app.appId!)
    expect(appPackageJson.screens).toBeDefined()
    expect(appPackageJson.screens.length).toEqual(1)
  })
  it("Custom role access for level 5 permissions", async () => {
    const appUser = generateUser()
    expect(appUser[0].builder?.global).toEqual(false)
    expect(appUser[0].admin?.global).toEqual(false)
    const [createUserResponse, createUserJson] = await config.users.addMultiple(
      appUser
    )

    // Create App

    //Create level 1 role
    const role = {
      inherits: "BASIC",
      permissionId: "admin",
      name: "level 5",
    }
    const [createRoleResponse, createRoleJson] = await config.users.createRole(
      role
    )

    // Update user roles
    const [userInfoResponse, userInfoJson] = await config.users.getInfo(
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
    await config.users.updateInfo(body)

    const [changedUserInfoResponse, changedUserInfoJson] =
      await config.users.getInfo(createUserJson.created.successful[0]._id)
    expect(changedUserInfoJson.roles[prodAppId]).toBeDefined()
    expect(changedUserInfoJson.roles[prodAppId]).toEqual(createRoleJson._id)

    await config.screen.create(generateScreen("BASIC"))
    await config.screen.create(generateScreen("POWER"))
    await config.screen.create(generateScreen("ADMIN"))

    await config.applications.publish(<string>app.appId)
    const [firstappPackageResponse, firstappPackageJson] =
      await config.applications.getAppPackage(<string>app.appId)
    expect(firstappPackageJson.screens).toBeDefined()
    expect(firstappPackageJson.screens.length).toEqual(3)

    // login with level 1 user
    await config.login(appUser[0].email!, appUser[0].password!)
    const [selfInfoResponse, selfInfoJson] = await config.users.getSelf()

    // fetch app package
    const [appPackageResponse, appPackageJson] =
      await config.applications.getAppPackage(app.appId!)
    expect(appPackageJson.screens).toBeDefined()
    expect(appPackageJson.screens.length).toEqual(1)
  })
})
