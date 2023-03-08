import TestConfiguration from "../../../config/internal-api/TestConfiguration"
import { Application } from "@budibase/server/api/controllers/public/mapping/types"
import InternalAPIClient from "../../../config/internal-api/TestConfiguration/InternalAPIClient"
import AccountsAPIClient from "../../../config/internal-api/TestConfiguration/accountsAPIClient"
import { generateApp } from "../../../config/internal-api/fixtures/applications"
import { generateUser } from "../../../config/internal-api/fixtures/userManagement"
import { User } from "@budibase/types"
import {
  generateNewColumnForTable,
  generateTable,
} from "../../../config/internal-api/fixtures/table"

describe.skip("Internal API - Role table access", () => {
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

  it("Check Table access for app user", async () => {
    const appUser = generateUser()
    expect(appUser[0].builder?.global).toEqual(false)
    expect(appUser[0].admin?.global).toEqual(false)
    const [createUserResponse, createUserJson] = await config.users.addMultiple(
      appUser
    )

    const app = await config.applications.create(generateApp())
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

    const [createdTableResponse, createdTableData] = await config.tables.save(
      generateTable()
    )

    await config.login(<string>appUser[0].email, <string>appUser[0].password)

    const newColumn = generateNewColumnForTable(createdTableData)
    await config.tables.forbiddenSave(newColumn)
    await config.tables.forbiddenSave(generateTable())
  })

  it.skip("Check Table access for developer", async () => {
    const developer = generateUser(1, "developer")
    expect(developer[0].builder?.global).toEqual(true)

    const [createUserResponse, createUserJson] = await config.users.addMultiple(
      developer
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

    const [changedUserInfoResponse, changedUserInfoJson] =
      await config.users.getInfo(createUserJson.created.successful[0]._id)
    expect(changedUserInfoJson.roles[<string>app.appId]).toBeDefined()
    expect(changedUserInfoJson.roles[<string>app.appId]).toEqual("POWER")

    const [createdTableResponse, createdTableData] = await config.tables.save(
      generateTable()
    )
    await config.login(
      <string>developer[0].email,
      <string>developer[0].password
    )
    const newColumn = generateNewColumnForTable(createdTableData)
    const [addColumnResponse, addColumnData] = await config.tables.save(
      newColumn,
      true
    )
  })

  it.skip("Check Table access for admin", async () => {
    const adminUser = generateUser(1, "admin")
    expect(adminUser[0].builder?.global).toEqual(true)
    expect(adminUser[0].admin?.global).toEqual(true)
    const [createUserResponse, createUserJson] = await config.users.addMultiple(
      adminUser
    )

    const app = await config.applications.create(generateApp())
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

    await config.login(
      <string>adminUser[0].email,
      <string>adminUser[0].password
    )
    const [createdTableResponse, createdTableData] = await config.tables.save(
      generateTable()
    )
    const newColumn = generateNewColumnForTable(createdTableData)
    const [addColumnResponse, addColumnData] = await config.tables.save(
      newColumn,
      true
    )
  })
})
