import { vi } from "vitest"

vi.mock("mssql", () => {
  return {
    query: vi.fn(() => ({
      recordset: [
        {
          a: "string",
          b: 1,
        },
      ],
    })),
    // connect: vi.fn(() => ({ recordset: [] })),
    ConnectionPool: vi.fn(() => ({
      connect: vi.fn(() => ({
        request: vi.fn(() => ({
          query: vi.fn(sql => ({ recordset: [sql] })),
        })),
      })),
    })),
  }
})
