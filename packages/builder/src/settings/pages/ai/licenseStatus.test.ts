import { describe, expect, it, vi } from "vitest"
import { Feature, PlanModel, PlanType, type License } from "@budibase/types"
import { hasManagedBBAIDevLicense } from "./licenseStatus"

vi.mock("@/stores/portal", () => ({
  admin: {},
  licensing: {},
}))

vi.mock("@/api", () => ({
  API: {},
}))

const makeLicense = (features: Feature[] = []): License => ({
  features,
  quotas: {} as License["quotas"],
  plan: {
    type: PlanType.ENTERPRISE,
    model: PlanModel.PER_USER,
    usesInvoicing: false,
  },
})

describe("hasManagedBBAIDevLicense", () => {
  it("returns true for self-host dev with the Budibase AI feature", () => {
    expect(
      hasManagedBBAIDevLicense(false, true, makeLicense([Feature.BUDIBASE_AI]))
    ).toBe(true)
  })

  it("returns false when the Budibase AI feature is missing", () => {
    expect(hasManagedBBAIDevLicense(false, true, makeLicense())).toBe(false)
  })

  it("returns false outside self-host dev", () => {
    const license = makeLicense([Feature.BUDIBASE_AI])

    expect(hasManagedBBAIDevLicense(true, true, license)).toBe(false)
    expect(hasManagedBBAIDevLicense(false, false, license)).toBe(false)
  })
})
