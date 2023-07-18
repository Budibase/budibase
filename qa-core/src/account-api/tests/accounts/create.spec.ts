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

    describe("POST /api/accounts/", () => {
        it("Returns 201", async () => {
            const [res, account] = await config.api.accounts.create({
                ...fixtures.accounts.generateAccount()
            })
            expect(res.status).toBe(201)
        })
    })
})
