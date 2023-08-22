import TestConfiguration from "../../config/TestConfiguration"
import * as fixtures from "../../fixtures"
import {Hosting} from "@budibase/types"

describe("license management", () => {
    const config = new TestConfiguration()

    beforeAll(async () => {
        await config.beforeAll()
    })

    afterAll(async () => {
        await config.afterAll()
    })

    it("retrieves plans, creates checkout session, and updates license", async () => {
        // Create cloud account
        const createAccountRequest = fixtures.accounts.generateAccount({
            hosting: Hosting.CLOUD
        })

        // Self response has free license
        const [selfRes, selfBody] = await config.api.accounts.self()
        expect(selfBody.license.plan.type).toBe("free")

        // Retrieve plans
        const [plansRes, planBody] = await config.api.licenses.getPlans()

        // Select priceId from premium plan
        let premiumPriceId = null
        for (const plan of planBody) {
            if (plan.type === "premium") {
                premiumPriceId = plan.prices[0].priceId
                break
            }
        }

        // Create checkout session for price
        const checkoutSessionRes = await config.api.stripe.createCheckoutSession(
            premiumPriceId)
        const checkoutSessionUrl = checkoutSessionRes[1].url
        expect(checkoutSessionUrl).toContain("checkout.stripe.com")

        // Create stripe customer
        // Create subscription for premium plan

        // Create portal session
        // await config.api.stripe.createPortalSession()

        // Update from free to business license

        // License updated
    })
})
