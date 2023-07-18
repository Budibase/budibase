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
                const [res, body] =
                    await config.api.accounts.search(tenantId, "tenantId")
                expect(res.status).toBe(200)
                expect(body.length).toBe(0)
            })

            it("returns 200 + found", async () => {
                const [res, body] =
                    await config.api.accounts.search(config.state.tenantId!, "tenantId")
                expect(res.status).toBe(200)
                expect(body.length).toBe(1)
                expect(body[0].tenantId).toBe(config.state.tenantId)
            })

            it("returns 400 + error: Invalid body - tenantId is not allowed to be empty", async () => {
                const [res, body] =
                    await config.api.accounts.search("", "tenantId")
                expect(body).toEqual({
                    message: "Invalid body - \"tenantId\" is not allowed to be empty",
                    status: 400
                })
            })
        })

        describe("by email", () => {
            it("returns 200 + empty", async () => {
                const email = generator.email()
                const [res, body] =
                    await config.api.accounts.search(email, "email")
                expect(res.status).toBe(200)
                expect(body.length).toBe(0)
            })

            it("returns 200 + found", async () => {
                const [res, body] =
                    await config.api.accounts.search(config.state.email!, "email")
                expect(res.status).toBe(200)
                expect(body.length).toBe(1)
                expect(body[0].email).toBe(config.state.email)
            })

            it("returns 400 + error: Invalid body - email is not allowed to be empty", async () => {
                const [res, body] =
                    await config.api.accounts.search("", "email")
                expect(body).toEqual({
                    message: "Invalid body - \"email\" is not allowed to be empty",
                    status: 400
                })
            })
        })
    })
})
