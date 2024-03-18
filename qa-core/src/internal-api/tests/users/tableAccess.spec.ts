import TestConfiguration from "../../config/TestConfiguration"
import { User } from "@budibase/types"
import * as fixtures from "./../../fixtures"

describe.skip("Internal API - Role table access", () => {
  const config = new TestConfiguration()

  // Before each test, login as admin. Some tests will require login as a different user
  beforeEach(async () => {
    await config.beforeAll()
  })

  afterAll(async () => {
    await config.afterAll()
  })

  it("Check Table access for app user", async () => {
    const appUser = fixtures.users.generateUser()
    expect(appUser[0].builder?.global).toEqual(false)
    expect(appUser[0].admin?.global).toEqual(false)
    const [, createUserJson] = await config.api.users.addMultiple(appUser)

    const app = await config.createApp()

    const [, userInfoJson] = await config.api.users.getInfo(
      createUserJson.created.successful[0]._id
    )
    const body: User = {
      ...userInfoJson,
      roles: {
        [app.appId!]: "BASIC",
      },
    }
    await config.api.users.updateInfo(body)

    const [, changedUserInfoJson] = await config.api.users.getInfo(
      createUserJson.created.successful[0]._id
    )
    expect(changedUserInfoJson.roles[app.appId!]).toBeDefined()
    expect(changedUserInfoJson.roles[app.appId!]).toEqual("BASIC")

    const [, createdTableData] = await config.api.tables.save(
      fixtures.tables.generateTable()
    )

    await config.login(appUser[0].email!, appUser[0].password!)

    const newColumn =
      fixtures.tables.generateNewColumnForTable(createdTableData)
    await config.api.tables.forbiddenSave(newColumn)
    await config.api.tables.forbiddenSave(fixtures.tables.generateTable())
  })

  it.skip("Check Table access for developer", async () => {
    const developer = fixtures.users.generateUser(1, "developer")
    expect(developer[0].builder?.global).toEqual(true)

    const [, createUserJson] = await config.api.users.addMultiple(developer)

    const app = await config.createApp()
    const [, userInfoJson] = await config.api.users.getInfo(
      createUserJson.created.successful[0]._id
    )
    const body: User = {
      ...userInfoJson,
      roles: {
        [app.appId!]: "POWER",
      },
    }
    await config.api.users.updateInfo(body)

    const [, changedUserInfoJson] = await config.api.users.getInfo(
      createUserJson.created.successful[0]._id
    )
    expect(changedUserInfoJson.roles[app.appId!]).toBeDefined()
    expect(changedUserInfoJson.roles[app.appId!]).toEqual("POWER")

    const [, createdTableData] = await config.api.tables.save(
      fixtures.tables.generateTable()
    )
    await config.login(developer[0].email!, developer[0].password!)
    const newColumn =
      fixtures.tables.generateNewColumnForTable(createdTableData)
    await config.api.tables.save(newColumn, true)
  })

  it.skip("Check Table access for admin", async () => {
    const adminUser = fixtures.users.generateUser(1, "admin")
    expect(adminUser[0].builder?.global).toEqual(true)
    expect(adminUser[0].admin?.global).toEqual(true)
    const [, createUserJson] = await config.api.users.addMultiple(adminUser)

    const app = await config.createApp()

    const [, userInfoJson] = await config.api.users.getInfo(
      createUserJson.created.successful[0]._id
    )
    const body: User = {
      ...userInfoJson,
      roles: {
        [app.appId!]: "ADMIN",
      },
    }
    await config.api.users.updateInfo(body)

    const [, changedUserInfoJson] = await config.api.users.getInfo(
      createUserJson.created.successful[0]._id
    )
    expect(changedUserInfoJson.roles[app.appId!]).toBeDefined()
    expect(changedUserInfoJson.roles[app.appId!]).toEqual("ADMIN")

    await config.login(adminUser[0].email!, adminUser[0].password!)
    const [, createdTableData] = await config.api.tables.save(
      fixtures.tables.generateTable()
    )
    const newColumn =
      fixtures.tables.generateNewColumnForTable(createdTableData)
    await config.api.tables.save(newColumn, true)
  })
})
