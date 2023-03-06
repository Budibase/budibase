import TestConfiguration from "../../../config/internal-api/TestConfiguration"
import { Application } from "@budibase/server/api/controllers/public/mapping/types"
import InternalAPIClient from "../../../config/internal-api/TestConfiguration/InternalAPIClient"
import AccountsAPIClient from "../../../config/internal-api/TestConfiguration/accountsAPIClient"
import {
  generateApp,
  appFromTemplate,
} from "../../../config/internal-api/fixtures/applications"
import { generateUser } from "../../../config/internal-api/fixtures/userManagement"
import { User } from "@budibase/types"
import { db } from "@budibase/backend-core"

describe("Internal API - App Specific Roles & Permissions", () => {
  let api: InternalAPIClient
  let accountsAPI: AccountsAPIClient
  let config: TestConfiguration<Application>

  // Before each test, login as admin. Some tests will require login as a different user
  beforeAll(async () => {
    api = new InternalAPIClient()
    accountsAPI = new AccountsAPIClient()
    config = new TestConfiguration<Application>(api, accountsAPI)
    await config.setupAccountAndTenant()
  })

  afterAll(async () => {
    await config.afterAll()
  })
  afterAll(async () => {
    await config.afterAll()
  })

  it("Add BASIC user to app", async () => {
    const appUser = generateUser()
    expect(appUser[0].builder?.global).toEqual(false)
    expect(appUser[0].admin?.global).toEqual(false)
    const [createUserResponse, createUserJson] = await config.users.addMultiple(
      appUser
    )

    const app = await config.applications.create(appFromTemplate())
    config.applications.api.appId = app.appId

    const [userInfoResponse, userInfoJson] = await config.users.getInfo(
      createUserJson.created.successful[0]._id
    )
    const body: User = {
      ...userInfoJson,
      roles: {
        [<string>app.appId]: "BASIC",
      },
    }
    await config.users.updateInfo(body)

    const [changedUserInfoResponse, changedUserInfoJson] =
      await config.users.getInfo(createUserJson.created.successful[0]._id)
    expect(changedUserInfoJson.roles[<string>app.appId]).toBeDefined()
    expect(changedUserInfoJson.roles[<string>app.appId]).toEqual("BASIC")
  })

  it("Add ADMIN user to app", async () => {
    // Create a user with ADMIN role and check if it was created successfully
    const adminUser = generateUser(1, "admin")
    expect(adminUser[0].builder?.global).toEqual(true)
    expect(adminUser[0].admin?.global).toEqual(true)
    const [createUserResponse, createUserJson] = await config.users.addMultiple(
      adminUser
    )

    const app = await config.applications.create(appFromTemplate())
    config.applications.api.appId = app.appId

    const [userInfoResponse, userInfoJson] = await config.users.getInfo(
      createUserJson.created.successful[0]._id
    )
    const body: User = {
      ...userInfoJson,
      roles: {
        [<string>app.appId]: "ADMIN",
      },
    }
    await config.users.updateInfo(body)

    const [changedUserInfoResponse, changedUserInfoJson] =
      await config.users.getInfo(createUserJson.created.successful[0]._id)
    expect(changedUserInfoJson.roles[<string>app.appId]).toBeDefined()
    expect(changedUserInfoJson.roles[<string>app.appId]).toEqual("ADMIN")

    // publish app
    await config.applications.publish(<string>app.appId)
    // check published app renders
    config.applications.api.appId = db.getProdAppID(app.appId!)
    await config.applications.canRender()
  })

  it("Add POWER user to app", async () => {
    const powerUser = generateUser(1, "developer")
    expect(powerUser[0].builder?.global).toEqual(true)

    const [createUserResponse, createUserJson] = await config.users.addMultiple(
      powerUser
    )

    const app = await config.applications.create(generateApp())
    config.applications.api.appId = app.appId

    const [userInfoResponse, userInfoJson] = await config.users.getInfo(
      createUserJson.created.successful[0]._id
    )
    const body: User = {
      ...userInfoJson,
      roles: {
        [<string>app.appId]: "POWER",
      },
    }
    await config.users.updateInfo(body)

    // Get the user information again and check if the role was added
    const [changedUserInfoResponse, changedUserInfoJson] =
      await config.users.getInfo(createUserJson.created.successful[0]._id)
    expect(changedUserInfoJson.roles[<string>app.appId]).toBeDefined()
    expect(changedUserInfoJson.roles[<string>app.appId]).toEqual("POWER")
  })
})
