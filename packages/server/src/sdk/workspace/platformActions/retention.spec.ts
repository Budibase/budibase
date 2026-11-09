import cloneDeep from "lodash/cloneDeep"
import tk from "timekeeper"
import { mocks } from "@budibase/backend-core/tests"
import { licensing } from "@budibase/pro"
import type { PlatformActionSessionStatus } from "@budibase/types"
import TestConfiguration from "../../../tests/utilities/TestConfiguration"
import { getRetentionCutoff, isExpiredSession } from "./retention"

const NOW = "2026-03-09T12:00:00.000Z"

describe("platformActions retention", () => {
  const config = new TestConfiguration()

  beforeAll(async () => {
    await config.init()
  })

  beforeEach(async () => {
    await config.newTenant()
    mocks.licenses.useUnlimited()
    tk.freeze(new Date(NOW))
  })

  afterEach(() => {
    tk.reset()
  })

  afterAll(() => {
    config.end()
  })

  describe("getRetentionCutoff", () => {
    it("calculates the cutoff from the current license quota", async () => {
      mocks.licenses.setPlatformActionsRetentionQuota(30)

      await expect(getRetentionCutoff()).resolves.toBe(
        "2026-02-07T12:00:00.000Z"
      )
    })

    it("uses the latest cached license value", async () => {
      mocks.licenses.setPlatformActionsRetentionQuota(30)
      await getRetentionCutoff()

      mocks.licenses.setPlatformActionsRetentionQuota(1)

      await expect(getRetentionCutoff()).resolves.toBe(
        "2026-03-08T12:00:00.000Z"
      )
    })

    it("does not expire anything with an unlimited quota", async () => {
      mocks.licenses.setPlatformActionsRetentionQuota(-1)

      await expect(getRetentionCutoff()).resolves.toBeUndefined()
    })

    it.each([0, -5, 1.5, Infinity, NaN])(
      "rejects an invalid quota of %s days",
      async value => {
        mocks.licenses.setPlatformActionsRetentionQuota(value)

        await expect(getRetentionCutoff()).rejects.toThrow(
          "Invalid platform actions retention quota"
        )
      }
    )

    it("does not expire anything when the quota is missing", async () => {
      const license = cloneDeep(await licensing.cache.getCachedLicense())
      Reflect.deleteProperty(
        license.quotas.constant,
        "platformActionsRetentionDays"
      )
      mocks.licenses.useLicense(license)

      await expect(getRetentionCutoff()).resolves.toBeUndefined()
    })
  })

  describe("isExpiredSession", () => {
    const cutoff = "2026-02-07T12:00:00.000Z"
    const before = "2026-02-07T11:59:59.999Z"

    it.each<PlatformActionSessionStatus>(["completed", "failed"])(
      "expires a %s session last updated before the cutoff",
      status => {
        expect(
          isExpiredSession({ session: { status, updatedAt: before }, cutoff })
        ).toBe(true)
      }
    )

    it.each<PlatformActionSessionStatus>(["active", "waiting"])(
      "never expires a %s session",
      status => {
        expect(
          isExpiredSession({
            session: { status, updatedAt: "2020-01-01T00:00:00.000Z" },
            cutoff,
          })
        ).toBe(false)
      }
    )

    it("keeps a terminal session updated exactly at the cutoff", () => {
      expect(
        isExpiredSession({
          session: { status: "completed", updatedAt: cutoff },
          cutoff,
        })
      ).toBe(false)
    })

    it("keeps everything when there is no cutoff", () => {
      expect(
        isExpiredSession({
          session: { status: "completed", updatedAt: before },
          cutoff: undefined,
        })
      ).toBe(false)
    })
  })
})
