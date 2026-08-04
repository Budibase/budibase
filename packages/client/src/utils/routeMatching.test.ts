import { describe, expect, it } from "vitest"
import { urlMatchesTemplate } from "./routeMatching"

describe("urlMatchesTemplate", () => {
  it("matches a dynamic route pattern against a concrete route", () => {
    expect(
      urlMatchesTemplate({ template: "/product/:id", url: "/product/55" })
    ).toBe(true)
  })

  it("does not match a different route", () => {
    expect(
      urlMatchesTemplate({ template: "/product/:id", url: "/customer/55" })
    ).toBe(false)
  })

  it("ignores query parameters when matching", () => {
    expect(
      urlMatchesTemplate({
        template: "/product/:id",
        url: "/product/55?nav=details",
      })
    ).toBe(true)
  })

  it("allows a trailing optional route segment to be omitted", () => {
    expect(
      urlMatchesTemplate({
        template: "/customers/:customerId/details/:tab?",
        url: "/customers/55/details",
      })
    ).toBe(true)
  })
})
