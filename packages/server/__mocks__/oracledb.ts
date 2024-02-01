import { vi } from "vitest"

vi.mock("oracledb", () => {
  const executeMock = vi.fn(() => ({
    rows: [
      {
        a: "string",
        b: 1,
      },
    ],
  }))
  const closeMock = vi.fn()

  return {
    getConnection: vi.fn(() => ({
      execute: executeMock,
      close: closeMock,
    })),
    executeMock,
    closeMock,
  }
})
