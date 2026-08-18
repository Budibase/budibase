import { expect } from "vitest"
import "@testing-library/jest-dom/vitest"

global.ResizeObserver = require("resize-observer-polyfill")

if (!Element.prototype.animate) {
  Element.prototype.animate = () => {
    const animation = Object.create(null)
    animation.cancel = () => {}
    Object.defineProperty(animation, "finished", {
      value: Promise.resolve(animation),
    })
    Object.defineProperty(animation, "onfinish", {
      set: callback => {
        if (callback) {
          queueMicrotask(() => callback.call(animation, new Event("finish")))
        }
      },
    })
    return animation
  }
}

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
