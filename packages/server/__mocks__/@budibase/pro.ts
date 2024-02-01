import * as pro from "@budibase/pro"
import { Mocked, vi } from "vitest"

vi.mock("@budibase/pro", async () => {
  const actual = (await vi.importActual("@budibase/pro")) as Mocked<typeof pro>
  return {
    ...actual,
    features: {
      ...actual.features,
      isTriggerAutomationRunEnabled: () => {
        return true
      },
    },
  }
})
