import TestConfiguration from "../../../config/internal-api/TestConfiguration"
import { Application } from "@budibase/server/api/controllers/public/mapping/types"
import { db } from "@budibase/backend-core"
import InternalAPIClient from "../../../config/internal-api/TestConfiguration/InternalAPIClient"
import generateApp from "../../../config/internal-api/fixtures/applications"
import generator from "../../../config/generator"
import { generateAdmin, generateAppUser, generateDeveloper, generateInviteUser } from "../../../config/internal-api/fixtures/userManagement"

describe("Internal API - User Management & Permissions", () => {
    const api = new InternalAPIClient()
    const config = new TestConfiguration<Application>(api)

    beforeAll(async () => {
        await config.beforeAll()
    })

    afterAll(async () => {
        await config.afterAll()
    })

    it("Add Users with different roles", async () => {
        await config.userManagement.searchUsers()
        await config.userManagement.getRoles()

        const [adminResponse, adminData] = await config.userManagement.addUsers(generateAdmin())
        const [devResponse, devData] = await config.userManagement.addUsers(generateDeveloper())
        const [userResponse, userData] = await config.userManagement.addUsers(generateAppUser())

        const [invitedUserResponse, invitedUserData] = await config.userManagement.addUsers(generateInviteUser())

        const [allUsersResponse, allUsersData] = await config.userManagement.getAllUsers()
        expect(allUsersData.length).toEqual(4)

    })


})
