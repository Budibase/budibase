import TestConfiguration from "../../config/TestConfiguration"
import * as fixtures from "../../fixtures"
import { Hosting, PlanType } from "@budibase/types"

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)

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
      hosting: Hosting.CLOUD,
    })
    const [createAccountRes, account] =
      await config.accountsApi.accounts.create(createAccountRequest, {
        autoVerify: true,
      })

    // Self response has free license
    await config.doInNewState(async () => {
      await config.loginAsAccount(createAccountRequest)
      const [selfRes, selfBody] = await config.api.accounts.self()
      expect(selfBody.license.plan.type).toBe(PlanType.FREE)
    })

    // Retrieve plans
    const [plansRes, planBody] = await config.api.licenses.getPlans()

    // Select priceId from premium plan
    let premiumPrice = null
    let businessPriceId: ""
    for (const plan of planBody) {
      if (plan.type === PlanType.PREMIUM_PLUS) {
        premiumPrice = plan.prices[0]
      }
      if (plan.type === PlanType.ENTERPRISE_BASIC) {
        businessPriceId = plan.prices[0].priceId
      }
    }

    // Create checkout session for price
    const checkoutSessionRes = await config.api.stripe.createCheckoutSession(
        { id: premiumPrice.priceId, type: premiumPrice.type }
    )
    const checkoutSessionUrl = checkoutSessionRes[1].url
    expect(checkoutSessionUrl).toContain("checkout.stripe.com")

    // Create stripe customer
    const customer = await stripe.customers.create({
      email: createAccountRequest.email,
    })

    // Create payment method
    const paymentMethod = await stripe.paymentMethods.create({
      type: "card",
      card: {
        token: "tok_visa", // Test Visa Card
      },
    })

    // Attach payment method to customer
    await stripe.paymentMethods.attach(paymentMethod.id, {
      customer: customer.id,
    })

    // Update customer
    await stripe.customers.update(customer.id, {
      invoice_settings: {
        default_payment_method: paymentMethod.id,
      },
    })

    // Create subscription for premium plan
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [
        {
          price: premiumPrice.priceId,
          quantity: 1,
        },
      ],
      default_payment_method: paymentMethod.id,
      collection_method: "charge_automatically",
    })

    await config.doInNewState(async () => {
      // License updated from Free to Premium
      await config.loginAsAccount(createAccountRequest)
      await config.api.stripe.linkStripeCustomer(account.accountId, customer.id)
      const [_, selfBodyPremium] = await config.api.accounts.self()
      expect(selfBodyPremium.license.plan.type).toBe(PlanType.PREMIUM_PLUS)

      // Create portal session - Check URL
      const [portalRes, portalSessionBody] =
        await config.api.stripe.createPortalSession(customer.id)
      expect(portalSessionBody.url).toContain("billing.stripe.com")

      // Update subscription from premium to business license
      //await config.api.licenses.updatePlan(businessPriceId.priceId)
      await config.api.licenses.updatePlan(businessPriceId)

      // License updated to Business
      const [selfRes, selfBodyBusiness] = await config.api.accounts.self()
      expect(selfBodyBusiness.license.plan.type).toBe(PlanType.ENTERPRISE_BASIC)
    })
  })
})
