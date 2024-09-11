import { expect } from "vitest"
import "@testing-library/jest-dom/vitest"

global.ResizeObserver = require("resize-observer-polyfill")

expect.extend({
  toBeFunc: received => {
    if (typeof received === "function") {
      return {
        pass: true,
      }
    }

    return {
      message: () => `expected ${received} to be a function`,
      pass: false,
    }
  },
  toBe: (received, expected) => {
    if (received === expected) {
      return {
        pass: true,
      }
    }

    return {
      message: () => `expected ${received} to be ${expected}`,
      pass: false,
    }
  },
})
