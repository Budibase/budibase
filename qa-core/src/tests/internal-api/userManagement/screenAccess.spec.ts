import TestConfiguration from "../../../config/internal-api/TestConfiguration"
import { Application } from "@budibase/server/api/controllers/public/mapping/types"
import InternalAPIClient from "../../../config/internal-api/TestConfiguration/InternalAPIClient"
import AccountsAPIClient from "../../../config/internal-api/TestConfiguration/accountsAPIClient"
import { generateApp } from "../../../config/internal-api/fixtures/applications"
import { generateUser } from "../../../config/internal-api/fixtures/userManagement"
import { User } from "@budibase/types"
import generateScreen from "../../../config/internal-api/fixtures/screens"
import { db } from "@budibase/backend-core"

describe.skip("Internal API - Role screen access", () => {
  let api: InternalAPIClient
  let accountsAPI: AccountsAPIClient
  let config: TestConfiguration<Application>

  // Before each test, login as admin. Some tests will require login as a different user
  beforeEach(async () => {
    api = new InternalAPIClient()
    accountsAPI = new AccountsAPIClient()
    config = new TestConfiguration<Application>(api, accountsAPI)
    await config.setupAccountAndTenant()
  })

  afterAll(async () => {
    await config.afterAll()
  })

  it("Check Screen access for BASIC Role", async () => {
    // Set up user
    const appUser = generateUser()
    expect(appUser[0].builder?.global).toEqual(false)
    expect(appUser[0].admin?.global).toEqual(false)
    const [createUserResponse, createUserJson] = await config.users.addMultiple(
      appUser
    )

    // Create App
    const app = await config.applications.create(generateApp())
    config.applications.api.appId = app.appId

    // Update user roles
    const [userInfoResponse, userInfoJson] = await config.users.getInfo(
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
    await config.users.updateInfo(body)

    const [changedUserInfoResponse, changedUserInfoJson] =
      await config.users.getInfo(createUserJson.created.successful[0]._id)
    expect(changedUserInfoJson.roles[prodAppId]).toBeDefined()
    expect(changedUserInfoJson.roles[prodAppId]).toEqual("BASIC")

    await config.screen.create(generateScreen("BASIC"))
    await config.screen.create(generateScreen("POWER"))
    await config.screen.create(generateScreen("ADMIN"))

    await config.applications.publish(<string>app.appId)
    const [firstappPackageResponse, firstappPackageJson] =
      await config.applications.getAppPackage(<string>app.appId)
    expect(firstappPackageJson.screens).toBeDefined()
    expect(firstappPackageJson.screens.length).toEqual(3)

    // login with BASIC user
    await config.login(appUser[0].email!, appUser[0].password!)
    const [selfInfoResponse, selfInfoJson] = await config.users.getSelf()

    // fetch app package

    const [appPackageResponse, appPackageJson] =
      await config.applications.getAppPackage(app.appId!)
    expect(appPackageJson.screens).toBeDefined()
    expect(appPackageJson.screens.length).toEqual(1)
    expect(appPackageJson.screens[0].routing.roleId).toEqual("BASIC")
  })

  it("Check Screen access for POWER role", async () => {
    // Set up user
    const appUser = generateUser()
    expect(appUser[0].builder?.global).toEqual(false)
    expect(appUser[0].admin?.global).toEqual(false)
    const [createUserResponse, createUserJson] = await config.users.addMultiple(
      appUser
    )

    // Create App
    const app = await config.applications.create(generateApp())
    config.applications.api.appId = app.appId

    // Update user roles
    const [userInfoResponse, userInfoJson] = await config.users.getInfo(
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
    await config.users.updateInfo(body)

    const [changedUserInfoResponse, changedUserInfoJson] =
      await config.users.getInfo(createUserJson.created.successful[0]._id)
    expect(changedUserInfoJson.roles[prodAppId]).toBeDefined()
    expect(changedUserInfoJson.roles[prodAppId]).toEqual("POWER")

    await config.screen.create(generateScreen("BASIC"))
    await config.screen.create(generateScreen("POWER"))
    await config.screen.create(generateScreen("ADMIN"))

    await config.applications.publish(<string>app.appId)
    const [firstappPackageResponse, firstappPackageJson] =
      await config.applications.getAppPackage(<string>app.appId)
    expect(firstappPackageJson.screens).toBeDefined()
    expect(firstappPackageJson.screens.length).toEqual(3)

    // login with POWER user
    await config.login(appUser[0].email!, appUser[0].password!)
    const [selfInfoResponse, selfInfoJson] = await config.users.getSelf()

    // fetch app package
    const [appPackageResponse, appPackageJson] =
      await config.applications.getAppPackage(app.appId!)
    expect(appPackageJson.screens).toBeDefined()
    expect(appPackageJson.screens.length).toEqual(2)
  })

  it("Check Screen access for ADMIN role", async () => {
    // Set up user
    const appUser = generateUser()
    expect(appUser[0].builder?.global).toEqual(false)
    expect(appUser[0].admin?.global).toEqual(false)
    const [createUserResponse, createUserJson] = await config.users.addMultiple(
      appUser
    )

    // Create App
    const app = await config.applications.create(generateApp())
    config.applications.api.appId = app.appId

    // Update user roles
    const [userInfoResponse, userInfoJson] = await config.users.getInfo(
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
    await config.users.updateInfo(body)

    const [changedUserInfoResponse, changedUserInfoJson] =
      await config.users.getInfo(createUserJson.created.successful[0]._id)
    expect(changedUserInfoJson.roles[prodAppId]).toBeDefined()
    expect(changedUserInfoJson.roles[prodAppId]).toEqual("ADMIN")

    await config.screen.create(generateScreen("BASIC"))
    await config.screen.create(generateScreen("POWER"))
    await config.screen.create(generateScreen("ADMIN"))

    await config.applications.publish(<string>app.appId)
    const [firstappPackageResponse, firstappPackageJson] =
      await config.applications.getAppPackage(<string>app.appId)
    expect(firstappPackageJson.screens).toBeDefined()
    expect(firstappPackageJson.screens.length).toEqual(3)

    // login with ADMIN user
    await config.login(appUser[0].email!, appUser[0].password!)
    const [selfInfoResponse, selfInfoJson] = await config.users.getSelf()

    // fetch app package
    const [appPackageResponse, appPackageJson] =
      await config.applications.getAppPackage(app.appId!)
    expect(appPackageJson.screens).toBeDefined()
    expect(appPackageJson.screens.length).toEqual(3)
  })
})
