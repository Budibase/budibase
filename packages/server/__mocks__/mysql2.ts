import { vi } from "vitest"

vi.mock("mysql2", () => {
  return {
    createConnection: vi.fn(() => ({
      connect: vi.fn(),
      query: vi.fn((query, bindings, fn) => {
        fn(null, [])
      }),
    })),
  }
})
