jest.mock("../../quotas")

const quotasMock = require("../../quotas")

import { checkBudibaseAICreditsExceeded } from "../ai"
import { APIWarningCode, MonthlyQuotaName } from "@budibase/types"

describe("AI quota helpers", () => {
  const usageLimitIsExceededMock = jest.spyOn(
    quotasMock,
    "usageLimitIsExceeded"
  )

  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe("checkBudibaseAICreditsExceeded", () => {
    it("does not throw when credits are available", async () => {
      usageLimitIsExceededMock.mockResolvedValue(false)
      await expect(checkBudibaseAICreditsExceeded()).resolves.toBeUndefined()
    })

    it("throws with status 402 and USAGE_LIMIT_EXCEEDED code when credits are exhausted", async () => {
      usageLimitIsExceededMock.mockResolvedValue(true)

      let error: any
      try {
        await checkBudibaseAICreditsExceeded()
      } catch (e) {
        error = e
      }

      expect(error).toBeDefined()
      expect(error.status).toBe(402)
      expect(error.code).toBe(APIWarningCode.USAGE_LIMIT_EXCEEDED)
      expect(error.getPublicError()).toEqual({
        quota: MonthlyQuotaName.BUDIBASE_AI_CREDITS,
      })
    })

    it("passes the correct quota name and type to usageLimitIsExceeded", async () => {
      usageLimitIsExceededMock.mockResolvedValue(false)
      await checkBudibaseAICreditsExceeded()
      expect(usageLimitIsExceededMock).toHaveBeenCalledWith(
        expect.objectContaining({
          name: MonthlyQuotaName.BUDIBASE_AI_CREDITS,
        })
      )
    })

    it("propagates unexpected errors from usageLimitIsExceeded", async () => {
      const unexpectedError = new Error("DB connection failed")
      usageLimitIsExceededMock.mockRejectedValue(unexpectedError)

      await expect(checkBudibaseAICreditsExceeded()).rejects.toThrow(
        "DB connection failed"
      )
    })
  })
})
