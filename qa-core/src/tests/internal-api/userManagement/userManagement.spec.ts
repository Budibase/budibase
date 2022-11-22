import TestConfiguration from "../../../config/internal-api/TestConfiguration"
import { Application } from "@budibase/server/api/controllers/public/mapping/types"
import { db } from "@budibase/backend-core"
import InternalAPIClient from "../../../config/internal-api/TestConfiguration/InternalAPIClient"
import generateApp from "../../../config/internal-api/fixtures/applications"
import generator from "../../../config/generator"
import generateScreen from "../../../config/internal-api/fixtures/screens"

describe("Internal API - User Management", () => {
    const api = new InternalAPIClient()
    const config = new TestConfiguration<Application>(api)

    beforeAll(async () => {
        await config.beforeAll()
    })

    afterAll(async () => {
        await config.afterAll()
    })

    it("Get all users", async () => {
        await config.userManagement.searchUsers()
    })
})
