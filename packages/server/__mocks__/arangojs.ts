import { vi } from "vitest"

vi.mock("arangojs", () => {
  return {
    Database: vi.fn(() => ({
      query: vi.fn(() => ({
        all: vi.fn(),
      })),
      collection: vi.fn(() => "collection"),
      close: vi.fn(),
    })),
    // @ts-ignore
    aql: (strings, ...args) => {
      let str = strings.join("{}")

      for (let arg of args) {
        str = str.replace("{}", arg)
      }

      return str
    },
  }
})
