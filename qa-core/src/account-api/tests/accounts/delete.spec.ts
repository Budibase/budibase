import TestConfiguration from "../../config/TestConfiguration"
import * as fixtures from "../../fixtures"
import { generator } from "../../../shared"

describe("Account API - Delete Account", () => {
    const config = new TestConfiguration()

    beforeAll(async () => {
        await config.beforeAll()
    })

    afterAll(async () => {
        await config.afterAll()
    })

    describe("DEL /api/accounts", () => {
        it("Returns 204", async () => {
            await config.doInNewState(async () => {
                // Create account
                const createAccountRequest = fixtures.accounts.generateAccount()
                await config.api.accounts.create(createAccountRequest)

                // Login - Get cookie
                await config.login(
                    createAccountRequest.email,
                    createAccountRequest.password,
                    createAccountRequest.tenantId
                )

                // Delete account
                const res = await config.api.accounts.deleteCurrentAccount()
                expect(res.status).toBe(204)
            })
        })
    })

    describe("DEL /api/accounts/{accountId}", () => {
        it("Returns 204", async () => {
            const [response, account] = await config.api.accounts.create({
                ...fixtures.accounts.generateAccount()
            })
            // Delete account by ID
            const res = await config.api.accounts.delete(account.accountId)
            expect(res.status).toBe(204)
        })

        it("returns 404 - Account not found", async () => {
            const accountId = generator.string()
            await config.api.accounts.delete(accountId, {status:404})
        })
    })
})
