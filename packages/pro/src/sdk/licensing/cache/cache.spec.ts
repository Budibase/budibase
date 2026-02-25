import tk from "timekeeper"

class LicenseMocks {
  getLicense = jest.fn()
  getFreeLicense = jest.fn()

  reset() {
    this.getLicense.mockReset()
    this.getFreeLicense.mockReset()
  }
}
const licenseMock = new LicenseMocks()
jest.mock("../licenses/client", () => ({
  getLicense: () => licenseMock.getLicense(),
  getFreeLicense: () => licenseMock.getFreeLicense(),
}))

import { PlanType } from "@budibase/types"
import { getCachedLicense as sut } from "./cache"
import { structures } from "@budibase/backend-core/tests"
import { context } from "@budibase/backend-core"

const setLicense = (type: PlanType) => {
  const license = structures.licenses.license({ planType: type })
  licenseMock.getLicense.mockReturnValue(license)
  return license
}

describe("licensing cache SWR", () => {
  beforeEach(() => {
    tk.freeze(new Date())
    licenseMock.reset()
  })

  const getCachedLicense = (tenantId: string) => {
    return context.doInTenant(tenantId, () => sut())
  }

  it("calls license client when it is not cached", async () => {
    const license = setLicense(PlanType.FREE)

    const result = await getCachedLicense(structures.tenant.id())

    expect(result).toEqual(license)
    expect(licenseMock.getLicense).toHaveBeenCalledTimes(1)
  })

  it("retries license fetch after failures", async () => {
    const tenantId = structures.tenant.id()
    const license = structures.licenses.license({ planType: PlanType.PRO })
    licenseMock.getLicense
      .mockRejectedValueOnce(new Error("first fail"))
      .mockRejectedValueOnce(new Error("second fail"))
      .mockResolvedValueOnce(license)

    const result = await getCachedLicense(tenantId)

    expect(result).toEqual(license)
    expect(licenseMock.getLicense).toHaveBeenCalledTimes(3)
  })

  it("throws after retries fail", async () => {
    const tenantId = structures.tenant.id()
    licenseMock.getLicense.mockRejectedValue(new Error("always fail"))

    const resultPromise = getCachedLicense(tenantId)

    await expect(resultPromise).rejects.toThrow("always fail")
    expect(licenseMock.getLicense).toHaveBeenCalledTimes(3)
    expect(licenseMock.getFreeLicense).not.toHaveBeenCalled()
  })

  it("returns cached license within fresh window without refresh", async () => {
    const license = setLicense(PlanType.FREE)
    const tenantId = structures.tenant.id()

    const result = await getCachedLicense(tenantId)
    const result2 = await getCachedLicense(tenantId)

    expect(result).toEqual(license)
    expect(result2).toEqual(license)
    expect(licenseMock.getLicense).toHaveBeenCalledTimes(1)
  })

  it("returns license from context without hitting cache", async () => {
    const license = setLicense(PlanType.ENTERPRISE)
    await context.doInLicenseContext(license, async () => {
      const result = await getCachedLicense(structures.tenant.id())

      expect(result).toEqual(license)
      expect(licenseMock.getLicense).not.toHaveBeenCalled()
    })
  })

  const waitForBackgroundProcesses = () =>
    new Promise(resolve => setTimeout(resolve, 1))

  it("returns stale license and refreshes in background within grace", async () => {
    const cached = setLicense(PlanType.FREE)

    const tenantId = structures.tenant.id()

    expect(await getCachedLicense(tenantId)).toEqual(cached)
    expect(await getCachedLicense(tenantId)).toEqual(cached)

    tk.travel(Date.now() + 60 * 60 * 1000 - 1)
    expect(await getCachedLicense(tenantId)).toEqual(cached)
    await waitForBackgroundProcesses()
    expect(await getCachedLicense(tenantId)).toEqual(cached)
    await waitForBackgroundProcesses()

    expect(licenseMock.getLicense).toHaveBeenCalledTimes(1)

    const refreshed = setLicense(PlanType.ENTERPRISE)
    tk.travel(Date.now() + 1)

    expect(await getCachedLicense(tenantId)).toEqual(cached)
    await waitForBackgroundProcesses()
    expect(licenseMock.getLicense).toHaveBeenCalledTimes(2)
    expect(await getCachedLicense(tenantId)).toEqual(refreshed)
    await waitForBackgroundProcesses()

    expect(licenseMock.getLicense).toHaveBeenCalledTimes(2)
  })
})
