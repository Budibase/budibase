import TestConfiguration from "../../../config/internal-api/TestConfiguration"
import { Application } from "@budibase/server/api/controllers/public/mapping/types"
import { db } from "@budibase/backend-core"
import InternalAPIClient from "../../../config/internal-api/TestConfiguration/InternalAPIClient"
import generateApp from "../../../config/internal-api/fixtures/applications"
import generator from "../../../config/generator"
import { generateAdmin, generateAppUser, generateDeveloper, generateInviteUser } from "../../../config/internal-api/fixtures/userManagement"
import generate from "../../../config/internal-api/fixtures/applications"

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

        const [adminResponse, adminData] = await config.userManagement.addUsers(admin)
        const [devResponse, devData] = await config.userManagement.addUsers(developer)
        const [userResponse, userData] = await config.userManagement.addUsers(appUser)

        const [allUsersResponse, allUsersData] = await config.userManagement.getAllUsers()
        expect(allUsersData.length).toBeGreaterThan(0)

    })


})
