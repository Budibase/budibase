import { describe, expect, it } from "vitest"
import { routeMatchesPattern } from "./routeMatching"

describe("routeMatchesPattern", () => {
  it("matches a dynamic route pattern against a concrete route", () => {
    expect(routeMatchesPattern("/product/:id", "/product/55")).toBe(true)
  })

  it("does not match a different route", () => {
    expect(routeMatchesPattern("/product/:id", "/customer/55")).toBe(false)
  })

  it("ignores query parameters when matching", () => {
    expect(routeMatchesPattern("/product/:id", "/product/55?nav=details")).toBe(
      true
    )
  })
})
