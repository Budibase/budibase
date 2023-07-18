import TestConfiguration from "../../config/TestConfiguration"
import * as fixtures from "../../fixtures"
import { generator } from "../../../shared"

describe("Account API - Validate Account", () => {
    const config = new TestConfiguration()

    beforeAll(async () => {
        await config.beforeAll()
    })

    afterAll(async () => {
        await config.afterAll()
    })

    describe("POST /api/accounts/validate/email", () => {
        it("Returns 200", async () => {
            const email = generator.email()
            const res = await config.api.accounts.validateEmail(email)
            expect(res.status).toBe(200)
        })

        it("returns 400", async () => {
            const [response, account] = await config.api.accounts.create({
                ...fixtures.accounts.generateAccount()
            })
            const res = await config.api.accounts.validateEmail(account.email)
            expect(res.status).toBe(400)
        })
    })

    describe("POST /api/accounts/validate/tenantId", () => {
        it("Returns 200", async () => {
            const res = await config.api.accounts.validateTenantId("randomtenant")
            expect(res.status).toBe(200)
        })

        it("Returns 400", async () => {
            const [response, account] = await config.api.accounts.create({
                ...fixtures.accounts.generateAccount()
            })
            const res = await config.api.accounts.validateTenantId(account.tenantId)
            expect(res.status).toBe(400)
        })
    })
})
