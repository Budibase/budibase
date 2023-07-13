import TestConfiguration from "../../config/TestConfiguration"
import * as fixtures from "../../fixtures"

describe("Account API - Create Account", () => {
    const config = new TestConfiguration()

    beforeAll(async () => {
        await config.beforeAll()
    })

    afterAll(async () => {
        await config.afterAll()
    })

    it("Creates a new account", async () => {
        await config.api.accounts.create({
            ...fixtures.accounts.generateAccount()
        })
    })
})