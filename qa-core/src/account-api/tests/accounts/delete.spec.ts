import TestConfiguration from "../../config/TestConfiguration"
import * as fixtures from "../../fixtures"

describe("Account API - Delete Account", () => {
    const config = new TestConfiguration()

    beforeAll(async () => {
        await config.beforeAll()
    })

    afterAll(async () => {
        await config.afterAll()
    })

    it("Deletes an account", async () => {
        // Create account
        const createAccountRequest = fixtures.accounts.generateAccount()

        await config.api.accounts.create(
            createAccountRequest
        )

        // Login - Get cookie
        await config.login(
            createAccountRequest.email,
            createAccountRequest.password,
            createAccountRequest.tenantId
        )

        // Delete account
        const [ res ] = await config.api.accounts.deleteCurrentAccount()

        expect(res.status).toBe(204)
    })

    it("Deletes an account by ID", async () => {
        const [response, account] = await config.api.accounts.create({
            ...fixtures.accounts.generateAccount()
        })
        await config.api.accounts.delete(account.accountId)
    })
})