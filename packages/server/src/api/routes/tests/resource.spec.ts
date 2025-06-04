import TestConfiguration from "../../../tests/utilities/TestConfiguration"
import { Screen, Automation } from "@budibase/types"
import { createAutomationBuilder } from "../../../automations/tests/utilities/AutomationTestBuilder"

describe("/api/apps/:appId/resources/analyze", () => {
  const config = new TestConfiguration()

  beforeAll(async () => {
    await config.init()
  })

  afterAll(config.end)

  describe("resource analysis", () => {
    it("should analyze screens for datasource usage", async () => {})

    it("should analyze automations for datasource usage", async () => {})

    it("should handle empty inputs", async () => {})

    it("should handle missing request body", async () => {})
  })
})
