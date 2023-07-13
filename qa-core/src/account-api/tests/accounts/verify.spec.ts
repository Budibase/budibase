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
        await config.api.accounts.verifyAccount()
    })

    it("Send account verification email ", async () => {
        await config.api.accounts.verifyAccountSendEmail()
    })
})