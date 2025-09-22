import { FeatureFlag } from "@budibase/types"

jest.mock("../../../features", () => ({
  isEnabled: jest.fn(),
}))

jest.mock("../../objectStore", () => ({
  sanitizeKey: jest.requireActual("../../objectStore").sanitizeKey,
  objectExists: jest.fn(),
}))

import * as features from "../../../features"
import * as objectStore from "../../objectStore"
import { clientLibraryPath } from "../app"

const mockIsEnabled = features.isEnabled as jest.MockedFunction<
  typeof features.isEnabled
>
const mockObjectExists = objectStore.objectExists as jest.MockedFunction<
  typeof objectStore.objectExists
>

describe("clientLibraryPath", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("when USE_DYNAMIC_LOADING is disabled", () => {
    beforeEach(() => {
      mockIsEnabled.mockResolvedValue(false)
    })

    it("should return old client path", async () => {
      const result = await clientLibraryPath("app_123")

      expect(result).toBe("app_123/budibase-client.js")
      expect(mockIsEnabled).toHaveBeenCalledWith(
        FeatureFlag.USE_DYNAMIC_LOADING
      )
      expect(mockObjectExists).not.toHaveBeenCalled()
    })
  })

  describe("when USE_DYNAMIC_LOADING is enabled", () => {
    beforeAll(() => {
      mockIsEnabled.mockResolvedValue(true)
    })

    it("should return new client path when new file exists", async () => {
      mockObjectExists.mockResolvedValue(true)

      const result = await clientLibraryPath("app_123")

      expect(result).toBe("app_123/budibase-client.new.js")
      expect(mockIsEnabled).toHaveBeenCalledWith(
        FeatureFlag.USE_DYNAMIC_LOADING
      )
      expect(mockObjectExists).toHaveBeenCalledWith(
        "prod-budi-app-assets",
        "app_123/budibase-client.new.js"
      )
    })

    it("should fallback to old client path when new file doesn't exist", async () => {
      mockObjectExists.mockResolvedValue(false)

      const result = await clientLibraryPath("app_123")

      expect(result).toBe("app_123/budibase-client.js")
      expect(mockIsEnabled).toHaveBeenCalledWith(
        FeatureFlag.USE_DYNAMIC_LOADING
      )
      expect(mockObjectExists).toHaveBeenCalledWith(
        "prod-budi-app-assets",
        "app_123/budibase-client.new.js"
      )
    })
  })
})
