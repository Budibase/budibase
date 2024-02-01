import { vi } from "vitest"

vi.mock("pg", () => {
  const query = vi.fn(() => ({
    rows: [
      {
        a: "string",
        b: 1,
      },
    ],
  }))

  return {
    Client: vi.fn(() => ({
      query,
      connect: vi.fn(),
      release: vi.fn(),
      end: vi.fn(cb => {
        if (cb) cb()
      }),
    })),
    on: vi.fn(),
    queryMock: query,
    types: undefined,
  }
})
