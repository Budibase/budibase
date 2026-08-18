import { Duration } from "@budibase/backend-core"
import { ConstantQuotaName, QuotaType } from "@budibase/types"
import cloneDeep from "lodash/cloneDeep"
import { UNLIMITED_LICENSE } from "../../constants/licenses"
import * as licensing from "../../sdk/licensing"
import { getOldestRetentionDate } from "../utils/retention"

jest.mock("../../sdk/licensing", () => ({
  cache: {
    getCachedLicense: jest.fn(),
  },
}))

const QUOTA_NAME = ConstantQuotaName.WORKSPACE_BACKUPS_RETENTION_DAYS
const MIN_DATE = new Date(0).toISOString()
const NOW = new Date("2026-07-10T12:00:00.000Z")
const mockGetCachedLicense = jest.mocked(licensing.cache.getCachedLicense)

const useRetentionDays = (retentionDays: number) => {
  const license = cloneDeep(UNLIMITED_LICENSE)
  license.quotas[QuotaType.CONSTANT][QUOTA_NAME].value = retentionDays
  mockGetCachedLicense.mockReturnValue(license)
}

describe("getOldestRetentionDate", () => {
  beforeAll(() => {
    jest.useFakeTimers().setSystemTime(NOW)
  })

  afterAll(() => {
    jest.useRealTimers()
  })

  it("treats zero as a real retention value", async () => {
    useRetentionDays(0)

    await expect(getOldestRetentionDate(QUOTA_NAME)).resolves.toBe(
      new Date().toISOString()
    )
  })

  it("calculates the cutoff for a positive retention value", async () => {
    useRetentionDays(7)

    await expect(getOldestRetentionDate(QUOTA_NAME)).resolves.toBe(
      new Date(NOW.getTime() - Duration.fromDays(7).toMs()).toISOString()
    )
  })

  it.each([-2, Number.NaN, Number.POSITIVE_INFINITY])(
    "treats invalid retention value %s as no expiry",
    async retentionDays => {
      useRetentionDays(retentionDays)

      await expect(getOldestRetentionDate(QUOTA_NAME)).resolves.toBe(MIN_DATE)
    }
  )

  it("treats unlimited retention as no expiry", async () => {
    mockGetCachedLicense.mockReturnValue(UNLIMITED_LICENSE)

    await expect(getOldestRetentionDate(QUOTA_NAME)).resolves.toBe(MIN_DATE)
  })

  it("treats a missing retention quota as no expiry", async () => {
    const license = cloneDeep(UNLIMITED_LICENSE)
    Reflect.deleteProperty(license.quotas[QuotaType.CONSTANT], QUOTA_NAME)
    mockGetCachedLicense.mockReturnValue(license)

    await expect(getOldestRetentionDate(QUOTA_NAME)).resolves.toBe(MIN_DATE)
  })
})
