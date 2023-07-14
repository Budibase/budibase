import TestConfiguration from "../../config/TestConfiguration"
import { generator } from "../../../shared"
import * as fixtures from "../../fixtures";

describe("Account API - Verify Account", () => {
    const config = new TestConfiguration()

    beforeAll(async () => {
        await config.beforeAll()
    })

    afterAll(async () => {
        await config.afterAll()
    })


    it("Verify an account", async () => {
        // Create account
        await config.api.accounts.create({
            ...fixtures.accounts.generateAccount()
        })
        // Invite user

        // Verify account via code
        await config.api.accounts.verifyAccount()
    })

    it("Send account verification email ", async () => {
        // Create account
        await config.api.accounts.create({
            ...fixtures.accounts.generateAccount()
        })
        // Invite user

        // Verify account via email
        await config.api.accounts.verifyAccountSendEmail()
    })
})