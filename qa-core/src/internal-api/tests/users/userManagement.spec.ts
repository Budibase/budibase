import TestConfiguration from "../../config/TestConfiguration"
import { User } from "@budibase/types"
import * as fixtures from "./../../fixtures"

describe("Internal API - User Management & Permissions", () => {
  const config = new TestConfiguration()

  // Before each test, login as admin. Some tests will require login as a different user
  beforeAll(async () => {
    await config.beforeAll()
  })

  afterAll(async () => {
    await config.afterAll()
  })

  it("Add Users with different roles", async () => {
    // Get all users
    await config.api.users.search()

    // Get all roles
    await config.api.users.getRoles()

    // Add users with each role
    const admin = fixtures.users.generateUser(1, "admin")
    expect(admin[0].builder?.global).toEqual(true)
    expect(admin[0].admin?.global).toEqual(true)
    const developer = fixtures.users.generateUser(1, "developer")
    expect(developer[0].builder?.global).toEqual(true)
    const appUser = fixtures.users.generateUser(1, "appUser")
    expect(appUser[0].builder?.global).toEqual(false)
    expect(appUser[0].admin?.global).toEqual(false)

    const userList = [...admin, ...developer, ...appUser]

    await config.api.users.addMultiple(userList)

    // Check users are added
    const [allUsersResponse, allUsersJson] = await config.api.users.getAll()
    expect(allUsersJson.length).toBeGreaterThan(0)
  })

  it("Delete User", async () => {
    const appUser = fixtures.users.generateUser()
    expect(appUser[0].builder?.global).toEqual(false)
    expect(appUser[0].admin?.global).toEqual(false)
    const [userResponse, userJson] = await config.api.users.addMultiple(appUser)
    const userId = userJson.created.successful[0]._id
    await config.api.users.delete(userId)
  })

  it("Reset Password", async () => {
    const appUser = fixtures.users.generateUser()
    expect(appUser[0].builder?.global).toEqual(false)
    expect(appUser[0].admin?.global).toEqual(false)
    const [userResponse, userJson] = await config.api.users.addMultiple(appUser)
    const [userInfoResponse, userInfoJson] = await config.api.users.getInfo(
      userJson.created.successful[0]._id
    )
    const body: User = {
      ...userInfoJson,
      password: "newPassword",
    }
    await config.api.users.forcePasswordReset(body)
  })

  it("Change User information", async () => {
    const appUser = fixtures.users.generateUser()
    expect(appUser[0].builder?.global).toEqual(false)
    expect(appUser[0].admin?.global).toEqual(false)
    const [userResponse, userJson] = await config.api.users.addMultiple(appUser)
    const [userInfoResponse, userInfoJson] = await config.api.users.getInfo(
      userJson.created.successful[0]._id
    )
    const body: User = {
      ...userInfoJson,
      firstName: "newFirstName",
      lastName: "newLastName",
      builder: {
        global: true,
      },
    }
    await config.api.users.updateInfo(body)

    const [changedUserInfoResponse, changedUserInfoJson] =
      await config.api.users.getInfo(userJson.created.successful[0]._id)
    expect(changedUserInfoJson.builder?.global).toBeDefined()
    expect(changedUserInfoJson.builder?.global).toEqual(true)
  })
})
