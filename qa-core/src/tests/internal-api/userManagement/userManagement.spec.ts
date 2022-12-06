import TestConfiguration from "../../../config/internal-api/TestConfiguration"
import { Application } from "@budibase/server/api/controllers/public/mapping/types"
import InternalAPIClient from "../../../config/internal-api/TestConfiguration/InternalAPIClient"
import generateApp from "../../../config/internal-api/fixtures/applications"
import { generateAdmin, generateAppUser, generateDeveloper, generateInviteUser } from "../../../config/internal-api/fixtures/userManagement"
import { User } from "@budibase/types"

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

        const [allUsersResponse, allUsersJson] = await config.userManagement.getAllUsers()
        expect(allUsersJson.length).toBeGreaterThan(0)



    })

    it("Delete User", async () => {
        const appUser = generateAppUser()
        const [userResponse, userJson] = await config.userManagement.addUsers(appUser)
        const userId = userJson.created.successful[0]._id
        await config.userManagement.deleteUser(<string>userId)
    })

    it("Reset Password", async () => {
        const appUser = generateAppUser()
        const [userResponse, userJson] = await config.userManagement.addUsers(appUser)
        const [userInfoResponse, userInfoJson] = await config.userManagement.getUserInformation(userJson.created.successful[0]._id)
        const body: User = {
            ...userInfoJson,
            password: "newPassword"

        }
        await config.userManagement.forcePasswordReset(body)
    })

    it("Change User information", async () => {
        const appUser = generateAppUser()
        const [userResponse, userJson] = await config.userManagement.addUsers(appUser)
        const [userInfoResponse, userInfoJson] = await config.userManagement.getUserInformation(userJson.created.successful[0]._id)
        const body: User = {
            ...userInfoJson,
            firstName: "newFirstName",
            lastName: "newLastName",
            builder: {
                global: true
            }
        }
        await config.userManagement.changeUserInformation(body)

        const [changedUserInfoResponse, changedUserInfoJson] = await config.userManagement.getUserInformation(userJson.created.successful[0]._id)
        expect(changedUserInfoJson.builder?.global).toBeDefined()
        expect(changedUserInfoJson.builder?.global).toEqual(true)
    })

    it("Add BASIC user to app", async () => {
        const basicUser = generateAppUser()

        const [createUserResponse, createUserJson] = await config.userManagement.addUsers(basicUser)

        const app = await config.applications.create(generateApp())
        config.applications.api.appId = app.appId

        const [userInfoResponse, userInfoJson] = await config.userManagement.getUserInformation(createUserJson.created.successful[0]._id)
        const body: User = {
            ...userInfoJson,
            roles: {
                [app.appId?.toString() || ""]: "BASIC",
            }
        }
        await config.userManagement.changeUserInformation(body)

        const [changedUserInfoResponse, changedUserInfoJson] = await config.userManagement.getUserInformation(createUserJson.created.successful[0]._id)
        expect(changedUserInfoJson.roles[app.appId?.toString() || ""]).toBeDefined()
        expect(changedUserInfoJson.roles[app.appId?.toString() || ""]).toEqual("BASIC")

    })

    it("Add ADMIN user to app", async () => {
        const adminUser = generateAdmin()

        const [createUserResponse, createUserJson] = await config.userManagement.addUsers(adminUser)

        const app = await config.applications.create(generateApp())
        config.applications.api.appId = app.appId

        const [userInfoResponse, userInfoJson] = await config.userManagement.getUserInformation(createUserJson.created.successful[0]._id)
        const body: User = {
            ...userInfoJson,
            roles: {
                [app.appId?.toString() || ""]: "ADMIN",
            }
        }
        await config.userManagement.changeUserInformation(body)

        const [changedUserInfoResponse, changedUserInfoJson] = await config.userManagement.getUserInformation(createUserJson.created.successful[0]._id)
        expect(changedUserInfoJson.roles[app.appId?.toString() || ""]).toBeDefined()
        expect(changedUserInfoJson.roles[app.appId?.toString() || ""]).toEqual("ADMIN")

    })

    it("Add POWER user to app", async () => {
        const powerUser = generateDeveloper()

        const [createUserResponse, createUserJson] = await config.userManagement.addUsers(powerUser)

        const app = await config.applications.create(generateApp())
        config.applications.api.appId = app.appId

        const [userInfoResponse, userInfoJson] = await config.userManagement.getUserInformation(createUserJson.created.successful[0]._id)
        const body: User = {
            ...userInfoJson,
            roles: {
                [app.appId?.toString() || ""]: "POWER",
            }
        }
        await config.userManagement.changeUserInformation(body)

        const [changedUserInfoResponse, changedUserInfoJson] = await config.userManagement.getUserInformation(createUserJson.created.successful[0]._id)
        expect(changedUserInfoJson.roles[app.appId?.toString() || ""]).toBeDefined()
        expect(changedUserInfoJson.roles[app.appId?.toString() || ""]).toEqual("POWER")

    })

})
