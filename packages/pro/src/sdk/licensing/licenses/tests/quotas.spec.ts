import { ConstantQuotaName, Hosting, PlanType } from "@budibase/types"
import { getQuotas } from "../quotas"
import { licenses as constants } from "../../../../constants"

describe("quotas", () => {
  describe("platform actions retention", () => {
    it.each([
      [Hosting.CLOUD, PlanType.FREE, 1],
      [Hosting.CLOUD, PlanType.PREMIUM, 30],
      [Hosting.CLOUD, PlanType.PREMIUM_PLUS, 30],
      [Hosting.CLOUD, PlanType.PREMIUM_MAX, 30],
      [Hosting.CLOUD, PlanType.PREMIUM_PLUS_TRIAL, 15],
      [Hosting.CLOUD, PlanType.PRO, 30],
      [Hosting.CLOUD, PlanType.PRO_MAX, 30],
      [Hosting.CLOUD, PlanType.TEAM, 30],
      [Hosting.CLOUD, PlanType.BUSINESS, 30],
      [Hosting.CLOUD, PlanType.ENTERPRISE_BASIC, 365],
      [Hosting.CLOUD, PlanType.ENTERPRISE_BASIC_TRIAL, 15],
      [Hosting.CLOUD, PlanType.ENTERPRISE, 365],
      [Hosting.SELF, PlanType.FREE, 1],
      [Hosting.SELF, PlanType.PREMIUM_PLUS, 30],
      [Hosting.SELF, PlanType.PREMIUM_MAX, 1],
      [Hosting.SELF, PlanType.PREMIUM_PLUS_TRIAL, 15],
      [Hosting.SELF, PlanType.PRO, 1],
      [Hosting.SELF, PlanType.PRO_MAX, 1],
      [Hosting.SELF, PlanType.TEAM, 30],
      [Hosting.SELF, PlanType.BUSINESS, 1],
      [Hosting.SELF, PlanType.BUSINESS_PLUS, 30],
      [Hosting.SELF, PlanType.ENTERPRISE_BASIC, 365],
      [Hosting.SELF, PlanType.ENTERPRISE_BASIC_TRIAL, 15],
      [Hosting.SELF, PlanType.ENTERPRISE, 365],
    ])("returns the %s %s default", (hosting, planType, expected) => {
      const quotas = getQuotas(hosting, planType)

      expect(
        quotas.constant[ConstantQuotaName.PLATFORM_ACTIONS_RETENTION_DAYS]
      ).toEqual({
        name: "Platform Actions Retention",
        value: expected,
        triggers: [],
      })
    })

    it.each([
      ["CLOUD_FREE_LICENSE", constants.CLOUD_FREE_LICENSE, 1],
      ["SELF_FREE_LICENSE", constants.SELF_FREE_LICENSE, 1],
      ["UNLIMITED_LICENSE", constants.UNLIMITED_LICENSE, constants.UNLIMITED],
    ])("sets the %s value", (_name, license, expected) => {
      expect(
        license.quotas.constant[
          ConstantQuotaName.PLATFORM_ACTIONS_RETENTION_DAYS
        ].value
      ).toBe(expected)
    })
  })
})
