import { vi } from "vitest"

vi.mock("airtable", () => {
  return {
    base: vi.fn(),
  }
})
