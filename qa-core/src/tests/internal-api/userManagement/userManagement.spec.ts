import TestConfiguration from "../../../config/internal-api/TestConfiguration"
import { Application } from "@budibase/server/api/controllers/public/mapping/types"
import InternalAPIClient from "../../../config/internal-api/TestConfiguration/InternalAPIClient"
import { generateAdmin, generateAppUser, generateDeveloper, generateInviteUser } from "../../../config/internal-api/fixtures/userManagement"

describe("Internal API - User Management & Permissions", () => {
    const api = new InternalAPIClient()
    const config = new TestConfiguration<Application>(api)

    beforeAll(async () => {
        await config.loginAsAdmin()
    })

    afterAll(async () => {
        await config.afterAll()
    })

    it("Add Users with different roles", async () => {
        await config.userManagement.searchUsers()
        await config.userManagement.getRoles()

        // These need to be saved to the context so the passwords can be used to login
        const admin = generateAdmin()
        const developer = generateDeveloper()
        const appUser = generateAppUser()

        await config.userManagement.addUsers(admin)
        await config.userManagement.addUsers(developer)
        await config.userManagement.addUsers(appUser)

        const [allUsersResponse, allUsersData] = await config.userManagement.getAllUsers()
        expect(allUsersData.length).toBeGreaterThan(0)



    })

    it("Delete User", async () => {
        const appUser = generateAppUser()
        const [userResponse, userData] = await config.userManagement.addUsers(appUser)
        const userId = userData.created.successful[0]._id
        await config.userManagement.deleteUser(<string>userId)
    })

    it("Reset Password", async () => {
        const appUser = generateAppUser()
        const [userResponse, userData] = await config.userManagement.addUsers(appUser)
        const [userInfoResponse, userInfoJson] = await config.userManagement.getUserInformation(userData.created.successful[0]._id)
        const body = {
            ...userInfoJson,
            password: "newPassword"

        }
        await config.userManagement.forcePasswordReset(body)
    })

    it("Change User information", async () => {
        const appUser = generateAppUser()
        const [userResponse, userData] = await config.userManagement.addUsers(appUser)
        const [userInfoResponse, userInfoJson] = await config.userManagement.getUserInformation(userData.created.successful[0]._id)
        const body = {
            ...userInfoJson,
            builder: {
                global: true
            }
        }
        const [changedUserResponse, changedUserJson] = await config.userManagement.changeUserInformation(body)
        expect(changedUserJson.builder?.global).toBeDefined()
        expect(changedUserJson.builder?.global).toEqual(true)
    })


})
