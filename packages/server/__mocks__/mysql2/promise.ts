import { vi } from "vitest"

vi.mock("mysql2/promise", () => {
  return {
    createConnection: vi.fn(async () => {
      return {
        connect: vi.fn(),
        end: vi.fn(),
        query: vi.fn(async () => {
          return [[]]
        }),
      }
    }),
  }
})
