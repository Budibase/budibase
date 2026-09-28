import { env } from "@budibase/backend-core"
import { Feature, Hosting, PlanType } from "@budibase/types"
import { getOfflineFeatures } from "./features"

describe.each([Hosting.CLOUD, Hosting.SELF])(
  "offline license features (%s)",
  hosting => {
    beforeAll(() => {
      env._set("SELF_HOSTED", hosting === Hosting.CLOUD)
    })

    it.each([
      PlanType.PREMIUM,
      PlanType.PREMIUM_PLUS,
      PlanType.PREMIUM_MAX,
      PlanType.PRO,
      PlanType.PRO_MAX,
      PlanType.TEAM,
      PlanType.BUSINESS,
      PlanType.BUSINESS_PLUS,
      PlanType.ENTERPRISE_BASIC,
      PlanType.ENTERPRISE,
    ])("enables email customisation for the %s plan", planType => {
      expect(getOfflineFeatures(planType)).toContain(Feature.CUSTOMISE_EMAILS)
    })

    it.each([
      PlanType.FREE,
      PlanType.PREMIUM_PLUS_TRIAL,
      PlanType.ENTERPRISE_BASIC_TRIAL,
    ])("does not enable email customisation for the %s plan", planType => {
      expect(getOfflineFeatures(planType)).not.toContain(
        Feature.CUSTOMISE_EMAILS
      )
    })
  }
)
