import TestConfiguration from "../../config/TestConfiguration"
import { generator } from "../../../shared"

describe("Account API - Search for Account", () => {
    const config = new TestConfiguration()

    beforeAll(async () => {
        await config.beforeAll()
    })

    afterAll(async () => {
        await config.afterAll()
    })

    it("Search account by email", async () => {
        await config.api.accounts.search(generator.email(), "email")
    })

    it("Search account by tenantId", async () => {
        await config.api.accounts.search(generator.word(), "tenantId")
    })
})