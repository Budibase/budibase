import { vi } from "vitest"

vi.mock("@elastic/elasticsearch", () => {
  return {
    Client: vi.fn(() => {
      return {
        index: vi.fn(() => ({ body: [] })),
        search: vi.fn(() => ({
          body: {
            hits: {
              hits: [
                {
                  _source: {
                    name: "test",
                  },
                },
              ],
            },
          },
        })),
        update: vi.fn(() => ({ body: [] })),
        delete: vi.fn(() => ({ body: [] })),
        close: vi.fn(),
      }
    }),
  }
})
