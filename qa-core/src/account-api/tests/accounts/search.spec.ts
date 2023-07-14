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


    describe("POST /api/accounts/search", () => {
        describe("by tenant", () => {
            it("returns 200 + empty", async () => {
                const tenantId = generator.string()
                const [res, body] = await config.api.accounts.search(tenantId, "tenantId")
                expect(res.status).toBe(200)
                expect(body.length).toBe(0)
            })

            it("returns 200 + found", async () => {
                const [res, body] = await config.api.accounts.search(config.state.tenantId!, "tenantId")
                expect(res.status).toBe(200)
                expect(body.length).toBe(1)
                expect(body[0].tenantId).toBe(config.state.tenantId)
            })
        })

        describe("by email", () => {
            it("returns 200 + empty", async () => {
                await config.api.accounts.search(generator.word(), "email")
            })

            it("returns 200 + found", async () => {
                await config.api.accounts.search(generator.word(), "email")
            })
        })
    })
})