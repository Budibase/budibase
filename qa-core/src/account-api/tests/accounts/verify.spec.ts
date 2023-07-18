import TestConfiguration from "../../config/TestConfiguration"
import * as fixtures from "../../fixtures"

describe("Account API - Verify Account", () => {
    const config = new TestConfiguration()

    beforeAll(async () => {
        await config.beforeAll()
    })

    afterAll(async () => {
        await config.afterAll()
    })

    describe("POST /api/accounts/verify", () => {
        it("returns 200", async () => {
            // Create unverified account
            const createAccountRequest = fixtures.accounts.generateAccount()
            const [res, acc] = await config.api.accounts.create(
                createAccountRequest,
                { doExpect: true, autoVerify: false })

            // Attempt to log in using unverified account
            const [loginResponse, cookie] = await config.accountsApi.auth.login(
                createAccountRequest.email,
                createAccountRequest.password,
            )

            // await config.login(
            //     createAccountRequest.email,
            //     createAccountRequest.password,
            //     createAccountRequest.tenantId,
            // )

            // Expect response - cannot login via unverified account


            // Verify account via code
            // await config.api.accounts.verifyAccount()

            // Expect response - login successful
        })
    })

    describe("POST /api/accounts/verify/send", () => {
        it("Send account verification email ", async () => {
            // Create account
            await config.api.accounts.create({
                ...fixtures.accounts.generateAccount()
            })

            // Verify account via email
            //await config.api.accounts.verifyAccountSendEmail()
        })
    })
})
