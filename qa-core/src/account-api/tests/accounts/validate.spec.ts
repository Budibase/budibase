import TestConfiguration from "../../config/TestConfiguration"
import { generator } from "../../../shared"
import * as fixtures from "../../fixtures";

describe("Account API - Validate Account", () => {
    const config = new TestConfiguration()

    beforeAll(async () => {
        await config.beforeAll()
    })

    afterAll(async () => {
        await config.afterAll()
    })

    const tenant = generator.word({length: 6})
    const email = `${tenant}@budibase.com`


    it("Validates an email", async () => {
        await config.api.accounts.validateEmail(email)
    })

    it("Validates a tenant ID", async () => {
        await config.api.accounts.validateTenantId(tenant)
    })
})