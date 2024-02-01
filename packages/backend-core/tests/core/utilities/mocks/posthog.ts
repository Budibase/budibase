import { vi } from "vitest"

vi.mock("posthog-node", () => {
  return vi.fn().mockImplementation(() => {
    return {
      capture: vi.fn(),
    }
  })
})
