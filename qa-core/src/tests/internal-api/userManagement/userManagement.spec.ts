import TestConfiguration from "../../../config/internal-api/TestConfiguration"
import { Application } from "@budibase/server/api/controllers/public/mapping/types"
import InternalAPIClient from "../../../config/internal-api/TestConfiguration/InternalAPIClient"
import AccountsAPIClient from "../../../config/internal-api/TestConfiguration/accountsAPIClient"
import { generateUser } from "../../../config/internal-api/fixtures/userManagement"
import { User } from "@budibase/types"

describe("Internal API - User Management & Permissions", () => {
  const api = new InternalAPIClient()
  const accountsAPI = new AccountsAPIClient()
  const config = new TestConfiguration<Application>(api, accountsAPI)

  // Before each test, login as admin. Some tests will require login as a different user
  beforeAll(async () => {
    await config.setupAccountAndTenant()
  })

  afterAll(async () => {
    await config.afterAll()
  })

  it("Add Users with different roles", async () => {
    // Get all users
    await config.users.search()

    // Get all roles
    await config.users.getRoles()

    // Add users with each role
    const admin = generateUser(1, "admin")
    expect(admin[0].builder?.global).toEqual(true)
    expect(admin[0].admin?.global).toEqual(true)
    const developer = generateUser(1, "developer")
    expect(developer[0].builder?.global).toEqual(true)
    const appUser = generateUser(1, "appUser")
    expect(appUser[0].builder?.global).toEqual(false)
    expect(appUser[0].admin?.global).toEqual(false)

    const userList = [...admin, ...developer, ...appUser]

    await config.users.addMultiple(userList)

    // Check users are added
    const [allUsersResponse, allUsersJson] = await config.users.getAll()
    expect(allUsersJson.length).toBeGreaterThan(0)
  })

  it("Delete User", async () => {
    const appUser = generateUser()
    expect(appUser[0].builder?.global).toEqual(false)
    expect(appUser[0].admin?.global).toEqual(false)
    const [userResponse, userJson] = await config.users.addMultiple(appUser)
    const userId = userJson.created.successful[0]._id
    await config.users.delete(<string>userId)
  })

  it("Reset Password", async () => {
    const appUser = generateUser()
    expect(appUser[0].builder?.global).toEqual(false)
    expect(appUser[0].admin?.global).toEqual(false)
    const [userResponse, userJson] = await config.users.addMultiple(appUser)
    const [userInfoResponse, userInfoJson] = await config.users.getInfo(
      userJson.created.successful[0]._id
    )
    const body: User = {
      ...userInfoJson,
      password: "newPassword",
    }
    await config.users.forcePasswordReset(body)
  })

  it("Change User information", async () => {
    const appUser = generateUser()
    expect(appUser[0].builder?.global).toEqual(false)
    expect(appUser[0].admin?.global).toEqual(false)
    const [userResponse, userJson] = await config.users.addMultiple(appUser)
    const [userInfoResponse, userInfoJson] = await config.users.getInfo(
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
    await config.users.updateInfo(body)

    const [changedUserInfoResponse, changedUserInfoJson] =
      await config.users.getInfo(userJson.created.successful[0]._id)
    expect(changedUserInfoJson.builder?.global).toBeDefined()
    expect(changedUserInfoJson.builder?.global).toEqual(true)
  })
})
