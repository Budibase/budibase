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

    // it("Deletes an account", async () => {
    //
    // })

    it("Deletes an account by ID", async () => {
        const [response, account] = await config.api.accounts.create({
            ...fixtures.accounts.generateAccount()
        })
        await config.api.accounts.delete(account.accountId)
    })
})